import * as path from 'node:path';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import ejs from 'ejs';
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert URL to path
import router from './routes/admin.route.js';
import connectDb from './DbConnection/db.index.js';
import { config } from 'dotenv';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';

config();





const __filename = fileURLToPath(import.meta.url); // Get current file path
const __dirname = path.dirname(__filename); // Get directory path


const fastifyApp = fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
});

fastifyApp.register(fastifyFormbody)
fastifyApp.register(fastifyCookie)

fastifyApp
    .register(fastifyStatic, {
        root: path.join(__dirname, 'public') // Adjust path based on your project structure
    })
    .listen({ port: 3002 }, err => {
        if (err) throw err;
        console.log('Server listening on port http://localhost:3002/v1/chief/login');
    });


fastifyApp.register(fastifyView, {
    engine: {
        ejs
    },
    templates: path.join(__dirname, 'views') // Adjust path based on your project structure
});

fastifyApp.register(router, { prefix: '/v1/chief' });

fastifyApp.register(connectDb);



