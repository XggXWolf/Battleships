export function isTokenExpired(): boolean {
    const token = localStorage.getItem("access_token");
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        const now = Math.floor(Date.now() / 1000);
        return exp < now;
    } catch (e) {
        return true; // Treat invalid tokens as expired
    }
}
