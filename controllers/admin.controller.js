import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";

//register User
const registerUser = async (req,reply) => {

    const {fullName, email, password, role, status } = req.body

    try {
        //check user type
        if(req.user.role !== `${process.env.USER_TYPE_1}`){
            return reply.status(401).json({errorMessage: "Access Denied..!"})
        }

        //validate incoming data
        if(!fullName || !email || !password){
            return reply.status(400).json({errorMessage: "Full name, email and password are required..!"})
        }

        //check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return reply.status(400).json({errorMessage: "Email already exists..!"})
        }

        const newUser = new User({
            fullName,
            email,
            password,
            role: role || 'admin',
            status: status || 'active'
        })

        await newUser.save()
        reply.status(201).json({message: "User created successfully"})
    } catch (error) {
        console.log("Error while registering user", error);
        return reply.status(500).json({errorMessage: "Internal server error..!"})
    }
}

async function renderLogin (req, reply){
    reply.send({message:'welcome'})
    // reply.view('login.ejs')
    // reply.view('login.ejs', {msg: "Login rendered.."})
}

const loginUser = async (req, reply) => {
    const {email, password} = req.body
    try {
        if(!email && !password){
            return reply.view('login.ejs', {errorMessage: "Both email and password are required."})
        }

        const user = await User.findOne({email})

        if(!user){
            return reply.view('login.ejs', {errorMessage: "User does not exist, please contact admin."})
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return reply.view('login.ejs', {errorMessage: "Password is incorrect.!"})
        }

        const accessToken = createTokenForUser(user)

        const options = {
            httpOnly: true,
            secure: true,
        };

        reply.cookie('accessToken', accessToken, options);
        return reply.redirect('/v1/chief/dashboard');

    } catch (error) {
        console.log("login failed", error);
        return reply.view('.ejs', {errorMessage: "Login failed, please try again..!"})
    }
    
}

const renderDashboard = async (req,reply) => {
    const user = req.user
    if(user){
        return reply.view('dashboard.ejs', {user})
    }
    else{
        reply.redirect('/v1/chief/login')
    }
}

const logout = async (req, reply) => {
    try {
        const options = {
            httpOnly: true,
            secure: true
         }
         reply.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
         return reply.clearCookie("accessToken", options).redirect('/v1/chief/login')
    } catch (error) {
        console.log("Error while logging out");
        reply.send(error.message)
    }
}

export {
    registerUser,
    renderLogin, 
    loginUser,
    renderDashboard,
    logout}