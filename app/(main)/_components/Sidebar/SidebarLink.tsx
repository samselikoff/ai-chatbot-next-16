'use client';

import Link from 'next/link';
import { useSelectedLayoutSegments } from 'next/navigation';
import { ComponentProps } from 'react';

export function ChatLink({
  chatId,
  ...rest
}: ComponentProps<typeof Link> & { chatId: string }) {
  const [, id] = useSelectedLayoutSegments();
  const active = id === chatId;

  return <Link {...rest} data-active={active ? '' : undefined} />;
}
