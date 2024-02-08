import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getArticleJSONString, getEmbedding, addArticle } from "../../helper/helper";
import query from "../../db/query";


export async function POST(request :Request){
    const req = await request.json()
    const {prompt} = req
    try{
        const task = `
        problem: '${prompt}'.
        Pretend you are automatic article generator with a focus on
        creating complex and meaningful solutions for health based on user situations provided in the problem.
        Do not include any explanations, only provide a raw JSON response  following this format without deviation and dont allow unnecessary trailing commas and dont allow comments.
        {
          "article_title": string,
          "is_relevant_context": kalo saya membahas problem diatas apakah ada keterkaitan 100% dengan skenario atau masalah yang berkaitan dengan kesehatan apa ngga? (boolean),
          "categories": list of string that relevant with the problem,
          "introduction": string,
          "study_cases": non empty list of 5 different problem recommendation quiz study case title based on the article,
          "solutions":non empty list with minimal 6 elements inside it [{"title":string,"description":string, "example": non empty list of string with minimal four elements inside it, "question": A question to enhance the user understanding of the provided solution}], 
          "conclusion": string
        }
        The JSON response:`
        
        const rawArticleJSON = await getArticleJSONString(task)
        const articleJSON = await JSON.parse(rawArticleJSON.trim())
        const id = await addArticle(articleJSON)

        ///////////////////////////////////////// CONCURRENT ///////////////////////////////////////////////////////
        Promise.all([
          getEmbedding(articleJSON['article_title']),
          getEmbedding(prompt),
          getEmbedding(articleJSON['categories'])
        ]).then(res=>{
          console.log(id)
          const [titleEmbedding, problemEmbedding, categoryEmbedding] = res
          const queryString = `INSERT INTO ARTICLE_EMBEDDING(artikel_id, title_embedding, problem_embedding, categories_embedding)
          VALUES ('${id}','[${titleEmbedding}]','[${problemEmbedding}]','[${categoryEmbedding}]');`
          query(queryString).then(res=>{
            console.log(res)
          });
        });
        /////////////////////////////////////////////////////////////////////////////////////
        return NextResponse.json({'url': `/content/${id}`});
       
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