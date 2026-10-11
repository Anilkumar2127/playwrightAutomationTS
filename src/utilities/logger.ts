
import winston from "winston";


export const logger=winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp( {format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message }) => {
            const workerID = process.env.TEST_WORKER_INDEX || 'main';
            return `${timestamp} [${level.toUpperCase()}] [Worker: ${workerID}] ${message}`;
        })
),
    
    transports:[new winston.transports.Console(),new winston.transports.File({filename:'./logs/exec.log'})]
})