const { GoogleGenAI } = require("@google/genai");
const {z} = require ("zod");
const{ zodToJsonSchema } = require( "zod-to-json-schema");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


const interviewReportSchema = z.object({
  matchScore: z.number().describe("A score representing how well the candidate matches the job requirements"),
  technicalQuestions: z.array(
    z.object({
      question: z.string().describe("The technical question asked during the interview"),
      intention: z.string().describe("The intention behind asking the technical question"),
      answer: z.string().describe("The candidate's answer to the technical question"),
    })
  ).describe("An array of technical questions asked during the interview"),

  behavioralQuestions: z.array(
    z.object({
      question: z.string().describe("The behavioral question asked during the interview"),
      intention: z.string().describe("The intention behind asking the behavioral question"),
      answer: z.string().describe("The candidate's answer to the behavioral question"),
    })
  ).describe("An array of behavioral questions asked during the interview"),

  skillGap: z.array(z.object({
    skill:z.string().describe("the skill which the candiate is lacking  "),
    severity: z.enum(["low", "high", "medium"]).describe("the severity of this skill gap. i.e.  "),

    })).describe("Analysis of the candidate's skill gaps based on interview performance"),


  preparationTip: z.array(
    z.object({
      day: z.number().describe("Day number for the preparation plan"),
      focus: z.string().describe("Focus area for that day"),
      tasks: z.array(z.string()).describe("Tasks to complete on that day"),
    })
  ).describe("Preparation plan based on candidate performance"),
})

async function generateInterviewReport({resume,jobDescription,selfDescription}){ 

    const prompt = `Generate an interview report based on the following information:
    Resume: ${resume}
    Job_Description: ${jobDescription}
    Self_Description: ${selfDescription}
                    
    `

    const response = await ai.models.generateContent({

      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema)
    }
});


    return JSON.parse(response.text)
    
}



async function invokeGeminiAi() {
    const response = await ai.models.generateContent({  
        model: "gemini-3-flash-preview",
        contents: "What is the capital of France?"
    });
    console.log(response.text);  
}

module.exports = {
    generateInterviewReport
}

