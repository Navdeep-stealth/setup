 import { test } from '../controllers/admin.controller.js';
import {manageGames, manageGamesCategory,manageProviders} from '../controllers/game.controllr.js'
 import { verifyJWT } from '../middlewares/auth.middleware.js';

const setNoCacheHeaders = async (req, reply) => {
    // Set Cache-Control headers
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
};

async function games (fastify, options) {

    /* routes to manage games */
fastify.get('/',{ preHandler: [verifyJWT] },manageGamesCategory)
fastify.get('/manageProviders',{ preHandler: [verifyJWT] },manageProviders)
fastify.get('/manageProviders/viewGames',{ preHandler: [verifyJWT] },manageGames)


}


export {games}