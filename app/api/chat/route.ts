// ./app/api/chat/route.ts
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse , experimental_StreamData} from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

function get_formatted_results(results:any){

  let formatted_results = ""

  results.forEach((element:any) => {
    formatted_results += element['text'] + ", "
  });

  return formatted_results

}
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
    // We should surface back the srouces. either separateley or in the openai response
    // Each piece of context will have a 'source', please include the full url of the source in your response like this: Sources: [<url of source>,<url of source>]. This is very important.
    // It is of utmost importance that you include the source that you used to come up with your answer. Failure to do so will disqualify you. Include the full url of the source in a bullet pointed list like: 
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
    console.log(responseData.results)


    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [...prompt, ...messages],
    });
  
    // Convert the response into a friendly text-stream
    const data = new experimental_StreamData();
    
    const stream = OpenAIStream(response, {experimental_streamData: true, 
      onFinal: async completion => {
        console.log('Stream completed, closing data', completion);
        data.close()
      },
    });
    let sources_used_flattened = responseData.results.map(({ source }:any) => source);
    let unique_sources = Array.from(new Set<any>(sources_used_flattened));
    data.append({
      sources:unique_sources
    });

    // Respond with the stream
    return new StreamingTextResponse(stream, {}, data)

  } catch (error) {
    // Handle errors here
    console.error(error);
    return new Response("Something went wrong, please try again or drop us a quick note in our discord or at founders@tryneum.com");
  }
}
