import { cookies } from 'next/headers';

export async function getCurrentUser() {
  await cookies();
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    id: 'c332348b-30f9-4747-981f-22721233eeef',
    displayName: 'Sam Selikoff',
    async signOut() {
      console.log('signing out...');
    },
  };
}
