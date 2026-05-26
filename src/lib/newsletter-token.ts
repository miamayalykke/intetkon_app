import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-this')

export async function generateConfirmationToken(email: string): Promise<string> {
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)

  return token
}

export async function verifyConfirmationToken(token: string): Promise<string | null> {
  try {
    const verified = await jwtVerify(token, secret)
    return (verified.payload.email as string) || null
  } catch {
    return null
  }
}
