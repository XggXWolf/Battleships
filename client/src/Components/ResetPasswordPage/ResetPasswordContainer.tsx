import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import ErrorMessage from "../Shared/ErrorMessage";
import FormLogo from "../Shared/Form/FormLogo";
import "../Shared/Form/Form.css";

interface ResetPasswordFormData {
    email: string;
}

export default function ResetPasswordContainer() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Initialize react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>();

    // Handle form submission
    const onSubmit = async (data: ResetPasswordFormData) => {
        setLoading(true);
        setError("");

        try {
            // Api not implemented yet
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            if (!res.ok) {
                const body = await res.json();
                setError(
                    body.message ||
                        "Failed to reset password. Please try again.",
                );
            }
        } catch (err) {
            setError("An error occurred while resetting the password.");
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
        <div className="card-in bg-primary border border-color-border rounded-2xl p-8 shadow-[0_0_0_1px_rgba(37,99,235,0.08),0_32px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(37,99,235,0.06)] ">
            {/* Logo & Heading */}
            <div className="text-center mb-8">
                <FormLogo rotate={90} />

                <h1 className="text-2xl font-black tracking-tight text-white mb-1">
                    Reset Password
                </h1>
                <p className="text-sm text-gray-500">
                    Enter your email address and we'll send you a link to reset
                    your password.
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

            {/* Reset Password Form */}
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
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message:
                                        "Please enter a valid email address",
                                },
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

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-shimmer relative overflow-hidden w-full py-3 bg-blue-600 hover:bg-blue-700 hover:-translate-y-px active:translate-y-0 text-white font-bold text-sm tracking-widest uppercase rounded-[10px] border-0 cursor-pointer transition-all shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
                    >
                        {loading ? "Sending..." : "Reset Password"}
                    </button>
                </div>
            </form>

            {/* Sign-In Link */}
            <p className="text-center text-xs text-gray-500 mt-6">
                Have an account?
                <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300 font-semibold transition ml-1"
                >
                    Log in →
                </Link>
            </p>
        </div>
    );
}
