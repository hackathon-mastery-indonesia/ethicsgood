import { NextResponse } from "next/server"
import query from "../../db/query"
import { getEmbedding } from "../../helper/helper"

export async function POST(request :Request){
    try {
        const req = await request.json()
        const {userId, chat, articleId, role} = req
        await createEmbeddingChat(chat, userId, role, articleId)
        return NextResponse.json({'message': `SUCCESS`},{status:200});

    } catch (error) {
        return NextResponse.json({'message': `FAILURE`},{status:500});
    }
}

export async function createEmbeddingChat(chat: any, userId: any, role: any, articleId: any){
    const embeddingText = await getEmbedding(chat)
    const queryString = `INSERT INTO ARTICLE_CHAT_EMBEDDING (user_identifier, message, embedding, article_id, role) VALUES
        ('${userId}', '${chat}', '[${embeddingText}]', '${articleId}', '${role}')`
    await query(queryString)
    return embeddingText;
}