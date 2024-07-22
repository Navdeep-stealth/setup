import { deleteUser, editUser, loginUser, logout, registerUser, renderDashboard, renderLogin, renderRegister, renderUsers, updateUser } from '../controllers/admin.controller.js'

import { verifyJWT } from '../middlewares/auth.middleware.js';


// Middleware function to set no-cache headers
const setNoCacheHeaders = async (req, reply) => {
    // Set Cache-Control headers
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');

};

const userLoginOpt = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    // minLength: 12,
                    pattern: '^[^\\s]+$' // No spaces
                },
                password: {
                    type: 'string',
                    // minLength: 8, // Adjust the length as needed
                    // maxLength:12
                }
            },
            required: ['username', 'password']
        }
    },
};


const userRegisterOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                username: {
                    type: 'string',
                    minLength: 5,
                    maxLength:12,
                    pattern: '^[^\\s]+$' // No spaces
                },
                fullname: {
                    type: 'string',
                    minLength: 1
                },
                role: {
                    type: 'string',
                    enum:['admin','super_admin']
                },
                password: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 12
                    // Adjust the length as needed
                },
            },
            required: ['username', 'fullname', 'password','role']
        }
    },
    preHandler: [verifyJWT]
};



async function router(fastify, options) {

    /* get routes */
    fastify.get('/login', renderLogin);
    fastify.get('/register', renderRegister);
    fastify.get('/users',{ preHandler: [verifyJWT] }, renderUsers);
    fastify.get('/editUser/:id',{ preHandler: [verifyJWT] }, editUser);
    fastify.get('/delete/:id', { preHandler: [verifyJWT] }, deleteUser);
    fastify.get('/dashboard', { preHandler: [verifyJWT, setNoCacheHeaders] }, renderDashboard);
    fastify.get('/logout', { preHandler: [verifyJWT] }, logout);


    /* Post Routes */
    fastify.post('/login',{ preHandler: [verifyJWT] },loginUser)
    fastify.post('/update/:id', userLoginOpt,updateUser );
    fastify.post('/registerNewUser', userRegisterOpts, registerUser);


}




export { router };




