const API_BASE = "http://coffee-shop-be.eu-central-1.elasticbeanstalk.com";
export async function apiRequest(endpoint, options = {}) {
    // ✅ Normalize headers
    const customHeaders = new Headers(options.headers || {});
    customHeaders.set("Accept", "application/json");
    customHeaders.set("Content-Type", "application/json");
    // ✅ Add token if auth=true and token exists
    if (options.auth) {
        const token = localStorage.getItem("token");
        if (token)
            customHeaders.set("Authorization", `Bearer ${token}`);
    }
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: customHeaders
        });
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        // ✅ Parse JSON if available
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return (await res.json());
        }
        // Otherwise return text
        return (await res.text());
    }
    catch (err) {
        console.error("API request error:", err);
        throw err;
    }
}
//# sourceMappingURL=request.js.map