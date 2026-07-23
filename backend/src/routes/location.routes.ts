import { Router } from 'express';
// import rateLimit from 'express-rate-limit';
import { listCities, listCountries, listStates } from '../controllers/location.controller.js';

export const locationRoutes = Router();
// locationRoutes.use(rateLimit({ windowMs: 60000, limit: 120, standardHeaders: true, legacyHeaders: false }));
locationRoutes.get('/countries', listCountries);
locationRoutes.get('/countries/:countryId/states', listStates);
locationRoutes.get('/states/:stateId/cities', listCities);
