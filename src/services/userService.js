export async function getUsers(){
    const res = await fetch("/api/auth");

    if(!res.ok) throw new Error("Failed to fetch users");

    return res.json();
}

export async function createUser(payload){
    const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {"Content-Type": "application/json"},
    });

    if(!res.ok) throw new Error("Failed to create user");

    return res.json();
}

export async function deleteUser(id) {
    const res = await fetch(`/api/auth/${id}`, {
        method: "DELETE"
    });

    if(!res.ok) throw new Error("Failed to delete user");

    return res.json();
}