import type { NextFunction, Request, Response } from 'express';
import { Notification, notificationEvents } from '../models/Notification.js';
import { NotificationPreference } from '../models/NotificationPreference.js';
import { PushDevice } from '../models/PushDevice.js';
import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const filter: Record<string, unknown> = { userId: req.user!.id };
    if (req.query.unread === 'true') filter.read = false;
    if (req.query.event) filter.event = req.query.event;
    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(Math.min(Number(req.query.limit) || 100, 200)).lean();
    const unread = await Notification.countDocuments({ userId: req.user!.id, read: false });
    ok(res, { items, unread });
  } catch (error) { next(error); }
}

export async function markRead(req: Request, res: Response, next: NextFunction) {
  try { const item = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, { read: true, readAt: new Date() }, { new: true });if(!item)throw new AppError(404,'Notification not found','NOT_FOUND');ok(res, item, 'Notification marked as read'); }
  catch (error) { next(error); }
}

export async function details(req:Request,res:Response,next:NextFunction){try{const item=await Notification.findOne({_id:req.params.id,userId:req.user!.id}).lean();if(!item)throw new AppError(404,'Notification not found','NOT_FOUND');ok(res,item)}catch(error){next(error)}}
export async function remove(req:Request,res:Response,next:NextFunction){try{const item=await Notification.findOneAndDelete({_id:req.params.id,userId:req.user!.id});if(!item)throw new AppError(404,'Notification not found','NOT_FOUND');ok(res,null,'Notification deleted')}catch(error){next(error)}}
export async function registerDevice(req:Request,res:Response,next:NextFunction){try{const token=String(req.body.expoPushToken||''),platform=String(req.body.platform||'');if(!/^ExponentPushToken\[[^\]]+\]$|^ExpoPushToken\[[^\]]+\]$/.test(token))throw new AppError(422,'Invalid Expo push token','INVALID_PUSH_TOKEN');if(!['android','ios','web'].includes(platform))throw new AppError(422,'Invalid device platform','INVALID_PLATFORM');const item=await PushDevice.findOneAndUpdate({expoPushToken:token},{$set:{userId:req.user!.id,organizationId:req.user!.organizationId,platform,deviceName:req.body.deviceName,active:true,lastSeenAt:new Date()}},{new:true,upsert:true,runValidators:true});ok(res,item,'Device registered')}catch(error){next(error)}}

export async function markAll(req: Request, res: Response, next: NextFunction) {
  try { await Notification.updateMany({ userId: req.user!.id, read: false }, { read: true, readAt: new Date() }); ok(res, null, 'All notifications marked as read'); }
  catch (error) { next(error); }
}

export async function preferences(req: Request, res: Response, next: NextFunction) {
  try {
    let item: any = await NotificationPreference.findOne({ userId: req.user!.id }).lean();
    if (!item) item = (await NotificationPreference.create({ userId: req.user!.id, organizationId: req.user!.organizationId })).toObject();
    ok(res, { ...item, eventCatalog: notificationEvents });
  } catch (error) { next(error); }
}

export async function savePreferences(req: Request, res: Response, next: NextFunction) {
  try {
    const events=req.body.events,quietHours=req.body.quietHours;if(!events||typeof events!=='object'||Array.isArray(events))throw new AppError(422,'Notification event preferences are required','INVALID_PREFERENCES');if(Object.keys(events).some(event=>!notificationEvents.includes(event as typeof notificationEvents[number])))throw new AppError(422,'Unknown notification event','INVALID_PREFERENCES');if(!quietHours||typeof quietHours.enabled!=='boolean'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(quietHours.from)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(quietHours.to))throw new AppError(422,'Invalid quiet hours','INVALID_PREFERENCES');
    const item = await NotificationPreference.findOneAndUpdate({ userId: req.user!.id }, { $set: { events, quietHours }, $setOnInsert: { organizationId: req.user!.organizationId } }, { new: true, upsert: true, runValidators:true });
    ok(res, item, 'Notification preferences saved');
  } catch (error) { next(error); }
}
