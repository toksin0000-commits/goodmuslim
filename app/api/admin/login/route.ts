import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'tajne-heslo-pro-goodmuslim';

export async function POST(req: Request) {
  try {
    const { code1, code2 } = await req.json();
    const fullCode = `${code1}-${code2}`;

    // Zkontrolovat, jestli kód existuje v databázi
    const { data, error } = await supabaseAdmin
      .from('goodmuslim_admin_codes')
      .select('id')
      .eq('code', fullCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Neplatný kód' }, { status: 401 });
    }

    // Vytvořit JWT token
    const token = jwt.sign(
      { 
        code: fullCode,
        type: 'goodmuslim-admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Nastavit cookie s tokenem
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 dní
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Chyba serveru' }, { status: 500 });
  }
}

// ✅ Přidáme podporu pro OPTIONS (preflight requests)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}