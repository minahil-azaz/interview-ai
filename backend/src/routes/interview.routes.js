const express = require("express")
const  authMiddleware  = require("../middlewares/auth.middleware")
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')

const interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @description  generate new interview on the basis of user self description and resume and job description
 * @access private
 */


interviewRouter.post("/",authMiddleware.authMiddleware,
    upload.single('resume'),
    interviewController.generateInterViewReportController)

module.exports = interviewRouter

