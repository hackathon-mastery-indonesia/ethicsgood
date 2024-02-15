import { NextResponse } from "next/server"
import query from "../../db/query"
import { getEmbedding } from "../../helper/helper"



export async function createEmbeddingChat(chat: any, userId: any, role: any, articleId: any){
    const embeddingText = await getEmbedding(chat)
    const queryString = `INSERT INTO ARTICLE_CHAT_EMBEDDING (user_identifier, message, embedding, article_id, role) VALUES
        ('${userId}', '${chat}', '[${embeddingText}]', '${articleId}', '${role}')`
    await query(queryString)
    return embeddingText;
}