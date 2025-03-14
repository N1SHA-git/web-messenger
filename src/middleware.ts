import { NextRequest, NextResponse } from 'next/server';
import { sessionService } from '@/entities/user/services/session';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/profile', 'settigns'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 1 Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value;
  const session = await sessionService.decrypt(cookie);

  // 2 Redirect to /sign-in if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  // 3 Redirect to / if the user is authenticated
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}
