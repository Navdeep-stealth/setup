import fastify from "fastify";
import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";

//register User
async function registerUser(request, reply) {

    const { fullname, username, password, role, status } = request.body

    try {
        //check user type
        if (request.user.role !== `${process.env.USER_TYPE_1}`) {
            return reply.status(401).send({ errorMessage: "Access Denied..!" })
        }

        //validate incoming data
        if (!fullname || !password) {
            return reply.status(400).send({ errorMessage: "Full name and password are required..!" })
        }

        //check if user already exist
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return reply.status(400).send({ errorMessage: "Username already exists..!" })
        }

        const newUser = new User({
            fullname,
            username,
            password,
            role: role || 'admin',
            status: status || 'active'
        })

        await newUser.save()
        reply.status(201).send({ message: "User created successfully" })
    } catch (error) {
        console.log("Error while registering user", error);
        return reply.status(500).send({ errorMessage: "Internal server error..!" })
    }
}

async function renderLogin(req, reply) {
    // reply.send({message:'welcome'})
    return reply.view('login.ejs')
    // reply.view('login.ejs', {msg: "Login rendered.."})
}
async function renderRegister(req, reply) {
    // reply.send({message:'welcome'})
    return reply.view('register.ejs')
    // reply.view('login.ejs', {msg: "Login rendered.."})
}
async function renderUsers(req, reply) {
    // reply.send({message:'welcome'})

    const users = await User.find({})

    return reply.view('Users.ejs',{users})
    // reply.view('login.ejs', {msg: "Login rendered.."})
}
async function editUser(req, reply) {
    // reply.send({message:'welcome'})

    const user = await User.findOne({_id:req.params.id})

    //console.log(user);
    return reply.view('edituser.ejs',{user})

    // reply.view('login.ejs', {msg: "Login rendered.."})
}

async function loginUser(req, reply) {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return reply.view('login.ejs', { errorMessage: "Both username and password are required." });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return reply.view('login.ejs', { errorMessage: "User does not exist, please contact admin." });
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return reply.view('login.ejs', { errorMessage: "Password is incorrect!" });
        }

        const accessToken = createTokenForUser(user);

        const options = {
            httpOnly: true,
            secure: true,
            path: '/v1/chief'
        };

        reply.setCookie('accessToken', accessToken, options);
        return reply.redirect('/v1/chief/dashboard');

    } catch (error) {
        console.log("login failed", error);
        return reply.view('login.ejs', { errorMessage: "Login failed, please try again..!" });
    }
}


async function renderDashboard(req, reply) {

    const user = req.user

    console.log(user);

    if (user) {

        let users = await User.find({})

        return reply.view('dashboard.ejs', { user, users })
    }
    else {
        reply.redirect('/v1/chief/login')
    }
}


async function deleteUser(req, reply) {
    const currentUser = req.user;
    const userIdToDelete = req.params.id;

    if (currentUser.role === 'super_admin') {
        try {
            // Assuming you have a User model or similar to interact with the database
            const user = await User.findById(userIdToDelete);

            if (!user) {
                return reply.status(404).send({ message: 'User not found' });
            }

            await User.deleteOne({ _id: userIdToDelete });
            return reply.send({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'An error occurred while deleting the user' });
        }
    } else {
        return reply.status(403).send({ message: 'Permission denied' });
    }
}

async function logout(req, reply) {
    try {
        const options = {
            httpOnly: true,
            secure: true,
            path: '/v1/chief'

        };

        // Clear the access token cookie
        reply.clearCookie('accessToken', options)

        // Set Cache-Control headers to prevent caching
        reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');

        // Redirect to the login page
        return reply.redirect('/v1/chief/login');
    } catch (error) {
        console.log("Error while logging out:", error);
        // Handle error gracefully, optionally send error message
        return reply.send(error.message);
    }
}

/* Update User */

async function updateUser(req,reply){
    let user = await User.findOne({_id:req.params.id})

try {
    if (!user) {
       return reply.send('user not found' )
        
    }
    if (req.body.fullname) {

        await user
        user.fullname = req.body.fullname
        await user.save();
        console.log('fullname Changed SUccessfully');    
    }
    if (req.body.password) {

        await user
        user.password = req.body.password
        await user.save();
        console.log('password Changed SUccessfully');    
    }
    if (req.body.status) {

        await user
        user.status = req.body.status
        await user.save();
        console.log('status Changed SUccessfully');    
    }

    reply.redirect('/v1/chief/users')
} catch (error) {
    fastify.info.log(error)
}


}


export {
    registerUser,
    renderLogin,
    loginUser,
    renderDashboard,
    deleteUser,
    logout, renderRegister,
    renderUsers,
    editUser,
    updateUser
}