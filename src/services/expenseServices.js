export async function getExpenses() {
    const res = await fetch("/api/expenses");

    if (!res.ok) throw new Error("Failed to fetch stock details");

    return res.json();
}

export async function createExpense(payload) {
    const res = await fetch("/api/expenses", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
    }

    return res.json();
}

export async function updateExpenses(id, payload) {
    const res = await fetch(`/api/expense/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to update order");

    return res.json();
}

export async function deleteExpense(id) {
    const res = await fetch(`/api/expenses/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete user");

    return res.json();
}