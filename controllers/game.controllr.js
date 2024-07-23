import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";



/* Render games categories */
async function manageGamesCategory(req, reply) {

    const user = req.user

    const users = await User.find({})

    return reply.view('gamesCategory.ejs', { users,user })

}
async function manageGames(req, reply) {

    const user = req.user

    const users = await User.find({})

    return reply.view('games.ejs', { users,user })

}
/* render gameProviders */
async function manageProviders(req, reply) {

    const user = req.user

    const users = await User.find({})

    return reply.view('providers.ejs', { users ,user})

}


export{
    manageProviders,
    manageGames,
    manageGamesCategory
}