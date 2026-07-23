/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com; connect-src 'self' https://*.supabase.co https://vitals.vercel-insights.com https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com; font-src 'self' data:" },
    ];
    if (process.env.NODE_ENV === 'production') securityHeaders.push({ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' });
    return [
      { source: '/(.*)', headers: securityHeaders },
      ...['/learn/:path*', '/assessments/:path*', '/preview/:path*', '/search', '/home/:path*', '/progress/:path*', '/review/:path*', '/settings/:path*', '/onboarding/:path*', '/api/member/:path*', '/sign-in'].map((source) => ({ source, headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }, { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] })),
    ];
  },
};

module.exports = nextConfig;
