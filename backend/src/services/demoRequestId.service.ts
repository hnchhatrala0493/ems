import{Counter}from'../models/Counter.js';
export async function nextDemoRequestId(){const year=new Date().getUTCFullYear(),counter=await Counter.findByIdAndUpdate(`demo-request-${year}`,{$inc:{sequence:1}},{new:true,upsert:true,setDefaultsOnInsert:true});return `DEMO-${year}-${String(counter.sequence).padStart(6,'0')}`}
