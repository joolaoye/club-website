import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/',
  '/events(.*)',
  '/announcements(.*)',
  '/officers(.*)'
]);

// No public routes in the officers-hub app - everything requires authentication
const isPublicRoute = createRouteMatcher([]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // If user is not signed in and trying to access protected route
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // All authenticated users can access the officers-hub (invite-only system)

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};