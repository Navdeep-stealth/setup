import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";

//register User
async function registerUser(request, reply) {

    const { fullName, email, password, role, status } = request.body

    try {
        //check user type
        if (request.user.role !== `${process.env.USER_TYPE_1}`) {
            return reply.status(401).json({ errorMessage: "Access Denied..!" })
        }

        //validate incoming data
        if (!fullName || !email || !password) {
            return reply.status(400).json({ errorMessage: "Full name, email and password are required..!" })
        }

        //check if user already exist
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return reply.status(400).send({ errorMessage: "Email already exists..!" })
        }

        const newUser = new User({
            fullName,
            email,
            password,
            role: role || 'admin',
            status: status || 'active'
        })

        await newUser.save()
        reply.status(201).send({ message: "User created successfully" })
    } catch (error) {
        console.log("Error while registering user", error);
        return reply.status(500).json({ errorMessage: "Internal server error..!" })
    }
}

async function renderLogin(req, reply) {
    // reply.send({message:'welcome'})
    return reply.view('login.ejs')
    // reply.view('login.ejs', {msg: "Login rendered.."})
}

async function loginUser(req, reply) {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return reply.view('login.ejs', { errorMessage: "Both email and password are required." });
        }

        const user = await User.findOne({ email });

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

        return reply.view('dashboard.ejs', { user,users })
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
            secure: true
        };

        // Clear the access token cookie
        reply.clearCookie('accessToken', {path: '/'})

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


export {
    registerUser,
    renderLogin,
    loginUser,
    renderDashboard,
    deleteUser,
    logout
}