const { GoogleGenAI } = require("@google/genai");
const { z, json } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score representing how well the candidate matches the job requirements (0-100)"),
    technicalQuestions: z.array(
        z.object({
            question: z.string().describe("The technical question asked during the interview"),
            intention: z.string().describe("The intention behind asking the technical question"),
            answer: z.string().describe("The candidate's answer to the technical question"),
        })
    ).describe("An array of technical questions asked during the interview"),
    
    behaviouralQuestions: z.array(
        z.object({
            question: z.string().describe("The behavioural question asked during the interview"),
            intention: z.string().describe("The intention behind asking the behavioural question"),
            answer: z.string().describe("The candidate's answer to the behavioural question"),
        })
    ).describe("An array of behavioural questions asked during the interview"),
    
    skillGap: z.array(
        z.object({
            skill: z.string().describe("the skill which the candidate is lacking"),
            severity: z.enum(["low", "high", "medium"]).describe("the severity of this skill gap"),
        })
    ).describe("Analysis of the candidate's skill gaps based on interview performance"),
    
    preparationTips: z.array(
        z.object({
            day: z.number().describe("Day number for the preparation plan"),
            focus: z.string().describe("Focus area for that day"),
            tasks: z.array(z.string()).describe("Tasks to complete on that day"),
        })
    ).describe("Preparation plan based on candidate performance"),
    title: z.string().describe("The title of the interview report")
});

async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
    try {
        const prompt = `Generate a detailed interview report in JSON format with the following structure:

{
  "matchScore": number (0-100),
  "technicalQuestions": [{"question": string, "intention": string, "answer": string}],
  "behaviouralQuestions": [{"question": string, "intention": string, "answer": string}],
  "skillGap": [{"skill": string, "severity": "low"|"medium"|"high"}],
  "preparationTips": [{"day": number, "focus": string, "tasks": [string]}]
}

Based on:
- Resume: ${resume}
- Job Description: ${jobDescription}
- Self Description: ${selfDescription}

Generate at least 3 technical questions, 3 behavioural questions, 2 skill gaps, and 5 preparation tips. The answer field in questions should be based on the candidate's resume and self-description.`;
        
        // FIXED: Changed model name from "gemini-3-flash-preview" to a valid model
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", // Valid model name
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        
        // Parse the response - handle markdown code blocks
        let responseText = response.text;
        
        // Remove markdown code blocks if present
        if (responseText.includes('```json')) {
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
        } else if (responseText.includes('```')) {
            responseText = responseText.replace(/```\n?/g, '');
        }
        
        const result = JSON.parse(responseText);
        
        console.log("AI Response raw:", JSON.stringify(result, null, 2));
        
        // Helper function to parse any nested structure
        const parseField = (data, fieldName) => {
            console.log(`Parsing ${fieldName}:`, JSON.stringify(data, null, 2));
            
            if (!data) return [];
            
            // If it's a string, try to parse it
            if (typeof data === 'string') {
                let str = data.trim();
                // Remove backticks if present
                if (str.startsWith('`') && str.endsWith('`')) {
                    str = str.slice(1, -1).trim();
                }
                try {
                    data = JSON.parse(str);
                } catch (e) {
                    console.log(`Failed to parse ${fieldName}:`, e.message);
                    return [];
                }
            }
            
            // If it's a single object, wrap in array
            if (typeof data === 'object' && !Array.isArray(data)) {
                if (data.question || data.day || data.skill) {
                    return [data];
                }
                return [];
            }
            
            // If it's an array, process each item
            if (Array.isArray(data)) {
                return data.map(item => {
                    if (typeof item === 'string') {
                        let str = item.trim();
                        // Remove backticks
                        if (str.startsWith('`') && str.endsWith('`')) {
                            str = str.slice(1, -1).trim();
                        }
                        // Handle JSON object string
                        if (str.startsWith('{') && str.endsWith('}')) {
                            try {
                                return JSON.parse(str);
                            } catch {
                                return null;
                            }
                        }
                        // Handle JSON array string
                        if (str.startsWith('[') && str.endsWith(']')) {
                            try {
                                const parsed = JSON.parse(str);
                                if (Array.isArray(parsed)) {
                                    return parsed[0]; // Return first item
                                }
                                return parsed;
                            } catch {
                                return null;
                            }
                        }
                        return null;
                    }
                    return item;
                }).filter(item => item !== null && typeof item === 'object');
            }
            
            return [];
        };
        
        // Ensure all required fields exist with defaults and match schema
        return {
            title: result.title || "Interview Report",
            matchScore: {
                technicalSkills: result.matchScore || 75,
                overall: result.matchScore || 0
            },
            technicalQuestions: parseField(result.technicalQuestions, 'technicalQuestions'),
            behaviouralQuestions: parseField(result.behaviouralQuestions || result.behavioralQuestions, 'behaviouralQuestions'),
            skillGap: parseField(result.skillGap, 'skillGap'),
            preparationTips: parseField(result.preparationTips || result.preparationTip, 'preparationTips')
        };
        
    } catch (error) {
        console.error("Error in generateInterviewReport:", error);
        
        // Return a default report if AI fails (for testing)
        return {
            title: "Interview Report",
            matchScore: {
                technicalSkills: 75,
                overall: 75
            },
            technicalQuestions: [
                {
                    question: "Explain your experience with JavaScript frameworks?",
                    intention: "To assess technical proficiency",
                    answer: "I have worked with React and Node.js for 3 years."
                }
            ],
            behaviouralQuestions: [
                {
                    question: "Tell me about a time you faced a challenge at work?",
                    intention: "To assess problem-solving skills",
                    answer: "I once had to debug a production issue and resolved it within 2 hours."
                }
            ],
            skillGap: [
                {
                    skill: "Cloud Computing",
                    severity: "medium"
                }
            ],
            preparationTips: [
                {
                    day: 1,
                    focus: "Core Technical Skills",
                    tasks: ["Review JavaScript fundamentals", "Practice coding problems"]
                },
                {
                    day: 2,
                    focus: "System Design",
                    tasks: ["Study database design", "Learn about microservices"]
                }
            ]
        };
    }
};


async function generatePdfToHtml(htmlContent){
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent (htmlContent,{waitUntil:"networkidle0"})
    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generaterResumePdf({resume,selfDescription,jobDescription}){
    const resumePdfSchema = z.string().describe("the html content of the resume which can be converted into pdf by using lib")

    const prompt = `generate a. resume pdf for a candidate with the following details:
    Resume:${resume},
    self description:${selfDescription},
    job description:${jobDescription}

    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    
    `
    const response = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema:zodToJsonSchema(resumePdfSchema)
            }

    })
   const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfToHtml(jsonContent.html)

    return pdfBuffer

}


module.exports = {
    generateInterviewReport,
    generaterResumePdf
};