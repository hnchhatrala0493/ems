import{Schema,model}from'mongoose';
const schema=new Schema({organizationId:{type:String,index:true},employeeId:{type:Schema.Types.ObjectId,ref:'Employee',required:true,index:true},attendanceId:{type:Schema.Types.ObjectId,ref:'Attendance',required:true,index:true},notificationType:{type:String,required:true},channel:{type:String,enum:['IN_APP','SWEET_ALERT','EMAIL','PUSH'],required:true},scheduledAt:Date,sentAt:Date,deliveryStatus:{type:String,enum:['PENDING','SENT','FAILED'],default:'PENDING'},failureReason:String,isRead:{type:Boolean,default:false}},{timestamps:true});
schema.index({attendanceId:1,notificationType:1,channel:1},{unique:true});
export const AttendanceNotification=model('AttendanceNotification',schema);
