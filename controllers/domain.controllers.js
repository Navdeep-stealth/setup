import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";


/* render Domians   */
async function manageDomains(req, reply) {

    const user = req.user



    const users = await User.find({})

    return reply.view('domains.ejs', { users ,user})

}
async function addDomain(req, reply) {

    const user = req.user


    return reply.view('addDomain.ejs', {user})

}


export{
    manageDomains,
    addDomain

}