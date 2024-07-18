import { deleteUser, loginUser, logout, registerUser, renderDashboard, renderLogin } from '../controllers/admin.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';


// Middleware function to set no-cache headers
const setNoCacheHeaders = async (req, reply) => {
    // Set Cache-Control headers
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    
};


async function router (fastify, options) {
    fastify.get('/login', renderLogin);
    fastify.post('/registerNewUser', { preHandler: [verifyJWT] }, registerUser);
    fastify.post('/login',loginUser)
    fastify.get('/delete/:id',{ preHandler: [verifyJWT] },deleteUser)
    fastify.get('/dashboard', { preHandler: [verifyJWT, setNoCacheHeaders] },renderDashboard)
    fastify.get('/logout',{ preHandler: [verifyJWT] }, logout)


}

export default router ;




