const PDFParser = require('pdf2json');
const { generateInterviewReport } = require('../services/ai.service');
const interViewReportModel = require('../models/interviewReportModel');

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
            matchScore: {
                technicalSkills: interViewReportByAi.matchScore || 75
            },
            technicalQuestions: interViewReportByAi.technicalQuestions || [],
            behaviouralQuestions: interViewReportByAi.behavioralQuestions || [],
            skillGap: interViewReportByAi.skillGap || [],
            preparationTips: interViewReportByAi.preparationTip || [],
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

module.exports = { generateInterViewReportController };