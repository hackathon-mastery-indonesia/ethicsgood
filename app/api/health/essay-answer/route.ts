import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getArticleJSONString, getEmbedding, addArticle } from "../../helper/helper";
import query from "../../db/query";


export async function POST(request :Request){
    const req = await request.json()
    const {userAnswer, question} = req
    try{
        
        const task = `
        question: '${question}',
        userAnswer: '${userAnswer}'
        Pretend you are health instructor  who is correcting user's answer.
        Do not include any explanations, only provide a raw JSON response  following this format without deviation and dont allow unnecessary trailing commas and dont allow comments.
        {
          "is_answer_true": boolean,
          "explanation": give explaination string why you consider the user's answer to be correct or incorrect
        }
        The JSON response:`
       
        const rawJSON = await getArticleJSONString(task)
        console.log(rawJSON)
        return NextResponse.json({result: rawJSON});
    }
    catch (error: AxiosError | any) {
        if (error.response) {
          // Kesalahan respons dari server
          console.error('Server responded with a non-success status:', error.response.status);
          console.error('Server response data:', error.response.data);
          console.error('Server response headers:', error.response.headers);
        } else if (error.request) {
          // Kesalahan tanpa respons dari server
          console.error('No response received from server. Request made but no response.');
        } else {
          // Kesalahan lainnya
          console.error('Error during request setup:', error.message);
        }
        return NextResponse.json({'message':'yoi', 'status': 'FAILED'},{
          status: 400,
        });
      }
}