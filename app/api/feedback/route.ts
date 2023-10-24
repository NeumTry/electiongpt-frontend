import { NextResponse } from 'next/server';
import { sql } from "@vercel/postgres";
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
    const sessionId =  req.headers.get('sessionId')
    let res = await req.json()
    let feedback_id = uuid()
    try{
      await sql`INSERT INTO feedbacks (id, feedback, email, session_id) VALUES(${feedback_id}, ${res?.feedback?.feedbackContent}, ${res?.feedback?.emailAddress}, ${sessionId});`;
    }
    catch(e){
      console.log(`There was a problem recording this feedback ${e}`)
    }
    return NextResponse.json({"success":"yes"});
}