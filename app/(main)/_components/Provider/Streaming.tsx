import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { Suspense } from 'react';

export function Streaming({
  stream,
}: {
  stream: Stream<OpenAI.Responses.ResponseStreamEvent> & {
    _request_id?: string | null;
  };
}) {
  const iterator = stream[Symbol.asyncIterator]();

  return <Chunk iterator={iterator} />;
}

async function Chunk({
  iterator,
}: {
  iterator: AsyncIterator<OpenAI.Responses.ResponseStreamEvent>;
}) {
  const { value, done } = await iterator.next();

  if (done) {
    console.log('---DONE----');
    return null;
  }
  console.log('---CHUNK----');

  let chunk = '';
  if (value.type === 'response.output_text.delta') {
    chunk = value.delta;
  }

  return (
    <>
      <>{chunk}</>
      <Suspense>
        <Chunk iterator={iterator} />
      </Suspense>
    </>
  );
}
