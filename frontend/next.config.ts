import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'source.unsplash.com',
            },
        ],
    },
    serverExternalPackages: ['jspdf', 'fflate'],
    turbopack: {
        resolveAlias: {
            fflate: 'fflate/browser',
        },
    },
};




export default nextConfig;
