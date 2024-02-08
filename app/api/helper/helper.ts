import axios from "axios"
import query from "../db/query"

const getArticleJSONString = async (task : string) : Promise<string> => {
    const chat = await axios.post(
      process.env['AZURE_OPENAI_API_URL']  == undefined ? 
      'ERR'
      : process.env['AZURE_OPENAI_API_URL'] 
      ,
      { 
          "prompt": task,
          "temperature": 0.8,
          "top_p": 1,
          "frequency_penalty": 0,
          "presence_penalty": 0.5,
          "max_tokens": 3900,
          "best_of": 1,
          "stop": null,
          "stream":true
        },
          {
              headers: {
                'Content-Type': 'application/json',
                'api-key': process.env['AZURE_OPENAI_API_KEY']
              },
              responseType: 'stream'
            }
      )
  
    let str = ''
    let strLst = []
    let answer:string = ''
    answer = await new Promise<string>((resolve,reject)=>{
      try {
        chat.data.on('data', (chunk:any) => {
          // Handle each chunk of data
          let chunkStr : string = chunk.toString()
          str+=chunkStr
        });
        
        chat.data.on('end', () => {
          // Streaming is complete
        //  console.log('Streaming complete');
         // console.log('\n --------------------------------')
          strLst = str.split('data: ').filter((data)=>  data.trim() !== '')
          strLst = strLst.map(data => data.trim()).slice(0, -1); // hapus benda ga jelas
          strLst.forEach(data => {
            const parsed = JSON.parse(data)
            if(parsed.choices && parsed.choices[0] && parsed.choices[0].text){
              answer += parsed.choices[0].text
            }
          })
          //console.log(answer)
          resolve(answer)
        });
        
      } catch (error) {
        reject()
      }
    })
    return answer
  }

  const getEmbedding = async (text: string) : Promise<any> => {
    const url : string = process.env['AZURE_OPENAI_EMBEDDING_URL'] != undefined ?  process.env['AZURE_OPENAI_EMBEDDING_URL'] : 'ERR'
    const res = await axios.post(url, {
        'input': text
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'api-key': process.env['AZURE_OPENAI_API_KEY']
          },
    })
    return res.data.data[0].embedding;
  }

  
  const addArticle = async (articleJSON : any) : Promise<number> => {
    let title = ''
    let categories: string[] = []
    try {
      title = articleJSON.article_title
      categories = articleJSON.categories as string[]
    } catch (error) {
      console.log('Disini')
      console.log(error)
    }
   console.log('--------------------------------------------------')
    

    let categoriesStr = `ARRAY [${categories}]`
    categoriesStr = categoriesStr.replace(/\[([^'\]]+)\]/g, (match, p1) => {
      const elements = p1.split(',').map((item :string )=> `'${item.trim()}'`);
      return `[${elements.join(',')}]`;
    });
    console.log(categoriesStr)
    const insertArticleQuery = `
      SELECT insert_article_with_categories ('${title}','${JSON.stringify(articleJSON).replace(/'/g, "''")}', ${categoriesStr} );
    `
      const articleData = await query(insertArticleQuery)
      return parseInt(articleData.rows[0].insert_article_with_categories)
  }

  const buildHTMLArticle = (articleJSON : any) : string =>  {
    console.log(articleJSON)
    let str = `<article class="article">`;
    str +=`<p class="article-introduction">${articleJSON.introduction}</p>`
    str += `<div>`
    for(const solution of articleJSON.solutions){
      const solutionTitle = solution.title;
      const solutionDescription = solution.description;
      const examples = solution.example;
      str += `<h2 class="solution-title">${solutionTitle}</h2>`
      str += `<p class="solution-description">${solutionDescription}</p>`
      if(examples != undefined && examples != null){
        const solutionExamples = []
        for(const example of examples ){
          solutionExamples.push(example)
        }
        let exampleHTML = ``
        for(const exmp of solutionExamples){
          exampleHTML += `<li class="solution-example">${exmp}</li>`
        }
        str+= `<ul>${exampleHTML}</ul>`
      }
      
    }
    str += `</div>`
    str += `<div class="article-conclusion">
    <p>${articleJSON.conclusion}</p>
    </div>`
    str+= `</article>`
    return str
  }

  export {getArticleJSONString, getEmbedding, addArticle}