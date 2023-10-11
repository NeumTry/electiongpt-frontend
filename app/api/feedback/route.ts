import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
    let res = await req.json()
    const id: string = uuid();
    await kv.hset("feedbacks", { id: id, feedback: res.feedback})
    return NextResponse.json({"success":"yes"});
}