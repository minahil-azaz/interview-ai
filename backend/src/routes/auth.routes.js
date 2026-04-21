// destructuring method where we call the router from express and then we call the router.use() to use the routes in the app.js file

const {Router} = require('express');
const { model } = require('mongoose');
const {userRegisterController} = require('../controllers/auth.controller');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', authController.userRegisterController);

/**
 * @route POST /api/auth/login
 * @description login user with email and username
 * @access Public
 */

router.post("/login", authController.loginUserController)



/**
 * @route POST /api/auth/logout
 * @description logout user and add the token in the blacklist
 * @access Public
 * 
 * 
 */

router.post("/logout", authController.logoutUserController)

/***
 * @route get /api/auth/get-me
 * @description get the user profile here we will get the user details from the token and then we will send the user details to the client
 * @access Private
 * 
 */

router.get("/get-me", authMiddleware.authMiddleware, authController.getMeController)



module.exports = router;

