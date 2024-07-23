import fastify from "fastify";
import { User } from "../models/admin.model.js";
import { createTokenForUser } from "../utils/authentication.js";

/* register New User By SuperAdmin */
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
        reply.status(201).view('register.ejs',{user:req.user})

    } catch (error) {

        console.log("Error while registering user", error);
        return reply.status(500).send({ errorMessage: "Internal server error..!" })
    }
}
/* render Loginn Form  */
async function renderLogin(req, reply) {

    return reply.view('login.ejs')
    // reply.view('login.ejs', {msg: "Login rendered.."})
}

/* render Register Form to SuperAdmin to register New Users */
async function renderRegister(req, reply) {


    if (req.user.role === `${process.env.USER_TYPE_1}`) {
        return reply.view('register.ejs',{user:req.user})
    }
    else {
        reply.redirect('/v1/chief/login')
    }
}

/* render all users to SuperAdmin */
async function renderUsers(req, reply) {

    let user = req.user

    if (user) {

        const users = await User.find({})

        return reply.view('Users.ejs', { users ,user})
    }
    else {
        reply.redirect('/v1/chief/login')
    }
}

/* render Form to  Edit the User */
async function editUser(req, reply) {

    const currentUser = await User.findOne({ _id: req.params.id })

    if (req.user && currentUser) {
        return reply.view('edituser.ejs', { user:req.user ,currentUser})
    }
    else {
        reply.redirect('/v1/chief/login')
    }

}
/* login User using username and Password */
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

/* Render Main DashBoard */
async function renderDashboard(req, reply) {

    const user = req.user

    if (user) {

        return reply.view('dashboard.ejs', { user })
    }
    else {
        reply.redirect('/v1/chief/login')
    }
}

/* delete User From dataBase By Super_Admin */
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
            return reply.redirect('/v1/chief/users');

        } catch (error) {

            console.error(error);
            return reply.status(500).send({ message: 'An error occurred while deleting the user' });
        }
    } else {
        return reply.status(403).send({ message: 'Permission denied' });
    }
}

/* logOut Function */

async function logout(req, reply) {
    try {
        /* rememeber to Pass Options and Path is always required */
        const options = {
            httpOnly: true,
            secure: true,
            path: '/v1/chief'

        };

        // Clear the access token cookie Remember to pass Options 
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

/* Update User Credantials Like fullname , status , and Role */

async function updateUser(req, reply) {
    try {
        let { fullname, status, role } = req.body;
        let user = await User.findOneAndUpdate(
            { _id: req.params.id },
            {
                fullname: fullname,
                status: status,
                role: role,
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }

        return reply.send(user);
    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'An error occurred' });
    }
}



/* render Form To update Password */
async function Changepassword(req, reply) {
    const currentUser = await User.findOne({ _id: req.params.id })

    const user = req.user

    return reply.view('changepwd.ejs', { user, currentUser })
}


/*  Update Password  */
async function updatePassword(req, reply) {
    let { CurrentPassword, NewPassword, ConfirmPassword } = req.body;
    let currentUser = req.user

    try {
        // Check if new passwords match
        if (NewPassword !== ConfirmPassword) {
            return reply.send('Passwords do not match');
        }

        // Handle user type 1 (SuperAdmin)
        if (req.user.role === `${process.env.USER_TYPE_1}`) {
            const user = await User.findOneAndUpdate(
                { _id: req.params.id },
                { password: NewPassword },
                { new: true }
            );

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            // Save the updated user
            await user.save();
            return reply.redirect('/v1/chief/users');
        }

        // Handle user type 2 (admin user)
        if (req.user.role === `${process.env.USER_TYPE_2}`) {
            // Validate if the current password is correct before updating
            const user = await User.findOne({ _id: req.params.id });

            if (!user) {
                return reply.status(404).send({ error: 'User not found' });
            }

            const isPasswordValid = await user.isPasswordCorrect(CurrentPassword);
            if (!isPasswordValid) {
                return reply.view('changepwd.ejs', { errorMessage: "Current password is incorrect!", user, currentUser });
            }

            // Update the password
            const updatedUser = await User.findOneAndUpdate(
                { _id: req.params.id },
                { password: NewPassword },
                { new: true }
            );

            if (!updatedUser) {
                return reply.status(404).send({ error: 'User not found' });
            }
            await updatedUser.save();
            return reply.redirect('/v1/chief/logout');
        }

        return reply.status(403).send({ error: 'Forbidden' });

    } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'An error occurred' });
    }
}


/* function for testing */
async function test(req, reply) {
    reply.send({ message: "This function only for Test" })
}


export {
    test,
    registerUser,
    renderLogin,
    loginUser,
    renderDashboard,
    deleteUser,
    logout, renderRegister,
    renderUsers,
    editUser,
    updateUser,
    Changepassword,
    updatePassword,

}