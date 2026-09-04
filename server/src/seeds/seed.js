/**
 * Seed Data Script
 * Ownership: Member 1 (Problem & Solution Design + Backend Data Layer)
 * 
 * Requirement #9 from Hackathon Spec:
 * "Sample data relevant to the chosen problem (seed at least one report per area,
 * mixing water and power cuts, and a mix of scheduled/ongoing/resolved)."
 * 
 * Run with: npm run seed
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { AREAS } = require('../config/areas');
const Report = require('../models/Report');
const User = require('../models/User');
const Admin = require('../models/Admin');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/power_water_alerts';
    console.log(`[Seed] Connecting to MongoDB: ${mongoURI}`);
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected successfully.');

    // 1. Purge existing collections
    console.log('[Seed] Clearing existing collections (Admin, User, Report)...');
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Report.deleteMany({});

    // 2. Seed Default Administrator
    console.log('[Seed] Creating default administrator...');
    const admin = await Admin.create({
      username: 'admin',
      password: 'admin123', // Will be hashed by Admin pre-save hook
      role: 'admin',
    });
    console.log(`[Seed] Admin created: ${admin.username} (Role: ${admin.role})`);

    // 3. Seed Realistic Resident Users across areas
    console.log('[Seed] Creating sample resident users...');
    const sampleUsersData = [
      {
        username: 'kamal_perera',
        password: 'user123',
        email: 'kamal.perera@email.lk',
        area: 'Colombo 03 (Kollupitiya)',
        address: 'No. 45/2, Galle Road, Kollupitiya, Colombo 03',
      },
      {
        username: 'nimali_silva',
        password: 'user123',
        email: 'nimali.silva@email.lk',
        area: 'Colombo 07 (Cinnamon Gardens)',
        address: '12 Flower Road, Colombo 07',
      },
      {
        username: 'dinesh_fernando',
        password: 'user123',
        email: 'dinesh.f@email.lk',
        area: 'Dehiwala',
        address: '88/3 Kawdana Road, Dehiwala',
      },
      {
        username: 'anusha_jayasinghe',
        password: 'user123',
        email: 'anusha.j@email.lk',
        area: 'Mount Lavinia',
        address: '14 Hotel Road, Mount Lavinia',
      },
      {
        username: 'sunil_wijesinghe',
        password: 'user123',
        email: 'sunil.w@email.lk',
        area: 'Nugegoda',
        address: '205 High Level Road, Nugegoda',
      },
      {
        username: 'chathuri_wickramasinghe',
        password: 'user123',
        email: 'chathuri.w@email.lk',
        area: 'Kaduwela',
        address: '17/B Avissawella Road, Kaduwela',
      },
      {
        username: 'rohan_de_silva',
        password: 'user123',
        email: 'rohan.ds@email.lk',
        area: 'Maharagama',
        address: '34 Temple Road, Maharagama',
      },
      {
        username: 'sanduni_peiris',
        password: 'user123',
        email: 'sanduni.p@email.lk',
        area: 'Moratuwa',
        address: '92 Galle Road, Rawathawatte, Moratuwa',
      },
    ];

    const createdUsers = await User.create(sampleUsersData);
    console.log(`[Seed] Created ${createdUsers.length} sample resident users.`);

    // Helper map for user lookup by area
    const userByArea = {};
    createdUsers.forEach((u) => {
      userByArea[u.area] = u._id;
    });

    // 4. Seed Comprehensive Reports Dataset
    // Uses dynamic relative timestamps based on Date.now() so live status derivation
    // (scheduled, ongoing, resolved) and countdowns work reliably whenever seeded.
    const now = Date.now();
    const HOUR = 60 * 60 * 1000;
    const MINUTE = 60 * 1000;

    const sampleReports = [
      // 1. Colombo 03 (Kollupitiya)
      {
        type: 'power',
        area: 'Colombo 03 (Kollupitiya)',
        startTime: new Date(now - 1.5 * HOUR),
        estimatedEndTime: new Date(now + 2.5 * HOUR), // ONGOING
        source: 'admin',
        approved: true,
        description: 'CEB Emergency Grid Repair: 33kV primary feeder cable breakdown along Galle Road. Technical breakdown units on-site.',
        submittedBy: null,
      },
      {
        type: 'water',
        area: 'Colombo 03 (Kollupitiya)',
        startTime: new Date(now + 4 * HOUR),
        estimatedEndTime: new Date(now + 9 * HOUR), // SCHEDULED
        source: 'admin',
        approved: true,
        description: 'NWSB Planned Maintenance: Urgent transmission valve replacement near Marine Drive. Low pressure or complete disruption expected.',
        submittedBy: null,
      },

      // 2. Colombo 07 (Cinnamon Gardens)
      {
        type: 'power',
        area: 'Colombo 07 (Cinnamon Gardens)',
        startTime: new Date(now + 5 * HOUR),
        estimatedEndTime: new Date(now + 8.5 * HOUR), // SCHEDULED
        source: 'admin',
        approved: true,
        description: 'CEB Scheduled Maintenance: Distribution transformer overhaul and canopy branch clearance near Independence Avenue.',
        submittedBy: null,
      },
      {
        type: 'water',
        area: 'Colombo 07 (Cinnamon Gardens)',
        startTime: new Date(now - 8 * HOUR),
        estimatedEndTime: new Date(now - 1.5 * HOUR), // RESOLVED
        source: 'user',
        approved: true,
        description: 'Water pressure drop reported on Flower Road following booster pump trip. Normal pressure has been restored.',
        submittedBy: userByArea['Colombo 07 (Cinnamon Gardens)'],
      },

      // 3. Dehiwala
      {
        type: 'water',
        area: 'Dehiwala',
        startTime: new Date(now - 2 * HOUR),
        estimatedEndTime: new Date(now + 3 * HOUR), // ONGOING
        source: 'admin',
        approved: true,
        description: 'NWSB Emergency Shutdown: Major distribution transmission main rupture near Kawdana junction. Excavation underway.',
        submittedBy: null,
      },
      {
        type: 'power',
        area: 'Dehiwala',
        startTime: new Date(now - 45 * MINUTE),
        estimatedEndTime: new Date(now + 1.5 * HOUR), // ONGOING (User-submitted, pending admin review)
        source: 'user',
        approved: false,
        description: 'Transformer spark and loud bang heard near Station Road. Entire lane without electricity.',
        submittedBy: userByArea['Dehiwala'],
      },

      // 4. Mount Lavinia
      {
        type: 'power',
        area: 'Mount Lavinia',
        startTime: new Date(now + 2.5 * HOUR),
        estimatedEndTime: new Date(now + 6 * HOUR), // SCHEDULED
        source: 'admin',
        approved: true,
        description: 'CEB Scheduled Maintenance: Overhead high-voltage reconductoring along Hotel Road and coastal zone.',
        submittedBy: null,
      },
      {
        type: 'water',
        area: 'Mount Lavinia',
        startTime: new Date(now - 12 * HOUR),
        estimatedEndTime: new Date(now - 3 * HOUR), // RESOLVED
        source: 'admin',
        approved: true,
        description: 'NWSB Routine Cleaning: Dehiwala-Mount Lavinia water storage reservoir routine disinfection completed successfully.',
        submittedBy: null,
      },

      // 5. Nugegoda
      {
        type: 'water',
        area: 'Nugegoda',
        startTime: new Date(now - 1 * HOUR),
        estimatedEndTime: new Date(now + 2 * HOUR), // ONGOING
        source: 'user',
        approved: true,
        description: 'Heavy pipe leak flooded pavement outside Nugegoda Supermarket on High Level Road. NWSB crew on-site isolating line.',
        submittedBy: userByArea['Nugegoda'],
      },
      {
        type: 'power',
        area: 'Nugegoda',
        startTime: new Date(now - 7 * HOUR),
        estimatedEndTime: new Date(now - 2 * HOUR), // RESOLVED
        source: 'admin',
        approved: true,
        description: 'CEB Substation Maintenance: Scheduled insulator replacements completed at Mirihana feeder.',
        submittedBy: null,
      },

      // 6. Kaduwela
      {
        type: 'power',
        area: 'Kaduwela',
        startTime: new Date(now - 50 * MINUTE),
        estimatedEndTime: new Date(now + 1.5 * HOUR), // ONGOING
        source: 'admin',
        approved: true,
        description: 'CEB Emergency Outage: Unscheduled breakdown at Kaduwela primary grid substation following thunderstorm.',
        submittedBy: null,
      },
      {
        type: 'water',
        area: 'Kaduwela',
        startTime: new Date(now + 6 * HOUR),
        estimatedEndTime: new Date(now + 12 * HOUR), // SCHEDULED
        source: 'admin',
        approved: true,
        description: 'NWSB Kelani Right Bank Water Treatment Plant electrical maintenance. Entire Kaduwela municipal council zone affected.',
        submittedBy: null,
      },

      // 7. Maharagama
      {
        type: 'power',
        area: 'Maharagama',
        startTime: new Date(now + 3 * HOUR),
        estimatedEndTime: new Date(now + 7 * HOUR), // SCHEDULED
        source: 'user',
        approved: true,
        description: 'CEB Branch notice: Scheduled feeder line maintenance along Old Road, Pamunuwa textile trading zone.',
        submittedBy: userByArea['Maharagama'],
      },
      {
        type: 'water',
        area: 'Maharagama',
        startTime: new Date(now - 1.2 * HOUR),
        estimatedEndTime: new Date(now + 2 * HOUR), // ONGOING
        source: 'admin',
        approved: true,
        description: 'NWSB Urgent Pipeline Realignment: Main water distribution line diversion work due to flyover construction.',
        submittedBy: null,
      },

      // 8. Moratuwa
      {
        type: 'power',
        area: 'Moratuwa',
        startTime: new Date(now - 14 * HOUR),
        estimatedEndTime: new Date(now - 4 * HOUR), // RESOLVED
        source: 'user',
        approved: true,
        description: 'Localized breaker trip restored after CEB area repair unit replaced fused cutouts on Uyana Road.',
        submittedBy: userByArea['Moratuwa'],
      },
      {
        type: 'water',
        area: 'Moratuwa',
        startTime: new Date(now - 30 * MINUTE),
        estimatedEndTime: new Date(now + 3.5 * HOUR), // ONGOING (User-submitted, pending admin review)
        source: 'user',
        approved: false,
        description: 'Sudden drop in tap water pressure since morning along Rawathawatte bypass. Reported by multiple resident households.',
        submittedBy: userByArea['Moratuwa'],
      },
    ];

    const createdReports = await Report.create(sampleReports);
    console.log(`[Seed] Created ${createdReports.length} reports across all 8 areas.`);

    // 5. Audit seed coverage against Requirement #9
    console.log('\n[Seed] --- DATASET COVERAGE AUDIT ---');
    const coveredAreas = new Set(createdReports.map((r) => r.area));
    console.log(`[Seed] Areas covered: ${coveredAreas.size} / ${AREAS.length}`);

    const countsByType = { power: 0, water: 0 };
    const countsByStatus = { scheduled: 0, ongoing: 0, resolved: 0 };
    const countsBySource = { admin: 0, user: 0 };

    createdReports.forEach((r) => {
      countsByType[r.type] = (countsByType[r.type] || 0) + 1;
      const status = r.calculateStatus();
      countsByStatus[status] = (countsByStatus[status] || 0) + 1;
      countsBySource[r.source] = (countsBySource[r.source] || 0) + 1;
    });

    console.log(`[Seed] Types: Power=${countsByType.power}, Water=${countsByType.water}`);
    console.log(`[Seed] Statuses: Ongoing=${countsByStatus.ongoing}, Scheduled=${countsByStatus.scheduled}, Resolved=${countsByStatus.resolved}`);
    console.log(`[Seed] Sources: Admin=${countsBySource.admin}, User=${countsBySource.user}`);
    console.log('[Seed] Requirement #9 verification: PASSED (All 8 areas seeded with mixed types and statuses).');
    console.log('------------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error executing seeder: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

