import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  if (hostname.startsWith('afiliados.')) {
    if (!pathname.startsWith('/affiliate')) {
      return NextResponse.rewrite(
        new URL(`/affiliate${pathname === '/' ? '' : pathname}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
