"use client"
import { createExpense } from "@/services/expenseServices"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "../ui/dialog"
import { useState, useEffect } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

export default function CreateExpense({ onCreated }) {
    const {user} = useAuth();
    const [formData, setFormData] = useState({
        expenseDescription: "",
        expenseAmount: "",
        expenseBy: user.name
    });

    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false);

    const handleChange = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await createExpense(formData);
            toast.success("Expense created");
            onCreated(data.expense);
            setOpen(false);
            setFormData({
                expenseDescription: "",
                expenseAmount: "",
                expenseBy: user.name
            });
        } catch (error) {
            toast.error("Failed to create inventory");
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <p>Add Expense</p>
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new expense</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Expense Description</Label>
                            <Input value={formData.expenseDescription} onChange={(e) => handleChange("expenseDescription", e.target.value)} />
                        </div>

                        <div>
                            <Label>Expense Amount</Label>
                            <Input value={formData.expenseAmount} onChange={(e) => handleChange("expenseAmount", e.target.value)} />
                        </div>

                        <Button type="submit" disabled={loading} className={"w-full"}>
                            {loading ? "Creating": "Create"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}