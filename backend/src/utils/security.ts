import crypto from 'node:crypto'; import { env } from '../config/environment.js';
export const hashToken=(value:string)=>crypto.createHash('sha256').update(value).digest('hex');
export const randomToken=()=>crypto.randomBytes(32).toString('hex');
const key=crypto.createHash('sha256').update(env.ENCRYPTION_KEY||env.JWT_ACCESS_SECRET).digest();
export function encrypt(value:string){const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',key,iv);const data=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv.toString('hex'),cipher.getAuthTag().toString('hex'),data.toString('hex')].join('.')}
export function decrypt(value:string){const [ivHex,tagHex,dataHex]=value.split('.');if(!ivHex||!tagHex||!dataHex)throw new Error('Invalid encrypted value');const decipher=crypto.createDecipheriv('aes-256-gcm',key,Buffer.from(ivHex,'hex'));decipher.setAuthTag(Buffer.from(tagHex,'hex'));return Buffer.concat([decipher.update(Buffer.from(dataHex,'hex')),decipher.final()]).toString('utf8')}
export const newMfaSecret=()=>crypto.randomBytes(20).toString('hex');
export function totp(secret:string,offset=0){const counter=Math.floor(Date.now()/30000)+offset;const buffer=Buffer.alloc(8);buffer.writeBigUInt64BE(BigInt(counter));const digest=crypto.createHmac('sha1',Buffer.from(secret,'hex')).update(buffer).digest();const start=digest[19]!&15;const binary=(digest.readUInt32BE(start)&0x7fffffff)%1_000_000;return binary.toString().padStart(6,'0')}
export const verifyTotp=(secret:string,code:string)=>[-1,0,1].some(offset=>totp(secret,offset)===code);
