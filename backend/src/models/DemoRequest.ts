import { Schema, model } from 'mongoose';

export const demoStatuses = ['new','contacted','demo-scheduled','demo-completed','follow-up','qualified','proposal-sent','converted','not-interested','cancelled'] as const;
export const demoPriorities = ['low','medium','high','urgent'] as const;

const notificationSchema = new Schema({ customer: { type: String, enum: ['pending','sent','failed'], default: 'pending' }, admin: { type: String, enum: ['pending','sent','failed'], default: 'pending' } }, { _id: false });
const schema = new Schema({
  requestId: { type: String, unique: true, index: true }, fullName: { type: String, required: true, maxlength: 100 },
  workEmail: { type: String, required: true, lowercase: true, trim: true, index: true }, phoneCountryCode: { type: String, required: true }, phoneNumber: { type: String, required: true }, normalizedPhone: { type: String, required: true, index: true },
  jobTitle: { type: String, required: true }, customJobTitle: String, companyName: { type: String, required: true, maxlength: 150 }, companyWebsite: String,
  industry: { type: String, required: true }, customIndustry: String, companySize: { type: String, required: true }, country: { type: String, required: true }, state: String, city: String,
  interestedModules: [{ type: String }], currentHRMethod: { type: String, required: true }, preferredDemoDate: { type: Date, required: true, index: true }, preferredDemoTime: { type: String, required: true }, preferredTimezone: String,
  preferredContactMethod: { type: String, required: true }, additionalRequirements: { type: String, maxlength: 1000 }, contactConsent: { type: Boolean, required: true }, marketingConsent: { type: Boolean, default: false },
  source: { type: String, default: 'landing-page' }, status: { type: String, enum: demoStatuses, default: 'new', index: true }, priority: { type: String, enum: demoPriorities, default: 'medium', index: true }, assignedTo: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  adminNotes: [{ text: { type: String, maxlength: 2000 }, author: { type: Schema.Types.ObjectId, ref: 'User' }, createdAt: { type: Date, default: Date.now } }], followUpDate: Date, meetingLink: String,
  confirmedDemoDate: Date, confirmedStartTime: String, confirmedEndTime: String, meetingProvider: String, customerEmailStatus:{type:String,enum:['pending','sent','failed'],default:'pending'},adminEmailStatus:{type:String,enum:['pending','sent','failed'],default:'pending'},lastEmailAttempt:Date,emailErrorSummary:String,lastContactedAt:Date,convertedCompanyId:{type:Schema.Types.ObjectId},createdBy:{type:Schema.Types.ObjectId,ref:'User'},updatedBy:{type:Schema.Types.ObjectId,ref:'User'},
  isArchived:{type:Boolean,default:false,index:true},archivedAt: Date, ipHash: String, userAgent: { type: String, maxlength: 500 }
}, { timestamps: true });
schema.index({ createdAt: -1 }); schema.index({ assignedTo: 1, status: 1 });
export const DemoRequest = model('DemoRequest', schema);
