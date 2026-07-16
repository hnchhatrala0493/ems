import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { roles, type Role } from '../constants/roles.js';
import { User } from '../models/User.js';

const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'Test@12345';
const EMAIL_DOMAIN = process.env.TEST_USER_EMAIL_DOMAIN || 'employeehub.test';

function emailFor(role: Role) {
  return `${role.toLowerCase().replaceAll('_', '.')}@${EMAIL_DOMAIN}`;
}

function displayName(role: Role) {
  return role
    .toLowerCase()
    .split('_')
    .map(part => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}

await mongoose.connect(env.MONGODB_URI);

try {
  const existingOrganizationUser = await User.findOne({
    organizationId: { $exists: true, $nin: ['', null] },
  })
    .sort({ createdAt: 1 })
    .select('organizationId')
    .lean();

  const organizationId =
    process.env.TEST_ORGANIZATION_ID ||
    existingOrganizationUser?.organizationId ||
    'employeehub-test-org';
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  const credentials: Array<{ role: Role; email: string }> = [];
  for (const role of roles) {
    const email = emailFor(role);
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          name: `${displayName(role)} Test`,
          email,
          password: passwordHash,
          role,
          organizationId,
          active: true,
          emailVerified: true,
          mfaEnabled: false,
          failedLoginAttempts: 0,
        },
        $unset: { lockUntil: 1, mfaSecret: 1 },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    credentials.push({ role, email });
  }

  console.log(JSON.stringify({ organizationId, password: TEST_PASSWORD, credentials }, null, 2));
} finally {
  await mongoose.disconnect();
}
