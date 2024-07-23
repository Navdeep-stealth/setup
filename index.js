import * as path from 'node:path';
import fastifyView from '@fastify/view';
import fastifyStatic from '@fastify/static';
import fastify from 'fastify';
import ejs from 'ejs';
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert URL to path
import { router} from './routes/admin.route.js';
import connectDb from './DbConnection/db.index.js';
import { config } from 'dotenv';
import fastifyFormbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import { games } from './routes/games.route.js';
import fastifyMongodb from '@fastify/mongodb';
import { domains } from './routes/domain.route.js';

/* load env config */
config();

/* set file path for static resource */
const __filename = fileURLToPath(import.meta.url); // Get current file path

/* set directory path fro static resource */
const __dirname = path.dirname(__filename); // Get directory path


/* initiate fastify */
const fastifyApp = fastify({

    /* set logger */
    logger: {
        level: 'warn', // Set the log level to 'warn' to reduce unwanted logs and it will only Log warnings and errors
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
});


/* to handle post data */
fastifyApp.register(fastifyFormbody);

/* to handle cookies */
fastifyApp.register(fastifyCookie);


fastifyApp
.register(fastifyStatic, {
        /* register static resource */
        root: path.join(__dirname, 'public') // Adjust path based on your project structure
    })


    /* start listening to port */
    .listen({port:process.env.PORT}, err => {
        if (err) throw err;
        console.log('Server listening on port http://localhost:3002/v1/chief/login');
    });

/* set EJS as view engine */
fastifyApp.register(fastifyView, {
    engine: {
        ejs
    },
    templates: path.join(__dirname, 'views') // Adjust path based on your project structure
});

/* register routes */
fastifyApp.register(router, { prefix: '/v1/chief' });

fastifyApp.register(games, { prefix: '/v1/chief/manageGames' });

fastifyApp.register(domains, { prefix: '/v1/chief/managedomains' });

/* make a mongoose Connection */
fastifyApp.register(connectDb);



