import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'tajne-heslo-pro-goodmuslim';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Ověříme token
    jwt.verify(token, JWT_SECRET);
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}