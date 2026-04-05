import { useEffect, useState } from "react";

interface LogoProps {
    rotate?: number; // rotation in degrees
}

export default function FormLogo({ rotate = 0 }: LogoProps) {
    const [currentRotate, setCurrentRotate] = useState(0);

    useEffect(() => {
        // trigger animation after mount
        setCurrentRotate(rotate);
    }, [rotate]);

    return (
        <div
            className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(37,99,235,0.15)] transition-transform duration-500"
            style={{ transform: `rotate(${currentRotate}deg)` }}
        >
            <svg
                className="w-7 h-7 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
            >
                <circle cx="12" cy="5" r="2"></circle>
                <line x1="12" y1="7" x2="12" y2="19"></line>
                <path d="M5 12H3a9 9 0 0 0 18 0h-2"></path>
                <line x1="5" y1="12" x2="12" y2="19"></line>
                <line x1="19" y1="12" x2="12" y2="19"></line>
            </svg>
        </div>
    );
}
