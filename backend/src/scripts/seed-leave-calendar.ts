import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { LeaveType } from '../models/LeaveType.js';
import { LeaveBalance } from '../models/LeaveBalance.js';
import { Holiday } from '../models/Holiday.js';

const year = new Date().getFullYear();
const leaveTypes = [
  { code: 'CL', name: 'Casual Leave', annualAllocation: 12, maximumConsecutiveDays: 4 },
  { code: 'SL', name: 'Sick Leave', annualAllocation: 6, maximumConsecutiveDays: 6 },
  { code: 'EL', name: 'Earned Leave', annualAllocation: 18, maximumConsecutiveDays: 15 },
  { code: 'ML', name: 'Maternity Leave', annualAllocation: 182, maximumConsecutiveDays: 182, genderRestriction: 'FEMALE', workflowType: 'HR' },
  { code: 'MRL', name: 'Marriage Leave', annualAllocation: 5, maximumConsecutiveDays: 5 },
  { code: 'CO', name: 'Compensatory Off', annualAllocation: 0, maximumConsecutiveDays: 2 },
] as const;

const holidays = [
  ['New Year’s Day', `${year}-01-01`],
  ['Republic Day', `${year}-01-26`],
  ['Holi', `${year}-03-04`],
  ['Id-ul-Fitr', `${year}-03-21`],
  ['Ram Navami', `${year}-03-26`],
  ['Mahavir Jayanti', `${year}-03-31`],
  ['Good Friday', `${year}-04-03`],
  ['Buddha Purnima', `${year}-05-01`],
  ['Id-ul-Zuha (Bakrid)', `${year}-05-27`],
  ['Muharram', `${year}-06-26`],
  ['Independence Day', `${year}-08-15`],
  ['Id-e-Milad', `${year}-08-26`],
  ['Janmashtami', `${year}-09-04`],
  ['Mahatma Gandhi’s Birthday', `${year}-10-02`],
  ['Dussehra', `${year}-10-20`],
  ['Diwali', `${year}-11-08`],
  ['Guru Nanak’s Birthday', `${year}-11-24`],
  ['Christmas Day', `${year}-12-25`],
] as const;

await mongoose.connect(env.MONGODB_URI);
try {
  const users = await User.find({ active: true, organizationId: { $exists: true, $nin: ['', null] } }).lean();
  if (users.length) {
    await Employee.bulkWrite(users.map(user => {
      const parts = user.name.trim().split(/\s+/);
      return {
        updateOne: {
          filter: { organizationId: user.organizationId, email: user.email },
          update: { $setOnInsert: {
            organizationId: user.organizationId,
            employeeId: `USR-${String(user._id).slice(-8).toUpperCase()}`,
            firstName: parts[0] || 'Employee',
            lastName: parts.slice(1).join(' ') || 'User',
            email: user.email,
            personalEmail: user.email,
            employeeType: 'PERMANENT',
            status: 'ACTIVE',
            department: 'UNASSIGNED',
            designation: user.role,
            joiningDate: new Date(),
            deletedAt: null,
          } },
          upsert: true,
        },
      };
    }), { ordered: false });
  }

  const organizationIds = [...new Set([
    ...users.map(user => user.organizationId),
    ...await Employee.distinct('organizationId', { deletedAt: null }),
  ].filter((value): value is string => Boolean(value)))];

  let employeeCount = 0;
  for (const organizationId of organizationIds) {
    for (const type of leaveTypes) {
      await LeaveType.findOneAndUpdate(
        { organizationId, code: type.code },
        { $set: { ...type, paid: true, status: 'ACTIVE', carryForward: type.code==='EL', maximumCarryForward:type.code==='EL'?30:0, negativeBalanceAllowed: false, workflowType: 'workflowType' in type?type.workflowType:'MANAGER' } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    const types = await LeaveType.find({ organizationId, code: { $in: leaveTypes.map(type => type.code) } }).lean();
    const employees = await Employee.find({ organizationId, deletedAt: null }).select('_id').lean();
    employeeCount += employees.length;
    if (employees.length && types.length) {
      await LeaveBalance.bulkWrite(employees.flatMap(employee => types.map(type => ({
        updateOne: {
          filter: { organizationId, employeeId: employee._id, leaveTypeId: type._id, year },
          update: { $set: { allocated: type.annualAllocation }, $setOnInsert: { carriedForward: 0, used: 0, pending: 0, encashed: 0 } },
          upsert: true,
        },
      }))), { ordered: false });
    }
    await Holiday.bulkWrite(holidays.map(([name, date]) => ({
      updateOne: {
        filter: { organizationId, date, name },
        update: { $set: { type: 'PUBLIC', optional: false, status: 'ACTIVE' } },
        upsert: true,
      },
    })), { ordered: false });
  }
  console.log(JSON.stringify({ year, organizations: organizationIds.length, employees: employeeCount, leaveTypes: leaveTypes.map(type=>({code:type.code,days:type.annualAllocation})), publicHolidays: holidays.length }));
} finally {
  await mongoose.disconnect();
}
