import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
    let response = null
    try{
      let {rows} =  await sql`SELECT * FROM hot_questions ORDER BY score desc LIMIT 5`;
      response = rows
    }
    catch(e){
      console.log(`There was a problem recording this feedback ${e}`)
    }
    return NextResponse.json({data:response});
}