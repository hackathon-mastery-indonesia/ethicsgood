import axios from "axios"
import { NextResponse } from "next/server"

export async function POST(request: Request){
    try {
        const props = await request.json()
    const {userAnswer, question} = props
    const prompt = `
    question: '${question}'.
    userAnswer:'${userAnswer}'
    The user is sharing an opinion about the question. 
    Assume you are an health assistant, then respond whether the user's opinion is appropriate or not regarding the question.
    answer:
    `
    const chat = await axios.post(
        process.env['AZURE_OPENAI_API_URL']  == undefined ? 
        'ERR'
        : process.env['AZURE_OPENAI_API_URL'] 
        ,
        { 
            "prompt": prompt,
            "temperature": 0.8,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0.5,
            "best_of": 1,
            "max_tokens": 1500,
            "stop": null,
          },
            {
                headers: {
                  'Content-Type': 'application/json',
                  'api-key': process.env['AZURE_OPENAI_API_KEY']
                },
              }
        )
        console.log(chat.data)
        return NextResponse.json({answer:chat.data.choices[0].text},{status:200})
    } catch (error) {
        return NextResponse.json({},{status:500})
    }
    
}