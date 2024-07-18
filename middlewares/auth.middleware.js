import jwt from "jsonwebtoken";
import { User } from "../models/admin.model.js";
import { ApiError } from "../utils/apiError.js";

export const verifyJWT = async (req, reply) => {
    try {
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

        if (!token) {
            return reply.view('login.ejs', { errorMessage: "Unauthorized request" });
            // return reply.send('You Must Have To Login First')
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            return reply.view('login.ejs', { errorMessage: "Invalid Access" });
            // return reply.send('You Must Have To Login First')

        }

        req.user = user;

    } catch (error) {
        throw new ApiError(401, error?.message, "Invalid access token");
    }
};
