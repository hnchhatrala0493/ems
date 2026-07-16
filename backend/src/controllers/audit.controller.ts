import type { NextFunction, Request, Response } from 'express';
import { Audit } from '../models/Audit.js';
import { ok } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import mongoose from 'mongoose';

const moduleLabels:Record<string,string>={employees:'Employees',masters:'Department & Designation Management',roles:'Roles & Permissions',modules:'Dynamic Modules',permissions:'Permissions',attendance:'Attendance',holidays:'Holidays',shifts:'Shifts',leaves:'Leaves',payroll:'Payroll',recruitment:'Recruitment',performance:'Performance',documents:'Documents',assets:'Assets',reports:'Reports',notifications:'Notifications','email-templates':'Email Templates',onboarding:'Onboarding',offboarding:'Offboarding',auth:'Authentication',audit:'Audit Logs'};
const collections:Record<string,string[]>={employees:['employees'],masters:['organizationmasters'],roles:['roledefinitions'],modules:['accessmodules'],permissions:['accesspermissions'],attendance:['attendances'],holidays:['holidays'],shifts:['shifts','shiftassignments','shiftrotations'],leaves:['leaverequests','leavetypes'],payroll:['payrolls'],recruitment:['recruitments'],performance:['performances'],documents:['documents'],assets:['assets'],notifications:['notifications'],onboarding:['onboardings'],offboarding:['offboardings'],'email-templates':['emailtemplates']};
const objectId=/^[a-f\d]{24}$/i;
function moduleInfo(path:string){const parts=String(path).split('?')[0]!.split('/').filter(Boolean);const key=parts.find(part=>moduleLabels[part]);return{key:key||'system',label:key?moduleLabels[key]:'System'}}
async function recordLabel(entry:any,key:string){const raw=String(entry.record||entry.params?.id||entry.params?.employeeId||'');const body=entry.body||{};const bodyLabel=body.name||body.title||body.code||body.employeeId||body.email;if(!objectId.test(raw))return raw&&raw!=='—'?raw:(bodyLabel||'—');for(const collection of collections[key]||[]){const doc:any=await mongoose.connection.collection(collection).findOne({_id:new mongoose.Types.ObjectId(raw)},{projection:{name:1,title:1,code:1,employeeId:1,firstName:1,lastName:1,email:1}});if(doc)return doc.name||doc.title||doc.code||doc.employeeId||[doc.firstName,doc.lastName].filter(Boolean).join(' ')||doc.email||raw}return bodyLabel||raw}

export async function listAudits(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: Record<string, any> = {};
    if (req.query.userId) filter.userId = String(req.query.userId);
    if (req.query.organizationId) filter.organizationId = String(req.query.organizationId);
    if (req.query.method) filter.method = String(req.query.method).toUpperCase();
    if (req.query.path) filter.path = { $regex: String(req.query.path), $options: 'i' };
    if (req.query.statusCode) filter.statusCode = Number(req.query.statusCode);
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(String(req.query.from));
      if (req.query.to) filter.createdAt.$lte = new Date(String(req.query.to));
    }

    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const audits = await Audit.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
    const userIds = [...new Set(audits.map((entry) => entry.userId).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    const unresolvedIds=userIds.filter(id=>!users.some(user=>String(user._id)===String(id))&&objectId.test(String(id)));
    const employees=await Employee.find({_id:{$in:unresolvedIds}}).select('firstName lastName email').lean();
    const userMap = new Map<string,{name:string;email:string}>(users.map((user) => [String(user._id),{name:user.name,email:user.email}]));
    employees.forEach(employee=>userMap.set(String(employee._id),{name:[employee.firstName,employee.lastName].filter(Boolean).join(' '),email:employee.email}));
    const data = await Promise.all(audits.map(async (entry: any) => {
      const user = userMap.get(String(entry.userId))||(entry.userName?{name:entry.userName,email:entry.userEmail||''}:null);
      const action = entry.action || (entry.method === 'POST' ? 'CREATE' : ['PATCH', 'PUT'].includes(entry.method) ? 'UPDATE' : entry.method === 'DELETE' ? 'DELETE' : 'VIEW');
      const module = moduleInfo(entry.path);
      return { ...entry, action, module: module.label, user: user ? { name: user.name, email: user.email } : null, description: entry.description || `${action.toLowerCase()} request on ${module.label}`, record: await recordLabel(entry,module.key), status: entry.status || (entry.statusCode < 400 ? 'SUCCESS' : 'FAILED'), severity: entry.severity || (entry.statusCode >= 500 ? 'CRITICAL' : entry.statusCode >= 400 || action === 'DELETE' ? 'WARNING' : 'INFO') };
    }));
    ok(res, data, 'Audit entries retrieved');
  } catch (error) {
    next(new AppError(500, 'Unable to load audit logs', 'AUDIT_LOAD_ERROR'));
  }
}
