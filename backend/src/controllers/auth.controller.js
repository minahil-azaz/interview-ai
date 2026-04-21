const UserModel = require('../models/user.model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tokenBlacklistModel = require('../models/blacklist.model');

/**
 * REGISTER CONTROLLER
 */
async function userRegisterController(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const isUserAlreadyExists = await UserModel.findOne({
            $or: [{ email }, { username }]
        });

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            email,
            password: hash
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token);

        return res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * LOGIN CONTROLLER
 * 
 * @name loginUserController
 * @description This controller is used to login the user and generate a token for the user and send it to the client in the cookie
 * @route POST /api/auth/login
 * @access Public
 */
async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token);

        return res.status(200).json({
            message: "Login Successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}

/**
 * @name logoutUserController
 * @description This controller is used to logout the user and add the token in the blacklist so that the user cannot use the same token to access the protected routes 
 * @access Public
 * 
 * 
 *  
 */
const logoutUserController = async (req, res) => {
    try {
        const token = req.cookies?.token;

        if (token) {
            await tokenBlacklistModel.create({ token });
        }

        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout Successful"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Logout failed",
            error: error.message
        });
    }
};

/**
 * GET ME CONTROLLER
 * 
 * @name getMeController
 * @description This controller is used to get the user profile here we will get the user details from the token and then we will send the user details to the client
 * @route GET /api/auth/get-me
 * @access Private
 */

const getMeController = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id)

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    userRegisterController,
    loginUserController,
    logoutUserController,
    getMeController
};