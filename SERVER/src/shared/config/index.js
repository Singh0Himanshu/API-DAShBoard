import dotenv from "dotenv";
import { mongo } from "mongoose";

dotenv.config()

const config = {
    //server
    node_env:process.env.NODE_ENV || "Development",
    port: parseInt(process.env.PORT || "5000", 10),

    //MongoDb
    mongo:{
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/api_monitoring',
        dbName: process.env.MONGO_DB_NAME || 'api_monitoring',
    },

    //postgreSQL
    postgres: {
        host:process.env.PG_HOST || 'localhost',
        port:parseInt(process.env.PG_PORT || '5432', 10),
        database: process.env.PG_DATABASE || 'api_monitoring',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'postgres'
    },

    //RabbitMQ
    rabbitmq:{
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'api_hits',
        publisherConfirms: process.env.RABBITMQ_PUBLISHER_CONFIRMS === 'true' || false,  // msgLost case
        retryAttempts: parseInt(process.env.RABBITMQ_RETRY_ATTEMPTS || '3', 10),
        retryDelay: parseInt(process.env.RABBITMQ_RETRY_DELAY || '1000', 10),
    },

    //jwt 
    jwt :{
        secret: process.env.JWT_SECRET || 'sjkbweg8723jkedind34437',
        expiresIn : process.env.JWT_EXPIRES_IN || '24h'
    },

    // rateLimit
    rateLimit: {
        windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUEST || '1000', 10), // 1000 req/ 15 min
    },

    cookie: {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        expiresIn: 24 * 60 * 60 * 1000
    }
    

}

export default config