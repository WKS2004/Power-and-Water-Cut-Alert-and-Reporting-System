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
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { AREAS } = require('../config/areas');
const Report = require('../models/Report');
const User = require('../models/User');
const Admin = require('../models/Admin');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/power_water_alerts';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB...');

    // --- Clear existing collections ---
    await Admin.deleteMany({});
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('[Seed] Cleared existing Admin, User, and Report collections.');

    // --- Create admin account ---
    const adminPass = await bcrypt.hash('admin123', 10);
    const admin = await Admin.create({ username: 'admin', password: adminPass });
    console.log(`[Seed] Admin created: admin / admin123`);

    // --- Create sample resident users (one per a few areas) ---
    const userPass = await bcrypt.hash('user123', 10);
    const users = await User.insertMany([
      {
        username: 'colombo3',
        password: userPass,
        email: 'kasun@example.lk',
        area: 'Colombo 03 (Kollupitiya)',
        address: '42/1 Galle Road, Kollupitiya, Colombo 03',
      },
      {
        username: 'nimali_w',
        password: userPass,
        email: 'nimali@example.lk',
        area: 'Dehiwala',
        address: '15 Vandervort Place, Dehiwala',
      },
      {
        username: 'sunil_silva',
        password: userPass,
        email: 'sunil@example.lk',
        area: 'Mount Lavinia',
        address: '78 Hotel Road, Mount Lavinia',
      },
      {
        username: 'chamara_k',
        password: userPass,
        email: 'chamara@example.lk',
        area: 'Nugegoda',
        address: '12 High Level Road, Nugegoda',
      },
    ]);
    console.log(`[Seed] ${users.length} resident users created.`);

    // --- Time references for realistic mixed statuses ---
    const now = new Date();
    const past = (h) => new Date(now.getTime() - h * 3600 * 1000);
    const future = (h) => new Date(now.getTime() + h * 3600 * 1000);

    // --- Seed Reports ---
    // Mix of admin-issued (approved) and user-submitted (approved + pending)
    // Each area gets at least 1 report; mix of power/water and scheduled/ongoing/resolved
    const reports = await Report.insertMany([
      // ── COLOMBO 03 — Power, ONGOING (admin-issued)
      {
        type: 'power',
        area: 'Colombo 03 (Kollupitiya)',
        startTime: past(2),
        estimatedEndTime: future(1.25),
        source: 'admin',
        approved: true,
        description: 'Scheduled 33kV substation switchgear overhaul and distribution feeder line maintenance by CEB field engineers.',
        submittedBy: null,
      },
      // ── COLOMBO 07 — Water, SCHEDULED (admin-issued)
      {
        type: 'water',
        area: 'Colombo 07 (Cinnamon Gardens)',
        startTime: future(3),
        estimatedEndTime: future(11),
        source: 'admin',
        approved: true,
        description: 'Main transmission valve replacement at Horton Place junction. Affected streets: Horton Place, Ward Place, Cambridge Terrace.',
        submittedBy: null,
      },
      // ── DEHIWALA — Water, ONGOING (user-submitted, approved)
      {
        type: 'water',
        area: 'Dehiwala',
        startTime: past(1),
        estimatedEndTime: future(2),
        source: 'user',
        approved: true,
        description: 'Severe pipe burst near Dehiwala supermarket junction. Zero household water pressure in surrounding streets.',
        submittedBy: users[1]._id,
      },
      // ── DEHIWALA — Power, RESOLVED (admin-issued)
      {
        type: 'power',
        area: 'Dehiwala',
        startTime: past(5),
        estimatedEndTime: past(2),
        source: 'admin',
        approved: true,
        description: 'Emergency repair to damaged overhead line section after storm damage. Restoration completed ahead of schedule.',
        submittedBy: null,
      },
      // ── MOUNT LAVINIA — Power, SCHEDULED (user-submitted, approved)
      {
        type: 'power',
        area: 'Mount Lavinia',
        startTime: future(1),
        estimatedEndTime: future(5),
        source: 'user',
        approved: true,
        description: 'Single-phase voltage drops and flickering streetlights near Hotel Road junction. Reported to CEB.',
        submittedBy: users[2]._id,
      },
      // ── NUGEGODA — Water, ONGOING (admin-issued)
      {
        type: 'water',
        area: 'Nugegoda',
        startTime: past(0.5),
        estimatedEndTime: future(3),
        source: 'admin',
        approved: true,
        description: 'NWSDB routine pipeline flushing and pressure testing along High Level Road corridor.',
        submittedBy: null,
      },
      // ── KADUWELA — Power, SCHEDULED (admin-issued)
      {
        type: 'power',
        area: 'Kaduwela',
        startTime: future(6),
        estimatedEndTime: future(10),
        source: 'admin',
        approved: true,
        description: 'Planned 11kV feeder switching for grid capacity upgrade. Kaduwela industrial zone and adjacent residential areas affected.',
        submittedBy: null,
      },
      // ── MAHARAGAMA — Water, RESOLVED (user-submitted, approved)
      {
        type: 'water',
        area: 'Maharagama',
        startTime: past(8),
        estimatedEndTime: past(4),
        source: 'user',
        approved: true,
        description: 'Water supply interruption due to burst main at Maharagama junction. Supply restored by NWSDB repair crew.',
        submittedBy: null,
      },
      // ── MORATUWA — Power, ONGOING (admin-issued)
      {
        type: 'power',
        area: 'Moratuwa',
        startTime: past(1),
        estimatedEndTime: future(2.5),
        source: 'admin',
        approved: true,
        description: 'Transformer replacement at Rawathawatte substation affecting Rawathawatte, Uswatte, and parts of Katubedda.',
        submittedBy: null,
      },
      // ── MORATUWA — Water, SCHEDULED (admin-issued)
      {
        type: 'water',
        area: 'Moratuwa',
        startTime: future(14),
        estimatedEndTime: future(20),
        source: 'admin',
        approved: true,
        description: 'Planned water supply interruption for service reservoir maintenance at Moratuwa elevated tank.',
        submittedBy: null,
      },
      // ── COLOMBO 03 — Power, user-submitted PENDING (not approved) — for admin review queue
      {
        type: 'power',
        area: 'Colombo 03 (Kollupitiya)',
        startTime: past(0.2),
        estimatedEndTime: future(1),
        source: 'user',
        approved: false,
        description: 'Sudden spark observed at transformer post on Lane 2. Total blackout on lanes 2 & 3. Needs urgent attention.',
        submittedBy: users[0]._id,
      },
      // ── NUGEGODA — Water, user-submitted PENDING — for admin review queue
      {
        type: 'water',
        area: 'Nugegoda',
        startTime: past(0.5),
        estimatedEndTime: future(2),
        source: 'user',
        approved: false,
        description: 'No water pressure since morning. Affecting multiple households along Colombo Road, Nugegoda.',
        submittedBy: users[3]._id,
      },
    ]);

    console.log(`[Seed] ${reports.length} outage reports seeded across ${AREAS.length} areas.`);
    console.log('\n[Seed] ✅ Database seeded successfully!\n');
    console.log('--- Test Credentials ---');
    console.log('Admin:    admin    / admin123');
    console.log('Users:    colombo3 / user123');
    console.log('          nimali_w / user123');
    console.log('          sunil_silva / user123');
    console.log('          chamara_k / user123');
    console.log('------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed] Error: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
