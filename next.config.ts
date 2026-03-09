/** @type {import('next').NextConfig} */
const nextConfig = {
  // Povolení vývojových originů pro ngrok
  allowedDevOrigins: [
    'judy-noncontributory-waywardly.ngrok-free.dev',
    'localhost',
    '127.0.0.1'
  ],
};

export default nextConfig;
