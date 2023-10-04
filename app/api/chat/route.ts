// ./app/api/chat/route.ts
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const candidateName =  req.headers.get('candidatename')
  const candidatePipeline = req.headers.get('candidatepipeline')

  const { messages } = await req.json();
  
  let lastMessage = messages[messages.length - 1]
    
  if(messages.length == 0) 
    lastMessage = messages[0]
  const url = `https://api.neum.ai/v1/pipelines/${candidatePipeline}/search`;
  const headers = {
    'neum-api-key': process.env.NEUM_API_KEY  || '',
    'Content-Type': 'application/json'
  };

  const payload = {
    query: lastMessage.content,
    number_of_results: 5
  };

  try {
    // Make the POST request
    const neumResponse = await fetch(url, {
      method: 'POST',
      headers:headers,
      body:JSON.stringify(payload)
    });
    if (!neumResponse.ok) {
      throw new Error(`HTTP error! status: ${neumResponse.status} - Error: ${JSON.stringify(neumResponse)}`);
    }

    const responseData = await neumResponse.json();

    // Handle the response here
    console.log(responseData['results'])
    const prompt = [
      {
        role: 'system',
        content: `You are part of the campaign team for the presidential candidate ${candidateName}.
         You should answer questions about the candidates policies based on the context below and only the context below. 
         If the user asks for latest information, respond with what you have in the
         Context: ${responseData['results']}`,
      },
    ]
    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [...prompt, ...messages],
    });
  
    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);

  } catch (error) {
    // Handle errors here
    console.error(error);
    console.log("here")
    console.log(error)
  }
}
