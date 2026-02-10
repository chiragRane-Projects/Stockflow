export async function getStock() {
    const res = await fetch("/api/inventory");

    if (!res.ok) throw new Error("Failed to fetch stocks");

    return res.json();
}

export async function createInventory(payload) {
    const res = await fetch("/api/inventory", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        throw new Error("Failed to create inventory");
    }

    return res.json();
}

export async function updateInventory(id, payload) {
    const res = await fetch(`/api/inventory/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
        throw new Error("Failed to create inventory");
    }

    return res.json();
}

export async function deleteInventory(id) {
    const res = await fetch(`/api/inventory/${id}`, {
        method: "DELETE"
    });

    if(!res.ok) throw new Error("Failed to delete inventory");

    return res.json();
}