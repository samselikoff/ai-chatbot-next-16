# Next.js 16 AI Chatbot

Option 1: MessageLog is fully a client component

```jsx
'use client';

function MessageLog({ messages }) {
  const { optimisticMessages } = useProvider();
  const allMessages = [...messages, ...optimisticMessages];

  return (
    <div>
      {allMessages.map((message) => (
        <Message message={message} key={message.id} />
      ))}
    </div>
  );
}
```

Option 2: Split between Server and Client Components

```jsx
function MessageLog({ messages }) {
  return (
    <div>
      {allMessages.map((message) => (
        <Message message={message} key={message.id} />
      ))}

      <OptimisticMessages />
    </div>
  );
}

('use client');

function OptimisticMessages() {
  const { optimisticMessages } = useProvider();

  return optimisticMessages.map((message) => (
    <Message message={message} key={message.id} />
  ));
}
```
