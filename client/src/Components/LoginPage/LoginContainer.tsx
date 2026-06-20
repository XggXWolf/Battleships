import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import ErrorMessage from "../Shared/ErrorMessage";
import FormLogo from "../Shared/Form/FormLogo";
import "../Shared/Form/Form.css";
import GoogleSignIn from "../Shared/Form/GoogleSignIn";
import { useUserStore } from "../../stores/useUserStore";

interface LoginFormData {
    email: string; // or email
    password: string;
    rememberMe?: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function LoginContainer() {
    const { setUser } = useUserStore();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();

    // Handle form submission
    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setError("");

        console.log("Submitting login form with data:", data);

        try {
            const res = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const body = await res.json();

            if (!res.ok) {
                // body.message is an array when it comes from class-validator, but it can also be a string for other types of errors. Handle both cases.
                const message = Array.isArray(body.message)
                    ? body.message[0]
                    : body.message;
                setError(message || "Registration failed. Please try again.");
                return;
            }

            localStorage.setItem("user", JSON.stringify(body.user));
            setUser(body.user);
            window.location.href = "/";
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred while logging in.");
        } finally {
            setLoading(false);
        }
    };

    // Determine which error message to display (validation vs API error)
    const getDisplayError = () => {
        // 1. Check for API error first
        if (error !== "") return error;

        // 2. If no API error, check for validation errors and return the first one
        const firstValidationError = Object.values(errors)[0]?.message;
        if (firstValidationError) return firstValidationError.toString();

        return null;
    };

    const displayMessage = getDisplayError();

    return (
        <div className="card-in bg-primary border border-color-border rounded-2xl p-8 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(37,99,235,0.06)]">
            {/* Logo & Heading */}
            <div className="text-center mb-8">
                <FormLogo rotate={0} />

                <h1 className="text-2xl font-black tracking-tight text-white mb-1">
                    Sign In
                </h1>
                <p className="text-sm text-gray-500">
                    Welcome back — enter your details below
                </p>
            </div>

            {/* Error Message */}
            {displayMessage && (
                <ErrorMessage
                    message={
                        typeof displayMessage === "string"
                            ? displayMessage
                            : "An error occurred. Please check your input."
                    }
                />
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Email
                    </label>
                    <div className="field-wrap relative">
                        <input
                            className="field-input w-full bg-root border border-color-border rounded-[10px] py-3 pl-11 pr-4 text-sm text-[#e6edf3] placeholder-[#484f58] transition-colors"
                            id="email"
                            type="text"
                            placeholder="Enter your email"
                            autoComplete="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />
                        <span className="field-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-[#484f58] pointer-events-none transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <rect
                                    x="2"
                                    y="4"
                                    width="20"
                                    height="16"
                                    rx="2"
                                />
                                <polyline points="2,4 12,13 22,4" fill="none" />
                            </svg>
                        </span>
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">
                            Password
                        </label>
                        <Link
                            to="/reset-password"
                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="field-wrap relative">
                        <input
                            className="field-input w-full bg-root border border-color-border rounded-[10px] py-3 pl-11 pr-11 text-sm text-[#e6edf3] placeholder-[#484f58] transition-colors"
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••••••"
                            autoComplete="current-password"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />
                        <span className="field-icon absolute left-3.5 top-1/2 -translate-y-1/2 text-[#484f58] pointer-events-none transition-colors">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                            >
                                <rect
                                    x="3"
                                    y="11"
                                    width="18"
                                    height="11"
                                    rx="2"
                                    ry="2"
                                ></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                        </span>
                        <button
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-gray-400 transition-colors cursor-pointer bg-transparent border-0 p-0"
                            id="eye-btn"
                            tabIndex={-1}
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? (
                                <svg
                                    id="eye-open"
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                            ) : (
                                <svg
                                    id="eye-closed"
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                    <line x1="1" y1="1" x2="23" y2="23"></line>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className="flex items-center pt-1">
                    <label className="custom-check flex items-center gap-2.5 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            id="remember"
                            {...register("rememberMe")}
                        />
                        <div className="check-box w-4 h-4 bg-root border border-color-border rounded flex items-center justify-center shrink-0 transition-colors">
                            <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth="3"
                            >
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <span className="text-sm text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                {/* Submit Button */}

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-shimmer relative overflow-hidden w-full py-3 bg-blue-600 hover:bg-blue-700 hover:-translate-y-px active:translate-y-0 text-white font-bold text-sm tracking-widest uppercase rounded-[10px] border-0 cursor-pointer transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>

                {/* Remember Me Checkbox */}
            </form>

            {/* Divider */}
            <div className="divider flex items-center gap-3 my-6 text-[#484f58] text-xs font-semibold tracking-widest uppercase">
                or
            </div>

            {/* Google Sign-In Button */}
            <GoogleSignIn />
            {/* Sign-Up Link */}
            <p className="text-center text-xs text-gray-500 mt-6">
                Don't have an account?
                <Link
                    to="/register"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition ml-1"
                >
                    Sign Up →
                </Link>
            </p>
        </div>
    );
}
