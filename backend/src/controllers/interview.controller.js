const PDFParser = require('pdf2json');
const { generateInterviewReport,generaterResumePdf } = require('../services/ai.service');
const interViewReportModel = require('../models/interviewReportModel');



/**
 * Generate an interview report
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateInterViewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!selfDescription || !jobDescription) {
            return res.status(400).json({
                success: false,
                message: "Self description and job description are required"
            });
        }

        console.log("Processing PDF with pdf2json...");

        // ✅ Safe decode - won't crash on special/malformed URI characters
        const safeDecode = (str) => {
            try {
                return decodeURIComponent(str);
            } catch {
                return str; // Return raw string if decoding fails
            }
        };

        const extractPdfText = (buffer) => {
            return new Promise((resolve, reject) => {
                const pdfParser = new PDFParser(null, 1);

                pdfParser.on('pdfParser_dataError', (err) => {
                    reject(new Error(`PDF parsing error: ${err.parserError}`));
                });

                pdfParser.on('pdfParser_dataReady', (pdfData) => {
                    try {
                        const text = pdfData.Pages.map(page =>
                            page.Texts.map(t =>
                                t.R.map(r => safeDecode(r.T)).join('')  // ✅ use safeDecode
                            ).join(' ')
                        ).join('\n');

                        if (!text || text.trim().length === 0) {
                            reject(new Error("Could not extract text from PDF. The file may be scanned or image-based."));
                        } else {
                            resolve(text.trim());
                        }
                    } catch (error) {
                        reject(new Error(`Text extraction failed: ${error.message}`));
                    }
                });

                pdfParser.parseBuffer(buffer);
            });
        };

        const resumeContent = await extractPdfText(req.file.buffer);
        console.log("PDF parsed successfully. Text length:", resumeContent.length);

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interViewReportModel.create({
            jobDescription,
            resumeText: resumeContent,
            selfDescription,
            title: interViewReportByAi.title || "Interview Report",
            matchScore: {
                technicalSkills: interViewReportByAi.matchScore?.technicalSkills || 75,
                overall: interViewReportByAi.matchScore?.overall || 0
            },
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behaviouralQuestions: interViewReportByAi.behaviouralQuestions || interViewReportByAi.behavioralQuestions || [],
            skillGap: interViewReportByAi.skillGap || [],
            preparationTips: interViewReportByAi.preparationTips || interViewReportByAi.preparationTip || [],
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to generate interview report",
            error: error.message
        });
    }
}

/**
 * 
 * @description Get interview report by ID
 */


async function getInterviewReportController(req, res) {
    try {
        const reportId = req.params.id;
        const interviewReport = await interViewReportModel.findOne({ _id: reportId, user: req.user.id });

        if (!interviewReport) {
            return res.status(404).json({
                success: false,
                message: "Interview report not found"
            });
        }

        res.status(200).json({
            success: true,
            interviewReport
        });
    } catch (error) {
        console.error('Error fetching interview report:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch interview report",
            error: error.message
        });
    }
}


/** * @route GET /api/interview/reports
 * @description controller to get all interview reports of a login user
 * @access private
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interViewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-resumeText -selfDescription -jobDescription -__v -technicalQuestions -behaviouralQuestions -skillGap -preparationTips');

        res.status(200).json({
            success: true,
            interviewReports
        });
    } catch (error) {
        console.error('Error fetching interview reports:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch interview reports",
            error: error.message
        });
    }
}

/**
 * @description controller to generate the pdf resume on the basis of resume content and self description and job description
 */

async function generateResumePdfController(req, res){
    const { InterviewReportId } = req.params
    const interviewReport = await interViewReportModel.findById(InterviewReportId)

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    // Use correct field names from the model
    const { resumeText, jobDescription, selfDescription } = interviewReport

    if (!resumeText) {
        return res.status(400).json({
            message: "No resume content found in this report"
        })
    }

    try {
        // Call the correct function name (generaterResumePdf)
        const pdfBuffer = await generaterResumePdf({
            resume: resumeText,
            jobDescription,
            selfDescription
        })

        // Set proper headers and send the PDF buffer only once
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${InterviewReportId}.pdf`,
            "Content-Length": pdfBuffer.length
        })
        
        res.send(pdfBuffer)
    } catch (error) {
        console.error('Error generating PDF:', error)
        res.status(500).json({
            message: "Failed to generate resume PDF",
            error: error.message
        })
    }
}



module.exports = { generateInterViewReportController, getInterviewReportController, getAllInterviewReportsController, generateResumePdfController};