import { NextResponse } from "next/server"
import { getEmbedding } from "../../helper/helper"
import query from "../../db/query"

export async function POST(request: Request){

    const req =  await request.json()
    const {searchTitle} = req
    try {
        const embedding = await getEmbedding(searchTitle)
        const res = await query(`SELECT a.id, a.title, a.json, ae.embedding <-> '[${embedding}]' as similarity, 
        c.name as category_name, a.thumbnail
        FROM ARTICLE a JOIN 
        ARTICLE_ARTICLE_CATEGORY aac ON a.id =  aac.articleId JOIN ARTICLE_CATEGORY c ON aac.categoryId = c.id JOIN ARTICLE_EMBEDDING ae ON a.id = ae.artikel_id 
         WHERE (ae.embedding <-> '[${embedding}]') < 0.7
        ORDER BY ae.embedding <-> '[${embedding}]';
        `)

        const rows = res.rows

        //SELECT * FROM items WHERE id != 1 ORDER BY embedding <-> (SELECT embedding FROM items WHERE id = 1) LIMIT 5;

        console.log(res)
        return NextResponse.json({rows: rows})
    } catch (error) {
        console.log(error)
        return NextResponse.json({},{status:500})
    }

}