import express from "express";
import cors from 'cors';
import helmet from "helmet";
import cookieParser from "cookie-parser";
import config from "./shared/config/index.js";
import logger from "./shared/config/logger.js";
import mongodb from './shared/config/mongodb.js';
import postgres from './shared/config/postgres.js';
import rabbitmq from './shared/config/rabbitmq.js';
import errorHandler from "./shared/middleware/errorHandler.js";
import ResponseFormatter from "./shared/utils/responseFormatter.js";
import { credentials } from "amqplib";
import authRouter from "./services/auth/routes/authRouter.js"

/**
 * Initialise Express app
 */
const app = express();

/**
 * it is use for security purpose. act as a middleware
 */
app.use(helmet());

/**
 * Cross-Origin Resource Sharing : use to give access to api call from different host.
 */
app.use(cors({
    origin: true,
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use((req,res,next)=>{
    logger.info(`${req.method} ${req.path}`, {
        ip:req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
})

app.get('/health', (req,res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            },
            'Service is healthy'
        )
    );
});
app.get('/', (req,res)=>{
    res.status(200).json(
        ResponseFormatter.success(
            {
                Service:' API Hit Monitoring System',
                version: '1.0.0',
                endpoints: {
                    health: 'health'
                },
            },
            'Api Hit Monitoring System',
        )
    )
})

// api/auth
app.use("/api/auth", authRouter)

app.use((req,res) => {
    res.status(404).json(ResponseFormatter.error("Endpoint not found", 404));
})

app.use(errorHandler);

async function initializeConnection(){
    try {
        logger.info("Initializing database connections..");

        //Connect to pg
        await postgres.testConnection();

        //Connect to MongoDB
        await mongodb.connect();

        //Connect to RabbitMQ
        await rabbitmq.connect();

        logger.info("All Connection established successfully");
    } catch (error) {
        logger.error("Failed to initialize connection:", error);
        throw error;
    }
}

async function startServer() {
    try {
        await initializeConnection();

        const server = app.listen(config.port, ()=> {
            logger.info(`Server started on port ${config.port}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${config.port}`);
        })


        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info("HTTP server closed");

                try {
                    await mongodb.disconnect();
                    await postgres.close();
                    await rabbitmq.close();
                    logger.info('All connections closed, exiting process');
                    process.exit(0);
                } catch (error) {
                    logger.error('Error during shutdown:', error);
                    process.exit(1);
                }
            })

            setTimeout(() => {
                logger.error("Forced shutdown")
                process.exit(1);
            }, 10000);
        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('unhandledRejection');
        });


    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
