import { cloudinaryConfig } from '../config/cloudinary.js';
export class StorageService{isConfigured(){return Boolean(cloudinaryConfig.cloudName&&cloudinaryConfig.apiKey&&cloudinaryConfig.apiSecret)}}
