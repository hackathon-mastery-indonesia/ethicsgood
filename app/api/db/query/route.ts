import { NextResponse } from "next/server";
import query from "../query"

export async function POST(request :Request){
    const req = await request.json()
    const {queryString} = req
    const res = await query(queryString)
    return NextResponse.json({'result':res},{
        status: 200,
      });
}