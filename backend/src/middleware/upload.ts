import multer from 'multer'; import path from 'node:path'; import fs from 'node:fs'; import crypto from 'node:crypto';
const directory=path.resolve(process.cwd(),'uploads','documents');fs.mkdirSync(directory,{recursive:true});
const storage=multer.diskStorage({destination:directory,filename:(_req,file,done)=>done(null,`${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)});
export const documentUpload=multer({storage,limits:{fileSize:15*1024*1024},fileFilter:(_req,file,done)=>{const allowed=['application/pdf','image/jpeg','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];done(null,allowed.includes(file.mimetype))}}).single('file');
export const attendanceSelfieUpload=multer({storage,limits:{fileSize:5*1024*1024},fileFilter:(_req,file,done)=>done(null,['image/jpeg','image/png'].includes(file.mimetype))}).single('selfie');
const taskFiles=multer({storage,limits:{fileSize:15*1024*1024,files:10}});
export const taskAttachmentsUpload=taskFiles.array('attachments',10);
export const taskAttachmentUpload=taskFiles.single('attachment');
export const employeeUpload=multer({storage,limits:{fileSize:15*1024*1024,files:12}}).any();
