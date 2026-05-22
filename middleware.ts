import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, excluding api, _next, etc.
  matcher: ['/', '/(en|es|pt|de|fr|ua|pl|ja|ar|tr|hi|it|ko|id)/:path*']
};
