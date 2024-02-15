import { NextResponse } from "next/server"
import query from "../../db/query"
import { getArticleJSONString, getEmbedding } from "../../helper/helper"
import { createEmbeddingChat } from "../add-chat/route"

export async function POST(request :Request){
    try {
        const req = await request.json()
        const {userQuestion, article, userId, articleId} = req
        //const embeddingText = await createEmbeddingChat(userQuestion, userId, 'USER', articleId )
        const embeddingText = await getEmbedding(userQuestion)
        const res = await query(`SELECT a.message FROM ARTICLE_CHAT_EMBEDDING a ORDER BY a.embedding <-> '[${embeddingText}]'`)
        const rows = res.rows
        const prompt = `
        you are ethics and etiquette assistant who has focus giving education and information to user about the article below to response user question.
        article:${article}
        maybeContext:${rows.length == 0? '': `'${rows[0].message}'`}
        userQuestion:'${userQuestion.replace(/(\n|\r|\r\n){2,}/g, "").replace(/\s{2,}/g, " ")}'
        your response:
        `;
        const answer = await getArticleJSONString(prompt)
        await createEmbeddingChat(userQuestion.replace(/(\n|\r|\r\n){2,}/g, "").replace(/\s{2,}/g, " "), userId, 'USER', articleId )
        await createEmbeddingChat(answer.replace(/(\n|\r|\r\n){2,}/g, "").replace(/\s{2,}/g, " "), userId, 'AI', articleId )
        return NextResponse.json({'message': `SUCCESS`},{status:200});

    } catch (error) {
        console.log(error)
        return NextResponse.json({'message': `FAILURE`, 'error': error},{status:500});
    }
}