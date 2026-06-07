import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Batik Gumelem">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="256" y2="256" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B2F2A" />
                    <stop offset="1" stopColor="#2B1E1A" />
                </linearGradient>
                <linearGradient id="accent" x1="30" y1="40" x2="220" y2="220" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4B5BD7" />
                    <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
                <pattern id="batik" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path
                        d="M14 2C8 2 6 6 6 10c0 5 6 6 8 10s-2 7-6 7"
                        stroke="rgba(255,255,255,0.13)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        transform="scale(0.2)"
                    />
                    <path
                        d="M14 26c6 0 8-4 8-8 0-5-6-6-8-10s2-7 6-7"
                        stroke="rgba(255,255,255,0.09)"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                        transform="scale(0.2)"
                    />
                    <circle cx="14" cy="14" r="2.2" fill="rgba(255,255,255,0.10)" transform="scale(0.2)" />
                </pattern>
            </defs>

            <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#bg)" />
            <rect x="16" y="16" width="224" height="224" rx="56" fill="url(#batik)" />
            <path d="M64 170c22-54 74-84 128-78" stroke="url(#accent)" strokeWidth="14" strokeLinecap="round" />
            <path d="M64 124c22-54 74-84 128-78" stroke="rgba(255,255,255,0.18)" strokeWidth="10" strokeLinecap="round" />
            <circle cx="84" cy="184" r="10" fill="rgba(255,255,255,0.25)" />
        </svg>
    );
}
