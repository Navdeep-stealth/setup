import { Changepassword, deleteUser, editUser, loginUser, logout,registerUser, renderDashboard, renderLogin, renderRegister, renderUsers, updatePassword, updateUser } from '../controllers/admin.controller.js'

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

const userUpdateOpts = {
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
            },
            required: ['username', 'fullname','role']
        }
    },
    preHandler: [verifyJWT]
};
const passwordUpdateOpts = {
    schema: {
        body: {
            type: 'object',
            properties: {
                
                CurrentPassword: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 12
                    // Adjust the length as needed
                },
                NewPassword: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 12
                    // Adjust the length as needed
                },
                ConfirmPassword: {
                    type: 'string',
                    minLength: 8,
                    maxLength: 12
                    // Adjust the length as needed
                },
            },
            required: ['NewPassword', 'ConfirmPassword']
        }
    },
    preHandler: [verifyJWT]
};

async function router(fastify, options) {

    /* routes  to Render Login And register*/
    fastify.get('/login', renderLogin);
    fastify.get('/register',{ preHandler: [verifyJWT] }, renderRegister);
    fastify.post('/login',userLoginOpt,loginUser)

    /* Routes to Create , Update and Delete User */
    fastify.get('/users',{ preHandler: [verifyJWT] }, renderUsers);
    fastify.get('/editUser/:id',{ preHandler: [verifyJWT] }, editUser);
    fastify.get('/delete/:id', { preHandler: [verifyJWT] }, deleteUser);
    fastify.get('/user/Changepassword/:id', { preHandler: [verifyJWT] }, Changepassword);
    fastify.post('/update/:id', userUpdateOpts,updateUser );
    fastify.post('/update-password/:id',passwordUpdateOpts, updatePassword );
    fastify.post('/registerNewUser', userRegisterOpts, registerUser);

    /* Route */
    fastify.get('/dashboard', { preHandler: [verifyJWT, setNoCacheHeaders] }, renderDashboard);
    fastify.get('/logout', { preHandler: [verifyJWT] }, logout);


}




export { router };




