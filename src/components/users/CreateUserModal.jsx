"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { createUser } from "@/services/userService"

export default function CreateUserModal({ onCreated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        username: "",
        password: "",
        role: "staff"
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const data = await createUser(form);
            toast.success("User created");

            onCreated(data.user);
            setOpen(false);

            setForm({
                name: "",
                username: "",
                password: "",
                role: "staff"
            })
        } catch (error) {
            toast.error("Create failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <p>Add User</p>
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
                        </div>

                        <div>
                            <Label>Username</Label>
                            <Input value={form.username} onChange={(e) => handleChange("username", e.target.value)} />
                        </div>

                        <div>
                            <Label>Password</Label>
                            <Input value={form.password} onChange={(e) => handleChange("password", e.target.value)} />
                        </div>

                        <div>
                            <Label>Role</Label>
                            <Input value={form.role} onChange={(e) => handleChange("role", e.target.value)} />
                        </div>

                        <Button disabled={loading} type="submit" className="w-full">
                            {loading ? "Creating..." : "Create"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}