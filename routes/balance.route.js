

import { testbalance } from '../controllers/balance.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const setNoCacheHeaders = async (req, reply) => {
   // Set Cache-Control headers
   reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
   
};

async function balance (fastify, options) {

   /* routes to manage Blanace */
fastify.get('/',testbalance)


}


export {balance}