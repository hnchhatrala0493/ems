import {Schema,model} from 'mongoose';
export const APPROVAL_TYPES=['LEAVE','ATTENDANCE_REGULARIZATION','WORK_FROM_HOME','OVERTIME','EXPENSE','TRAVEL','EMPLOYEE_ONBOARDING','RESIGNATION','ASSET_REQUEST','PAYROLL'] as const;
export const APPROVAL_STATUSES=['PENDING','APPROVED','REJECTED','SENT_BACK','FORWARDED','CANCELLED'] as const;
const timelineSchema=new Schema({action:{type:String,required:true},fromStatus:String,toStatus:String,actorId:{type:String,required:true},actorName:String,comment:String,forwardedTo:String,at:{type:Date,default:Date.now}},{_id:false});
const schema=new Schema({organizationId:{type:String,index:true},type:{type:String,enum:APPROVAL_TYPES,required:true,index:true},referenceId:{type:String,required:true},title:{type:String,required:true},summary:String,requesterId:{type:String,required:true},requesterName:{type:String,required:true},employeeId:String,employeeName:String,departmentId:String,departmentName:String,assignedTo:{type:String,required:true,index:true},status:{type:String,enum:APPROVAL_STATUSES,default:'PENDING',index:true},submittedAt:{type:Date,default:Date.now},metadata:{type:Schema.Types.Mixed,default:{}},timeline:{type:[timelineSchema],default:[]}},{timestamps:true});
schema.index({organizationId:1,assignedTo:1,status:1,submittedAt:-1});
export const Approval=model('Approval',schema);
