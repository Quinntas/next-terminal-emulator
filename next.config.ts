import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    assetPrefix: '.',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
