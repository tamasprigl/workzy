'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAuthToken } from '@/lib/auth';
import Airtable from 'airtable';

function escapeAirtableString(value: string) {
  return value.replace(/'/g, "\\'");
}

function getBase() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error('Missing Airtable config');
  }

  return new Airtable({ apiKey: token }).base(baseId);
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get('username') ?? '')
    .trim()
    .toLowerCase();

  const password = String(formData.get('password') ?? '').trim();

  if (!email || !password) {
    redirect('/admin/login?error=missing');
  }

  const usersTable =
    process.env.AIRTABLE_USERS_TABLE_NAME || 'Users';

  const base = getBase();

  const safeEmail = escapeAirtableString(email);

  const records = await base(usersTable)
    .select({
      filterByFormula: `LOWER({email}) = '${safeEmail}'`,
      maxRecords: 1,
    })
    .firstPage();

  if (!records.length) {
    redirect('/admin/login?error=invalid');
  }

  const user = records[0];

  const storedPassword = String(user.fields.Password || '').trim();

  if (!storedPassword || storedPassword !== password) {
    redirect('/admin/login?error=invalid');
  }

  const role = String(user.fields.Role || 'employer').toLowerCase();

  const employerField = user.fields['Employer Record'];
  const employerId = Array.isArray(employerField)
    ? employerField[0]
    : null;

  const token = await createAuthToken({
    username: email,
    email,
    role: role as any,
    employerId,
  });

  const cookieStore = await cookies();

  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  redirect('/admin');
}