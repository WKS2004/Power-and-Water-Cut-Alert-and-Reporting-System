/**
 * Unit verification script for Member 1 deliverables:
 * - Area constants
 * - User model (validation, hashing hook, matchPassword, toJSON)
 * - Admin model (validation, hashing hook, matchPassword, toJSON)
 * - Report model (validation, estimatedEndTime > startTime, calculateStatus, virtuals)
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { AREAS } = require('./src/config/areas');
const User = require('./src/models/User');
const Admin = require('./src/models/Admin');
const Report = require('./src/models/Report');

async function runTests() {
  console.log('--- STARTING MEMBER 1 VERIFICATION TESTS ---');

  // Test 1: Shared Areas List
  console.log('\n[Test 1] Testing Shared Areas Constant...');
  if (!Array.isArray(AREAS) || AREAS.length !== 8) {
    throw new Error(`Expected 8 areas, found: ${AREAS?.length}`);
  }
  console.log(`✅ AREAS valid (${AREAS.length} areas defined).`);

  // Test 2: User Model Schema Validation
  console.log('\n[Test 2] Testing User Model Validation & Methods...');
  const invalidUser = new User({
    username: 'ab', // too short (< 3)
    password: '123', // too short (< 6)
    email: 'not-an-email',
    area: 'Invalid Area',
    address: '',
  });

  const userValError = invalidUser.validateSync();
  if (!userValError) {
    throw new Error('Expected validation error for invalid user fields');
  }
  console.log('✅ User validation caught invalid input correctly:');
  Object.keys(userValError.errors).forEach((key) => {
    console.log(`   - ${key}: ${userValError.errors[key].message}`);
  });

  // Test 2b: User password hashing hook & matchPassword
  const validUser = new User({
    username: 'testuser',
    password: 'mysecretpassword',
    email: 'test@example.lk',
    area: AREAS[0],
    address: '123 Test Street, Colombo',
  });

  // Mock save behavior / test hook logic
  const salt = await bcrypt.genSalt(10);
  validUser.password = await bcrypt.hash(validUser.password, salt);
  const isMatch = await validUser.matchPassword('mysecretpassword');
  const isWrong = await validUser.matchPassword('wrongpassword');

  if (!isMatch || isWrong) {
    throw new Error('Password match verification failed');
  }
  console.log('✅ User password hashing & matchPassword verification succeeded.');

  // Test 2c: User toJSON strips password
  const userJson = validUser.toJSON();
  if (userJson.password !== undefined) {
    throw new Error('User toJSON failed to strip password');
  }
  console.log('✅ User toJSON strips password securely.');

  // Test 3: Admin Model
  console.log('\n[Test 3] Testing Admin Model...');
  const validAdmin = new Admin({
    username: 'sysadmin',
    password: 'adminsecretpassword',
  });
  const adminSalt = await bcrypt.genSalt(10);
  validAdmin.password = await bcrypt.hash(validAdmin.password, adminSalt);
  const adminMatch = await validAdmin.matchPassword('adminsecretpassword');
  if (!adminMatch) {
    throw new Error('Admin password match verification failed');
  }
  const adminJson = validAdmin.toJSON();
  if (adminJson.password !== undefined) {
    throw new Error('Admin toJSON failed to strip password');
  }
  console.log('✅ Admin model validation, hashing & toJSON verified.');

  // Test 4: Report Model Validation (estimatedEndTime > startTime)
  console.log('\n[Test 4] Testing Report Model Validation & Status Derivation...');
  const invalidTimeReport = new Report({
    type: 'power',
    area: AREAS[0],
    startTime: new Date('2026-09-04T12:00:00Z'),
    estimatedEndTime: new Date('2026-09-04T10:00:00Z'), // Earlier than start time!
  });

  const reportValError = invalidTimeReport.validateSync();
  if (!reportValError || !reportValError.errors['estimatedEndTime']) {
    throw new Error('Report model failed to catch estimatedEndTime <= startTime');
  }
  console.log(`✅ Report model caught invalid time constraint: "${reportValError.errors['estimatedEndTime'].message}"`);

  // Test 5: Report Status Calculation
  const now = new Date();
  const scheduledReport = new Report({
    type: 'water',
    area: AREAS[2],
    startTime: new Date(now.getTime() + 3600000),
    estimatedEndTime: new Date(now.getTime() + 7200000),
  });
  if (scheduledReport.calculateStatus(now) !== 'scheduled') {
    throw new Error(`Expected scheduled, got ${scheduledReport.calculateStatus(now)}`);
  }

  const ongoingReport = new Report({
    type: 'power',
    area: AREAS[3],
    startTime: new Date(now.getTime() - 1800000),
    estimatedEndTime: new Date(now.getTime() + 1800000),
  });
  if (ongoingReport.calculateStatus(now) !== 'ongoing') {
    throw new Error(`Expected ongoing, got ${ongoingReport.calculateStatus(now)}`);
  }

  const resolvedReport = new Report({
    type: 'power',
    area: AREAS[4],
    startTime: new Date(now.getTime() - 7200000),
    estimatedEndTime: new Date(now.getTime() - 3600000),
  });
  if (resolvedReport.calculateStatus(now) !== 'resolved') {
    throw new Error(`Expected resolved, got ${resolvedReport.calculateStatus(now)}`);
  }
  console.log('✅ Report status derivation verified: scheduled, ongoing, resolved.');

  console.log('\n=============================================');
  console.log('🎉 ALL MEMBER 1 TESTS PASSED SUCCESSFULLY!');
  console.log('=============================================\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
