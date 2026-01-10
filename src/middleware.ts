import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('token')?.value;

  // Si on est sur une route protégée et qu'il n'y a pas de token
  if (request.nextUrl.pathname.startsWith('/dashboard') && !token) {
    const loginUrl = new URL('/login', request.url);
    // On peut ajouter ?redirect=/dashboard pour rediriger après login
    return NextResponse.redirect(loginUrl);
  }

  // Si on est déjà connecté et qu'on essaie d'aller sur login/register
  if ((request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configurer les routes sur lesquelles le middleware s'active
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
