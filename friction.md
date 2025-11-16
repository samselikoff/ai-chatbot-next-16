# Friction points

## Using RSCs to recursively render async chunks leads to slow updates, due to Suspense throttling updates every 300ms. This makes it seem like the AI stream is slower than it really is.

```tsx
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
    return null;
  }

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
```

```tsx
async function getCompletion(chatId: string, content: string) {
  const assistantMessage: ClientMessage = {
    id: window.crypto.randomUUID(),
    content: '',
    role: 'assistant',
    position: 2,
  };
  setOptimisticResults((latest) => ({
    ...latest,
    [chatId]: [assistantMessage],
  }));
  const answerStream = await fetchAnswerStream(content);

  for await (const delta of readStreamableValue(answerStream)) {
    assistantMessage.content += delta;
    // await new Promise((resolve) => setTimeout(resolve, 100));
    setOptimisticResults((latest) => ({
      // setResults((latest) => ({
      ...latest,
      [chatId]: [assistantMessage],
    }));
  }

  await saveAssistantMessage(chatId, assistantMessage);
  redirect(`/chat/${chatId}`);
  // setResults((latest) => {
  //   delete latest[chatId];
  //   return latest;
  // });
}
/*
    Open AI SDK version. Blocks in dev.
  */
async function getCompletion(chatId: string, content: string) {
  const assistantMessage: ClientMessage = {
    id: window.crypto.randomUUID(),
    content: '',
    role: 'assistant',
    createdAt: undefined,
  };
  setOptimisticResults((latest) => ({
    ...latest,
    [chatId]: assistantMessage,
  }));
  const answerStream = await fetchAnswerStream(content);

  for await (const chunk of answerStream) {
    if (chunk.type === 'response.output_text.delta') {
      assistantMessage.content += chunk.delta;
      setResults((latest) => ({
        ...latest,
        [chatId]: assistantMessage,
      }));
    }
  }
}

/*
    Open AI HTTP version
  */
async function getCompletion(chatId: string, content: string) {
  const assistantMessage: ClientMessage = {
    id: window.crypto.randomUUID(),
    content: '',
    role: 'assistant',
    createdAt: undefined,
  };
  setOptimisticResults((latest) => ({
    ...latest,
    [chatId]: assistantMessage,
  }));
  const answerStream = await fetchAnswerStream(content);
  console.log(answerStream);

  if (answerStream instanceof Response) {
    return;
  }

  const reader = answerStream!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const iter = await reader.read();
    // console.l
    console.log(iter.done);
    if (iter.done) break;
    const chunk = decoder.decode(iter.value);
    console.log('---NEW CHUNK----');
    const data = chunk.split('\n')[1].replace('data: ', '');
    const json = JSON.parse(data);
    console.log(json);

    if (json.type === 'response.output_text.delta') {
      assistantMessage.content += json.delta;
      setResults((latest) => ({
        ...latest,
        [chatId]: assistantMessage,
      }));
    }
  }
}
```
