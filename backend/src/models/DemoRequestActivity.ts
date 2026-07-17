import{Schema,model}from'mongoose';
const schema=new Schema({demoRequestId:{type:Schema.Types.ObjectId,ref:'DemoRequest',required:true,index:true},actorUserId:{type:Schema.Types.ObjectId,ref:'User'},actorRole:String,action:{type:String,required:true},oldValue:Schema.Types.Mixed,newValue:Schema.Types.Mixed,ipAddress:String,userAgent:String},{timestamps:{createdAt:true,updatedAt:false}});
export const DemoRequestActivity=model('DemoRequestActivity',schema);
