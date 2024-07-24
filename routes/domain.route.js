
import { test } from '../controllers/admin.controller.js';
import { addDomain, manageDomains } from '../controllers/domain.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const setNoCacheHeaders = async (req, reply) => {
   // Set Cache-Control headers
   reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
   
};

async function domains (fastify, options) {

   /* routes to manage games */
fastify.get('/',{ preHandler: [verifyJWT] },manageDomains );
fastify.get('/adddomain',{ preHandler: [verifyJWT] },addDomain );

fastify.get('/viewDomain/:id',{ preHandler: [verifyJWT] },test);
fastify.get('/editDomain/:id',{ preHandler: [verifyJWT] },test);
fastify.get('/deleteDomain/:id',{ preHandler: [verifyJWT] },test);


}


export {domains}