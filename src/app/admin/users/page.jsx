"use client"
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getUsers, deleteUser } from "@/services/userService";
import { Trash } from "lucide-react";
import CreateUserModal from "@/components/users/CreateUserModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;

        if (user.role !== "owner") {
            router.replace("/admin/auth/login");
        }
    }, [user, router]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data.users);
        } catch (error) {
            toast.error("Unable to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);

            toast.success("User deleted");

            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (error) {
            console.error(error)
            toast.error("Delete Failed")
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <>
            <div className="p-4 flex justify-between items-center">
                <h1 className="font-semibold text-3xl">Users Management</h1>
                <CreateUserModal onCreated={(newUser) => setUsers(prev => [...prev, newUser])} />
            </div>

            <Table className={"border"}>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user._id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell className={"capitalize"}>{user.role}</TableCell>
                            <TableCell>
                                <button onClick={() => handleDelete(user._id)} className="cursor-pointer bg-transparent p-2 rounded-full border border-red-600">
                                    <Trash size={15} />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}