const clean = (value: string) => value.replace(/\/+$/, '');
const productionDefaults = {
  apiBaseUrl: 'https://api-ems-workforcepro.vercel.app/api/v1',
  landingPageUrl: 'https://workforceprohub.vercel.app',
  appUrl: 'https://ems-workforcepro.vercel.app'
};
export const appConfig = {
  apiBaseUrl: clean(import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? productionDefaults.apiBaseUrl : '/api/v1')),
  landingPageUrl: clean(import.meta.env.VITE_LANDING_PAGE_URL || (import.meta.env.PROD ? productionDefaults.landingPageUrl : 'http://localhost:5174')),
  appUrl: clean(import.meta.env.VITE_APP_URL || (import.meta.env.PROD ? productionDefaults.appUrl : window.location.origin))
};
