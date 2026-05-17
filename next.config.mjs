/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    trailingSlash: true,
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: "export",
};

export default nextConfig;