/** @type {import('next').NextConfig} */
const nextConfig = {
  // legal-content is read from disk by the API route, so make sure it ships with the server build
  outputFileTracingIncludes: {
    "/api/ask": ["./legal-content/**/*"],
  },
};

export default nextConfig;
