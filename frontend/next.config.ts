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
        root: require('path').resolve(__dirname, '..'),
        resolveAlias: {
            fflate: 'fflate/browser',
        },
    },
};




export default nextConfig;
