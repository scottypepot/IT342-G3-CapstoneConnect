export const getAuthenticatedUser = async () => {
    try {
        console.log("🚀 Fetching authenticated user...");
        const response = await fetch("http://localhost:8080/api/auth/user", {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        console.log("✅ Authentication response received:", data);

        // 🚀 Redirect user AFTER authentication completes
        setTimeout(() => {
            if (data.firstTimeUser) {
                console.log("🚀 First-time user detected! Redirecting to /home...");
                window.location.href = "http://localhost:5173/home";
            } else {
                console.log("✅ Existing user detected! Redirecting to /home...");
                window.location.href = "http://localhost:5173/home";
            }
        }, 500); // Small delay ensures transaction completion before redirect

        return data;
    } catch (error) {
        console.error("❌ Authentication error:", error);
        return null;
    }
};
