import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// ✅ Změna: podporované jazyky (ar, en, ur)
const SUPPORTED_LANGS = ['ar', 'en', 'ur'];
const DEFAULT_LANG = 'en'; // nebo 'ar'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🛡️ OCHRANA ADMIN SEKCE - změna z /priest na /goodmuslim-admin
  if (pathname.startsWith('/goodmuslim-admin')) {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            response.cookies.set({ name, value: '', ...options });
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL('/goodmuslim-admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // ✅ Změna: kontrola v tabulce goodmuslim_admins místo priests
    const { data: admin } = await supabase
      .from('goodmuslim_admins')
      .select('id')
      .eq('user_id', session.user.id)
      .single();

    if (!admin) {
      await supabase.auth.signOut();
      const redirectUrl = new URL('/goodmuslim-admin/login', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  // 🌍 PŘESMĚROVÁNÍ PODLE JAZYKA (už s novými jazyky)
  const first = pathname.split('/')[1];
  if (SUPPORTED_LANGS.includes(first)) {
    return NextResponse.next();
  }

  if (pathname === '/') {
    const header = request.headers.get('accept-language') || '';
    const preferred = header.split(',')[0].split('-')[0];
    const lang = SUPPORTED_LANGS.includes(preferred) ? preferred : DEFAULT_LANG;
    return NextResponse.redirect(new URL(`/${lang}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};