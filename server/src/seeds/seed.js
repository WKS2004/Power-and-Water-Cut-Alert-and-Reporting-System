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
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Note for Member 1:
    // Add logic here to clear existing collections and insert initial admin, sample users,
    // and realistic reports for CEB power cuts and NWSB water cuts across all 8 predefined areas.

    console.log('[Seed] Template ready. Ready for Member 1 to populate sample dataset.');
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
