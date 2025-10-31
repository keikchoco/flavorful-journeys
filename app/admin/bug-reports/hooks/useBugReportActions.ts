import { useAuthContext } from "@/contexts/AuthContext";

export function useBugReportActions() {
    const { user } = useAuthContext();

    const closeReport = async (reportId: string): Promise<{ success: boolean; error?: string }> => {
        if (!user) return { success: false, error: "No user authenticated" };

        try {
            const idToken = await user.getIdToken();
            const response = await fetch("/api/admin/bug-reports/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    idToken,
                    reportId,
                    status: "Closed",
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) return { success: true };
            return { success: false, error: data.error };
        } catch (err: any) {
            console.error("Error closing bug report:", err);
            return { success: false, error: err.message };
        }
    };

    return { closeReport };
}
