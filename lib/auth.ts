import { SignJWT, jwtVerify } from 'jose';
import Airtable from 'airtable';

export type AdminSession = {
  username: string;
  email?: string;
  [key: string]: any;
};

const secretKey = process.env.AUTH_SECRET;

if (!secretKey) {
  throw new Error('AUTH_SECRET environment variable is not set');
}

const key = new TextEncoder().encode(secretKey);

export async function createAuthToken(payload: AdminSession) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifyAuthToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    
    if (payload && typeof payload.username === 'string') {
      const session = payload as AdminSession;
      if (!session.email) {
        session.email = session.username;
      }
      return session;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

function escapeAirtableString(value: string) {
  return value.replace(/'/g, "\\'");
}

export async function getCurrentUser(email: string) {
  if (!process.env.AIRTABLE_USERS_TABLE_NAME) {
    console.error("Missing AIRTABLE_USERS_TABLE_NAME env var");
    return null;
  }

  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  const safeEmail = escapeAirtableString(email.toLowerCase().trim());

  const records = await base(process.env.AIRTABLE_USERS_TABLE_NAME)
    .select({
      filterByFormula: `LOWER({email}) = '${safeEmail}'`,
      maxRecords: 1,
    })
    .firstPage();

  if (!records.length) {
    console.log("No Airtable user found for email:", email);
    return null;
  }

  const record = records[0];

  return {
    id: record.id,
    email: record.fields.email as string,
    role: record.fields.Role as string,
    employerId: Array.isArray(record.fields["Employer Record"])
      ? record.fields["Employer Record"][0]
      : null,
  };
}

export async function getEmployerAccess(employerId: string) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN })
    .base(process.env.AIRTABLE_BASE_ID!);

  const employer = await base(process.env.AIRTABLE_EMPLOYERS_TABLE_NAME!)
    .find(employerId);

  return {
    id: employer.id,
    plan: (employer.fields.Plan as string) || "Free",
    applicantLimit: Number(employer.fields["Applicant Limit"] || 5),
    accessStatus: (employer.fields["Access Status"] as string) || "Active",
  };
}
