import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.next();
  }

  let user;
  try {
    const decodedToken = jwtDecode<{ "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string }>(token);
    user = { role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] };
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/dashboard') && user.role !== 'SuperAdmin' && user.role !== 'Administrador') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/perfil') && user.role !== 'Cliente') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/area-de-trabajo') && user.role !== 'Abogado') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*', '/area-de-trabajo/:path*'],
};
