import { z } from 'zod';
const clean = z.string().trim();
export const createDemoRequestSchema = z.object({
  fullName: clean.min(2).max(100), workEmail: clean.toLowerCase().email().max(150), phoneCountryCode: clean.regex(/^\+\d{1,4}$/), phoneNumber: clean.regex(/^[\d ()-]{7,25}$/),
  jobTitle: clean.min(1).max(80), customJobTitle: clean.max(80).optional(), companyName: clean.min(2).max(150), companyWebsite: z.union([z.literal(''), z.string().trim().url().max(300)]).optional(),
  industry: clean.min(1).max(100), customIndustry: clean.max(100).optional(), companySize: clean.min(1).max(50), country: clean.min(1).max(100), state: clean.max(100).optional(), city: clean.max(100).optional(),
  interestedModules: z.array(clean.min(1).max(100)).min(1).max(20), currentHRMethod: clean.min(1).max(100), preferredDemoDate: clean.regex(/^\d{4}-\d{2}-\d{2}$/), preferredDemoTime: clean.min(1).max(50), preferredTimezone: clean.min(1).max(100),
  preferredContactMethod: clean.min(1).max(50), additionalRequirements: clean.max(1000).optional(), contactConsent: z.literal(true), marketingConsent: z.boolean().optional().default(false), source: clean.max(50).optional().default('landing-page'), website: z.string().max(0).optional()
}).superRefine((v, ctx) => {
  if (v.jobTitle === 'Other' && !v.customJobTitle) ctx.addIssue({ code: 'custom', path: ['customJobTitle'], message: 'Enter your job title' });
  if (v.industry === 'Other' && !v.customIndustry) ctx.addIssue({ code: 'custom', path: ['customIndustry'], message: 'Enter your industry' });
  let today = new Date().toISOString().slice(0,10);
  try { const parts=Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: v.preferredTimezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(x=>[x.type,x.value]));today=`${parts.year}-${parts.month}-${parts.day}`; } catch { ctx.addIssue({ code: 'custom', path: ['preferredTimezone'], message: 'Enter a valid timezone' }); }
  if (v.preferredDemoDate < today) ctx.addIssue({ code: 'custom', path: ['preferredDemoDate'], message: 'Preferred demo date cannot be in the past' });
  const maximum = new Date(); maximum.setUTCDate(maximum.getUTCDate() + Number(process.env.DEMO_MAX_ADVANCE_DAYS || 90));
  if (v.preferredDemoDate > maximum.toISOString().slice(0,10)) ctx.addIssue({ code: 'custom', path: ['preferredDemoDate'], message: 'Preferred demo date is outside the booking window' });
});
