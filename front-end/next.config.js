/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false
}

const redirects = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/signin",
                permanent: false
            }
        ];
    }
}

const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([nextConfig, [redirects]])
