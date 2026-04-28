'use server';

import Airtable from 'airtable';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAuthToken } from '@/lib/auth';

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error('Missing Airtable config');
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

export async function saveAccountOnboarding(formData: FormData) {
  const name = String(formData.get('name') || '').trim();
  const password = String(formData.get('password') || '').trim();
  const jobId = String(formData.get('jobId') || '').trim();

  if (!name || password.length < 6) {
    redirect(`/admin/onboarding/account${jobId ? `?jobId=${jobId}` : ''}`);
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;

  if (!sessionCookie) {
    redirect('/admin/login');
  }

  const session = await verifyAuthToken(sessionCookie);

  if (!session?.email) {
    redirect('/admin/login');
  }

  const usersTable = process.env.AIRTABLE_USERS_TABLE_NAME || 'Users';
  const base = getBase();

  const userId = session.userId || session.id || session.recordId;

  if (!userId) {
    redirect('/admin/login');
  }

  await base(usersTable).update(userId, {
    Name: name,
    Password: password,
    'Onboarding Complete': true,
  });

  if (jobId) {
    redirect(`/admin/jobs/${jobId}/edit`);
  }

  redirect('/admin/jobs');
}