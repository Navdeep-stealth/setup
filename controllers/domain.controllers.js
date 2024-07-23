import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";


/* render Domians   */
async function manageDomains(req, reply) {

    const user = req.user



    const users = await User.find({})

    return reply.view('domains.ejs', { users ,user})

}



export{
    manageDomains,

}