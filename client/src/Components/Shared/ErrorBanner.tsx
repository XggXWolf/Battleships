import { useEffect, useState } from "react";

interface ErrorBannerProps {
    message?: string;
}

export default function ErrorBanner({ message }: ErrorBannerProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none transition-all duration-300 ease-out transform ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"}`}
        >
            <div className="w-full max-w-md bg-primary border border-[#f85149] px-4 py-3 rounded-md shadow-2xl flex items-start gap-3 pointer-events-auto">
                <svg className="w-5 h-5 text-[#f85149] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex flex-col gap-0.5">
                    <span className="font-semibold text-sm text-white">
                        Connection Error
                    </span>
                    <p className="text-sm text-[#8b949e]">
                        {message ||
                            "An unexpected error occurred. Please try again later."}
                    </p>
                </div>
            </div>
        </div>
    );
}
