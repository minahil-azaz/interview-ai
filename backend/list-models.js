const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function listModels() {
    try {
        const response = await ai.models.list();
        console.log("Available models:");
        if (response.models && response.models.length > 0) {
            response.models.forEach(model => {
                console.log(`- ${model.name}`);
            });
        } else {
            console.log("No models found or different response structure:", response);
        }
    } catch (error) {
        console.error("Error listing models:", error.message);
        if (error.error) {
            console.error("Details:", error.error);
        }
    }
}

listModels();