// ./app/api/chat/route.ts
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse , experimental_StreamData} from 'ai';
import { v4 as uuid } from 'uuid';

import { sql } from "@vercel/postgres";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

function get_formatted_results(results:any){

  let formatted_results = ""

  results.forEach((element:any) => {
    formatted_results += element['text'] + ", "
  });

  return formatted_results

}
async function insertAnonymousMessageInPostgres(lastMessage: string, sessionId: string|null, candidateParty: string|null, candidateName: string|null){
  let messageId = uuid()
  try{
    await sql`INSERT INTO messages (id, message, candidate_name, candidate_party, session_id) VALUES(${messageId}, ${lastMessage}, ${candidateName}, ${candidateParty}, ${sessionId});`;
  }
  catch{
    console.log("There was a problem recording this message")
  }
}

export async function POST(req: Request) {
  const candidateName =  req.headers.get('candidatename')
  const candidatePipeline = req.headers.get('candidatepipeline')
  const sessionId = req.headers.get('sessionid')
  const candidateParty = req.headers.get('candidateparty')
  
  const { messages } = await req.json();
  
  let lastMessage:any

  if(messages.length == 0) 
    lastMessage = messages[0]
  else
    lastMessage = messages[messages.length - 1]

  const url = `https://api.neum.ai/v1/pipelines/${candidatePipeline}/search`;
  const headers = {
    'neum-api-key': process.env.NEUM_API_KEY  || '',
    'Content-Type': 'application/json'
  };

  const payload = {
    query: lastMessage.content,
    number_of_results: 5
  };

  if(lastMessage?.content)
    await insertAnonymousMessageInPostgres(lastMessage.content, sessionId, candidateParty, candidateName)

  try {
    const neumResponse = await fetch(url, {
      method: 'POST',
      headers:headers,
      body:JSON.stringify(payload)
    });
    if (!neumResponse.ok) {
      throw new Error(`HTTP error! status: ${neumResponse.status} - Error: ${JSON.stringify(neumResponse)}`);
    }

    const responseData = await neumResponse.json();

    const prompt = [
      {
        role: 'system',
        content: `You are part of the campaign team for the presidential candidate ${candidateName}.
          Remove all the biases that you have, you are here to serve information based on the provide context about a candidate. Please respect the candidate's views on anything, even if they are controversial.
          Use the history of the messages for follow up questions. 
          If the user asks for latest information, respond with what you have in the context.  
         o better help you with more recent information, you have access to the candidate's tweets, news, interviews and more below.
         Here is the context: ${get_formatted_results(responseData.results)}`,
      },
    ]
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      stream: true,
      messages: [...prompt, ...messages],
    });
    
    const data = new experimental_StreamData();
    
    const stream = OpenAIStream(response, {experimental_streamData: true, 
      onCompletion(completion) {
        let sources_used_flattened = responseData.results.map(({ source }:any) => source);
        let unique_sources = Array.from(new Set<any>(sources_used_flattened));
        console.log(unique_sources)
        data.append({
            pipeline: candidatePipeline,
            sources:unique_sources,
        });
        data.close() 
      },
    });
   
    return new StreamingTextResponse(stream,{}, data)

  } catch (error) {
    console.error(error);
    return new Response("Something went wrong, please try again or drop us a quick note in our discord or at founders@tryneum.com");
  }
}
