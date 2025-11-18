'use server';

export type DemoMessage = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  status: 'INIT' | 'DONE';
};
