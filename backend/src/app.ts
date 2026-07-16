import express from 'express'; import helmet from 'helmet'; import cors from 'cors'; import compression from 'compression'; import morgan from 'morgan'; import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js'; import { swaggerDocument } from './config/swagger.js'; import routes from './routes/index.js'; import { errorHandler, notFound } from './middleware/errorHandler.js'; import { apiRateLimiter } from './middleware/rateLimiter.js'; import { auditLogger } from './middleware/auditLogger.js';
export const app = express();
const configuredOrigins = env.CLIENT_URL.split(',').map(value => value.trim()).filter(Boolean);
const allowOrigin = (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
  if (!origin || configuredOrigins.includes(origin)) return callback(null, true);
  if (env.NODE_ENV === 'development' && /^http:\/\/(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+):\d+$/.test(origin)) return callback(null, true);
  callback(new Error('Origin is not allowed by CORS'));
};
app.use(helmet()); app.use(cors({ origin: allowOrigin, credentials: true })); app.use(compression()); app.use(express.json({ limit: '1mb' })); app.use(morgan('combined')); app.use('/api', apiRateLimiter);
app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } })); app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); app.use('/api/v1', auditLogger); app.use('/api/v1', routes); app.use(notFound); app.use(errorHandler);
