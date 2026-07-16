import { Schema,model } from 'mongoose';
export interface ISession{userId:string;refreshTokenHash:string;deviceId:string;deviceName:string;ipAddress:string;userAgent:string;rememberMe:boolean;lastActiveAt:Date;expiresAt:Date;revokedAt?:Date}
const schema=new Schema<ISession>({userId:{type:String,required:true,index:true},refreshTokenHash:{type:String,required:true},deviceId:{type:String,required:true},deviceName:{type:String,required:true},ipAddress:{type:String,required:true},userAgent:{type:String,required:true},rememberMe:{type:Boolean,default:false},lastActiveAt:{type:Date,default:Date.now},expiresAt:{type:Date,required:true,index:{expires:0}},revokedAt:Date},{timestamps:true});
export const Session=model<ISession>('Session',schema);
