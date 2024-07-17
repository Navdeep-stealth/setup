import {renderLogin} from '../controllers/admin.controller.js'

async  function controllermain (fastify , options){
    fastify.get('/login',renderLogin)

}

export default controllermain;
