import{Counter}from'../models/Counter.js';
import{DemoRequest}from'../models/DemoRequest.js';

export async function nextDemoRequestId(){
  const year=new Date().getUTCFullYear(),prefix=`DEMO-${year}-`;
  const latest=await DemoRequest.findOne({requestId:{$regex:`^${prefix}\\d{6}$`}}).sort({requestId:-1}).select('requestId').lean();
  const highestExisting=latest?.requestId?Number(latest.requestId.slice(prefix.length))||0:0;
  const counter=await Counter.findByIdAndUpdate(
    `demo-request-${year}`,
    [{$set:{sequence:{$add:[{$max:[{$ifNull:['$sequence',0]},highestExisting]},1]}}}],
    {new:true,upsert:true}
  );
  return `${prefix}${String(counter.sequence).padStart(6,'0')}`;
}
