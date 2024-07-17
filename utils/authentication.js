import jwt from "jsonwebtoken"

function createTokenForUser(user) {
    const payload = {
        _id : user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY})
    return token;
}

export {createTokenForUser}