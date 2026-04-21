import { SignJWT, jwtVerify } from 'jose';

export type AdminSession = {
  username: string;
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
      return payload as AdminSession;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}
