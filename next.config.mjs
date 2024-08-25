/** @type {import('next').NextConfig} */
const nextConfig = {
    redirects() { 
        return [
            {
                source: "/",
                destination: '/dashboard',
                permanent: false
            }
        ]
    }
};

export default nextConfig;
