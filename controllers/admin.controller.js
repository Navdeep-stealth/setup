import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";

//register User
const registerUser = async (req,res) => {

    const {fullName, email, password, role, status } = req.body

    try {
        //check user type
        if(req.user.role !== `${process.env.USER_TYPE_1}`){
            return res.status(401).json({errorMessage: "Access Denied..!"})
        }

        //validate incoming data
        if(!fullName || !email || !password){
            return res.status(400).json({errorMessage: "Full name, email and password are required..!"})
        }

        //check if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({errorMessage: "Email already exists..!"})
        }

        const newUser = new User({
            fullName,
            email,
            password,
            role: role || 'admin',
            status: status || 'active'
        })

        await newUser.save()
        res.status(201).json({message: "User created successfully"})
    } catch (error) {
        console.log("Error while registering user", error);
        return res.status(500).json({errorMessage: "Internal server error..!"})
    }
}

const renderLogin = async (req, res) => {
    res.render('login', {msg: "Login rendered.."})
}

const loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        if(!email && !password){
            return res.render('login', {errorMessage: "Both email and password are required."})
        }

        const user = await User.findOne({email})

        if(!user){
            return res.render('login', {errorMessage: "User does not exist, please contact admin."})
        }

        const isPasswordValid = await user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return res.render('login', {errorMessage: "Password is incorrect.!"})
        }

        const accessToken = createTokenForUser(user)

        const options = {
            httpOnly: true,
            secure: true,
        };

        res.cookie('accessToken', accessToken, options);
        return res.redirect('/v1/chief/dashboard');

    } catch (error) {
        console.log("login failed", error);
        return res.render('login', {errorMessage: "Login failed, please try again..!"})
    }
    
}

const renderDashboard = async (req,res) => {
    const user = req.user
    if(user){
        return res.render('dashboard', {user})
    }
    else{
        res.redirect('/v1/chief/login')
    }
}

const logout = async (req, res) => {
    try {
        const options = {
            httpOnly: true,
            secure: true
         }
         res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
         return res.clearCookie("accessToken", options).redirect('/v1/chief/login')
    } catch (error) {
        console.log("Error while logging out");
        res.send(error.message)
    }
}

export {
    registerUser,
    renderLogin, 
    loginUser,
    renderDashboard,
    logout}