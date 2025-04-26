export const getAuthenticatedUser = async () => {
    try {
        const response = await fetch("http://localhost:8080/api/auth/user", {
            credentials: "include", // Include cookies for session-based authentication
        });

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        const data = await response.json();
        console.log("✅ Backend response:", data);

        // Store user data in sessionStorage
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userId", data.id); // Store the user ID
        sessionStorage.setItem("user", JSON.stringify(data));

        console.log("✅ User ID stored in sessionStorage:", data.id);
        return data;
    } catch (error) {
        console.error("❌ Authentication error:", error);
        sessionStorage.removeItem("isAuthenticated");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("user");
        return null;
    }
};
