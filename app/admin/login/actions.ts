'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAuthToken } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = await createAuthToken({ username });
    
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    redirect('/admin/jobs');
  } else {
    redirect('/admin/login?error=invalid');
  }
}
