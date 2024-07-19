import { MainModel } from "../models/games.model.js";


async function getAllGames(req, reply) {
    // Fetch up to 3 games from the collection
    const games = await MainModel.find({}).limit(3);

    reply.send({ games });
}



export {getAllGames}