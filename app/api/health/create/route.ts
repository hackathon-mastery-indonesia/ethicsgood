import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getArticleJSONString, getEmbedding, addArticle, getImage } from "../../helper/helper";
import query from "../../db/query";


export async function POST(request :Request){
    const req = await request.json()
    const {prompt} = req
    try{
        const task = `
        problem: '${prompt}'.
        Pretend you are automatic article generator with a focus on
        creating complex and meaningful solutions or tips for ethics and social etiquette based on user situations or questions provided in the problem.
        Do not include any explanations, only provide a raw JSON response  following this format without deviation and dont allow unnecessary trailing commas and dont allow comments.
        {
          "article_title": string,
          "categories": list of string that relevant with the problem (max 2),
          "introduction": string,
          "explanation": string minimal MUST consist of 3 paragraphs,
          "study_cases": non empty list of 5 different problem recommendation quiz study case title based on the article,
          "tips":non empty list with minimal 6 elements inside it [{"title":string,"description":string, "example": non empty list of string with minimal four elements inside it, "question": A question to enhance the user understanding of the provided solution}], 
          "conclusion": string
        }
        The JSON response:`

        
        
        const rawArticleJSON = await getArticleJSONString(task)
        const articleJSON = await JSON.parse(rawArticleJSON.trim())
        const id = await addArticle(articleJSON)
        const imageTask = `
        article title: '${articleJSON['article_title']}'.
        Assuming you are a japanese article anime thumbnail  illustrator for an image generator model. Your task is to prompt a Japanese anime scene by 
        very detailed illustrate faces,  eyes,   appearances,  genders, and expressions for each character and suitable background which suited with the article title so that the image generator model can produce better thumbnail.
        Do not include any explanations, only provide a raw JSON Response following this format without deviation and 
        dont allow unnecessary trailing commas and dont allow comments. 
        {
          "illustration": string 
        }
        The JSON response:
        `
        const imagePrompt = await getArticleJSONString(imageTask)
        const imagePromptJSON = await JSON.parse(imagePrompt.trim())
        console.log(imagePromptJSON)
        ///////////////////////////////////////// CONCURRENT ///////////////////////////////////////////////////////
        Promise.all([
          getEmbedding(`{title:${articleJSON['article_title']}, content:${rawArticleJSON}`),
          getEmbedding(prompt),
          getEmbedding(articleJSON['categories'])
        ]).then(res=>{
          console.log(id)
          const [titleEmbedding, problemEmbedding, categoryEmbedding] = res
          const queryString = `INSERT INTO ARTICLE_EMBEDDING(artikel_id, embedding, problem_embedding, categories_embedding)
          VALUES ('${id}','[${titleEmbedding}]','[${problemEmbedding}]','[${categoryEmbedding}]');`
          query(queryString).then(res=>{
            console.log(res)
          });
        });
        await new Promise<void>((resolve, reject)=>{
            try {
              getImage(`japanese anime style image, ${imagePromptJSON['illustration']}`).then((res)=>{
                query(`UPDATE ARTICLE SET thumbnail = '${res}' WHERE id = '${id}' `)
                resolve()
              })
            } catch (error) {
              console.log(error)
              reject()
            }
        })
       
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