import jwt from "jsonwebtoken"
import { User } from "../models/admin.model.js"
import { ApiError } from "../utils/apiError.js"

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            return res.render('login', {errorMessage: "Unauthorized request"})
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password")

        if(!user){
            return res.render('login', {errorMessage: "Invalid Access"})
        }

        req.user = user;

        next();
    } 
    catch (error) {
        throw new ApiError(401, error?.message, "Invalid access token")
    }
}