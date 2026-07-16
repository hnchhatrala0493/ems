import { Schema,model } from 'mongoose';
export type AuthTokenPurpose='PASSWORD_RESET'|'EMAIL_VERIFICATION'; export interface IAuthToken{userId:string;tokenHash:string;purpose:AuthTokenPurpose;expiresAt:Date;usedAt?:Date}
const schema=new Schema<IAuthToken>({userId:{type:String,required:true,index:true},tokenHash:{type:String,required:true,unique:true},purpose:{type:String,enum:['PASSWORD_RESET','EMAIL_VERIFICATION'],required:true},expiresAt:{type:Date,required:true,index:{expires:0}},usedAt:Date},{timestamps:true});
export const AuthToken=model<IAuthToken>('AuthToken',schema);
