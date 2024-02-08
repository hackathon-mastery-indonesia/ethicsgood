import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getArticleJSONString, getEmbedding, addArticle } from "../../helper/helper";
import query from "../../db/query";


export async function POST(request :Request){
    const req = await request.json()
    const {answerType, problem} = req
    try{
        let task = ``
        if(answerType == 'MULTIPLE_CHOICES'){
            task = `
        problem: '${problem}'.
        Pretend you are automatic multiple choice quiz generator with a focus on
        creating complex and meaningful quiz for health based on user situations provided in the problem.
        Do not include any explanations, only provide a raw JSON response  following this format without deviation and dont allow unnecessary trailing commas and dont allow comments.
        {
          "question_list":non empty list with minimal 6 elements inside it [{"question":string, "choice_list": non empty list of string with minimal four choices inside it, "true_choice": correct answer based on the given list of choices}], 
        }
        The JSON response:`
        }
        else{
            task = `
        problem: '${problem}'.
        Pretend you are automatic essay quiz generator with a focus on
        creating complex and meaningful quiz for health based on user situations provided in the problem.
        Do not include any explanations, only provide a raw JSON response  following this format without deviation and dont allow unnecessary trailing commas and dont allow comments.
        {
          "question_list":non empty list of string with minimal 8 questions inside it
        }
        The JSON response:`
        }
        const rawJSON = await getArticleJSONString(task)
        console.log(rawJSON)
        return NextResponse.json({quiz:rawJSON, answerType:answerType});
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