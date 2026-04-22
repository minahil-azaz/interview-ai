const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({  
        model: "gemini-2.5-flash",
        contents: "What is the capital of France?"
    });
    console.log(response.text);  
}

module.exports = invokeGeminiAi;