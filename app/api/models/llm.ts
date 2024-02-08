import OpenAI from "openai";
const openAIInstance = new OpenAI({
    baseURL: process.env.AZURE_OPENAI_API_BASE,
    apiKey:process.env.AZURE_OPENAI_API_KEY
})
export default openAIInstance