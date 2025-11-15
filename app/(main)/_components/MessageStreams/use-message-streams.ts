import { use } from 'react';
import { Context } from '.';

export function useMessageStreams() {
  return use(Context);
}
