import{addDays,format,isBefore,isValid,parseISO,startOfDay}from'date-fns';
export const demoScheduleConfig={minimumNoticeDays:0,maximumAdvanceBookingDays:90,allowWeekends:true,disabledWeekdays:[],disabledDates:[]};
export const startOfBusinessDay=()=>startOfDay(new Date());
export const isPastBusinessDate=date=>isBefore(startOfDay(date),startOfBusinessDay());
export const formatDateForApi=date=>isValid(date)?format(date,'yyyy-MM-dd'):'';
export const formatDateForDisplay=value=>{const date=typeof value==='string'?parseISO(value):value;return isValid(date)?format(date,'dd MMMM yyyy'):''};
export const maximumBookingDate=()=>addDays(startOfBusinessDay(),demoScheduleConfig.maximumAdvanceBookingDays);
export const isUnavailableDate=date=>isPastBusinessDate(date)||date>maximumBookingDate()||(!demoScheduleConfig.allowWeekends&&[0,6].includes(date.getDay()))||demoScheduleConfig.disabledWeekdays.includes(date.getDay())||demoScheduleConfig.disabledDates.includes(formatDateForApi(date));
