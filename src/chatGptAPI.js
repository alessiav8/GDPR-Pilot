import { OpenAI } from "openai";
//const path = require(‘path’)
//require(‘dotenv’).config({ path: path.resolve(__dirname, ‘…/.env’) })

const openai = new OpenAI({
    apiKey: "" //process.env.OPENAI_API_KEY
});

export async function callChatGpt(){
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant." }],
            model: "text-davinci-00",
        });

        console.log(completion.choices[0]);
    } catch (error) {
        console.error("Si è verificato un errore:", error);
    }
    
}