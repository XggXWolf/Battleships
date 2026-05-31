import googleIcon from "../../../assets/google.svg";

export default function GoogleSignIn() {
    function handleGoogleSignIn() {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google/login`;
    }

    return (
        <button
            className="flex items-center justify-center gap-3 w-full py-3 bg-root text-gray-200 font-medium text-sm tracking-wide rounded-[10px] border border-color-border hover:border-[#8b949e] hover:bg-primary cursor-pointer transition-all shadow-sm"
            onClick={handleGoogleSignIn}
        >
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Sign in with Google</span>
        </button>
    );
}
