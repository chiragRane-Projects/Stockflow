export async function getOrders() {
    const res = await fetch("/api/order");

    if (!res.ok) throw new Error("Failed to fetch stock details");

    return res.json();
}

export async function createOrder(payload) {
    const res = await fetch("/api/order", {
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

export async function updateOrder(id, payload) {
    const res = await fetch(`/api/order/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) throw new Error("Failed to update order");

    return res.json();
}

export async function deleteOrder(id) {
    const res = await fetch(`/api/order/${id}`, {
        method: "DELETE"
    });

    if (!res.ok) throw new Error("Failed to delete user");

    return res.json();
}