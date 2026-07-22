// import { Router } from 'express';
// // import rateLimit from 'express-rate-limit';
// import { createDemoRequest, demoConfirmation } from '../controllers/demoRequest.controller.js';
// import { validateDemoLocation } from '../middleware/validateDemoLocation.js';

// export const demoRequestRoutes = Router();
// const limiter = handler: (_req, res) => res.status(429).json({ success: false, code: 'TOO_MANY_DEMO_REQUESTS', message: 'Too many demo requests were submitted. Please wait a few minutes and try again.' }) });
// demoRequestRoutes.post('/', validateDemoLocation, createDemoRequest);
// demoRequestRoutes.get('/confirmation/:requestId', demoConfirmation);

import { Router, type Request, type Response } from 'express';
import { rateLimit } from 'express-rate-limit';

import {
    createDemoRequest,
    demoConfirmation,
} from '../controllers/demoRequest.controller.js';

import { validateDemoLocation } from '../middleware/validateDemoLocation.js';

export const demoRequestRoutes = Router();

const demoRequestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipFailedRequests: true,

    handler: (_req: Request, res: Response) => {
        return res.status(429).json({
            success: false,
            code: 'TOO_MANY_DEMO_REQUESTS',
            message:
                'Too many demo requests were submitted. Please wait a few minutes and try again.',
        });
    },
});

const confirmationLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

demoRequestRoutes.post(
    '/',
    demoRequestLimiter,
    validateDemoLocation,
    createDemoRequest,
);

demoRequestRoutes.get(
    '/confirmation/:requestId',
    confirmationLimiter,
    demoConfirmation,
);