import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST(req: Request) {
    let res = await req.json()
    await kv.sadd(`feedbacks`,res.feedback);
    return NextResponse.json({"success":"yes"});
}