import { Schema,model } from 'mongoose';
export interface ILoginActivity{userId?:string;email:string;success:boolean;reason?:string;ipAddress:string;userAgent:string;deviceName:string;createdAt:Date}
const schema=new Schema<ILoginActivity>({userId:{type:String,index:true},email:{type:String,required:true,index:true},success:{type:Boolean,required:true},reason:String,ipAddress:String,userAgent:String,deviceName:String},{timestamps:true});
export const LoginActivity=model<ILoginActivity>('LoginActivity',schema);
