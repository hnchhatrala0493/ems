import http from 'node:http'; import mongoose from 'mongoose'; import { app } from './app.js'; import { env } from './config/env.js'; import { logger } from './config/logger.js'; import { initSocket } from './realtime/socket.js'; import { runAttendanceAutomation } from './jobs/attendance.job.js';
const server = http.createServer(app); initSocket(server);
async function start() {
    await mongoose.connect(env.MONGODB_URI);
    //server.listen(env.PORT,()=>logger.info(`EmployeeHub API listening on ${env.PORT}`));
    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
    setInterval(() => void runAttendanceAutomation().catch(error => logger.error('Attendance automation failed', { error })), 60_000).unref()
}
start().catch(error => { logger.error('Startup failed', { error }); process.exit(1) }); const shutdown = () => server.close(() => mongoose.disconnect().finally(() => process.exit(0))); process.on('SIGTERM', shutdown); process.on('SIGINT', shutdown);
