/** @type {import('next').NextConfig} */

const usersPaths = ["", "/bots", "/bots/:id"];
const nextConfig = {
    async rewrites() {
        return [
            ...usersPaths.map((el) => ({
                source: "/@:username" + el,
                destination: "/users/:username" + el,
            })),
        ];
    },
};

export default nextConfig;
