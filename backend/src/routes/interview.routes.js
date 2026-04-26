const express = require("express")
const  authMiddleware  = require("../middlewares/auth.middleware")
const interviewController = require('../controllers/interview.controller')
const upload = require('../middlewares/file.middleware')
const generateResumePdfController = require('../controllers/interview.controller')
const InterviewReport = require("../models/interviewReportModel")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @description  generate new interview on the basis of user self description and resume and job description
 * @access private
 */


interviewRouter.post("/",authMiddleware.authMiddleware,
    upload.single('resume'),
    interviewController.generateInterViewReportController)

/**
 * @route GET /api/interview/reports/:id
 * @description get interview report by id
 * @access private
 */

interviewRouter.get("/reports/:id", authMiddleware.authMiddleware, interviewController.getInterviewReportController);


/** * @route GET /api/interview/reports
 * @description controller to get all interview reports of a login user
 * @access private
 */
interviewRouter.get("/reports", authMiddleware.authMiddleware, interviewController.getAllInterviewReportsController);


/**
 * @route GET /api/interview/resume/pdf
 * @description generte resume pdf on the basis of resume content and user selfdescription  and job description
 * @access private
 */

interviewRouter.post("/resume/pdf/:InterviewReportId", authMiddleware.authMiddleware, interviewController.generateResumePdfController)



module.exports = interviewRouter

