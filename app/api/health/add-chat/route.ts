import { NextResponse } from "next/server"
import query from "../../db/query"
import { getEmbedding } from "../../helper/helper"

export async function POST(request :Request){
    try {

        const req = await request.json()
        const {userId, chat, articleId} = req
        const embeddingText = await getEmbedding(chat)
        const queryString = `INSERT INTO ARTICLE_CHAT_EMBEDDING (user_identifier, message, embedding, article_id) VALUES
        ('${userId}', '${chat}', '[${embeddingText}]', '${articleId}')`
        await query(queryString)
        return NextResponse.json({'message': `SUCCESS`},{status:200});

    } catch (error) {
        return NextResponse.json({'message': `FAILURE`},{status:500});
    }
}