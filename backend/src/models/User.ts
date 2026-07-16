import { Schema, model } from 'mongoose';
import { roles, type Role } from '../constants/roles.js';

export interface IUser { id:string; name:string; email:string; password:string; role:Role; avatarUrl?:string; customRoleId?:string; organizationId?:string; active:boolean; emailVerified:boolean; failedLoginAttempts:number; lockUntil?:Date; passwordChangedAt?:Date; mfaEnabled:boolean; mfaSecret?:string; }
const schema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  avatarUrl: String,
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: roles, default: 'EMPLOYEE' },
  customRoleId: { type: String, index: true },
  organizationId: { type: String, index: true },
  active: { type: Boolean, default: true }, emailVerified:{type:Boolean,default:false},
  failedLoginAttempts:{type:Number,default:0,select:false}, lockUntil:{type:Date,select:false}, passwordChangedAt:{type:Date},
  mfaEnabled:{type:Boolean,default:false}, mfaSecret:{type:String,select:false}
}, { timestamps: true });
export const User = model<IUser>('User', schema);
