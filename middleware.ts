/**
 * Middleware para roteamento baseado em subdomínio
 * Redireciona admin.actionbee.com.br para /dashboard
 * Redireciona afiliados.actionbee.com.br para /affiliate
 */

import { NextRequest, NextResponse } from "next/server";

const ADMIN_SUBDOMAIN = "admin";
const AFFILIATE_SUBDOMAINS = ["afiliados", "affiliates"];

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const pathname = url.pathname;

  // Não processar arquivos de ícone - deixar o Next.js servir normalmente
  if (pathname === "/icon.png" || pathname === "/apple-icon.png" || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Extrair subdomínio
  const subdomain = hostname.split(".")[0];

  // Subdomínio de admin → reescrever para /dashboard
  if (subdomain === ADMIN_SUBDOMAIN && !pathname.startsWith("/dashboard")) {
    url.pathname = `/dashboard${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Subdomínio de afiliados → reescrever para /affiliate
  if (AFFILIATE_SUBDOMAINS.includes(subdomain) && !pathname.startsWith("/affiliate")) {
    url.pathname = `/affiliate${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|sitemap.xml|robots.txt).*)"],
};
