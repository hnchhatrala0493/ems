import { appConfig } from './config/appConfig';

const nativeFetch = globalThis.fetch.bind(globalThis);

// Normalize legacy root-relative calls when the EMS and API use different hosts.
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string' && input.startsWith('/api/v1')) {
    return nativeFetch(`${appConfig.apiBaseUrl}${input.slice('/api/v1'.length)}`, init);
  }
  return nativeFetch(input, init);
}) as typeof globalThis.fetch;
