import OpenAI from 'openai';

export async function GET() {
  // import { Streaming } from './Streaming';

  const client = new OpenAI();

  const response = await client.responses.create({
    model: 'gpt-4.1',
    input: 'tell me a short story',
    stream: true,
  });

  const s = response.toReadableStream();
  // return Response();

  // return <Streaming stream={response} />;
}
