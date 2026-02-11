export async function getCashDrawer() {
    const res = await fetch("/api/cashdrawer");

    if (!res.ok) {
        if (res.status === 404) return { cashdrawer: [] };
        throw new Error("Failed to fetch cash drawer logs");
    }

    return res.json();
}

export async function createCashLog(payload) {
    const res = await fetch("/api/cashdrawer", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create log");
    }

    return res.json();
}
