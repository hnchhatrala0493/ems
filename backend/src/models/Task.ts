import { Schema, model } from 'mongoose';

export const TASK_STATUSES=['TODO','TO_DO','IN_PROGRESS','ON_HOLD','UNDER_REVIEW','COMPLETED','CANCELLED','OVERDUE'] as const;
export const TASK_PRIORITIES=['LOW','MEDIUM','HIGH','URGENT','CRITICAL'] as const;
const schema=new Schema({
 organizationId:{type:String,index:true},title:{type:String,required:true,trim:true,maxlength:180},description:{type:String,maxlength:5000},
 assignedEmployee:{type:String,required:true,index:true},assignedBy:{type:String,required:true},project:String,
 priority:{type:String,enum:TASK_PRIORITIES,default:'MEDIUM'},startDate:String,dueDate:{type:String,index:true},
 status:{type:String,enum:TASK_STATUSES,default:'TODO',index:true},progress:{type:Number,min:0,max:100,default:0},
 comments:[{message:String,text:String,userId:String,createdAt:{type:Date,default:Date.now}}],
 attachments:[{name:String,url:{type:String,required:true},mimeType:String,size:Number,uploadedAt:{type:Date,default:Date.now}}],
 subtasks:[{title:{type:String,required:true},completed:{type:Boolean,default:false},assigneeId:String}],
 activity:[{action:String,description:String,actorId:String,createdAt:{type:Date,default:Date.now}}],updatedBy:String
},{timestamps:true});
schema.index({organizationId:1,assignedEmployee:1,status:1});
export const Task=model('Task',schema);
