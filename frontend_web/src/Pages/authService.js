export const getAuthenticatedUser = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/auth/user", {
            credentials: "include",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }
        return await response.json();
    } catch (error) {
        console.error("Authentication error:", error);
        return null;
    }
};
