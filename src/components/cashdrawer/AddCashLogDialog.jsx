"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createCashLog } from "@/services/cashDrawerService"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export default function AddCashLogDialog({ onCreated }) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        typeOfLog: "",
        amount: "",
        description: ""
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await createCashLog({
                ...form,
                amount: parseFloat(form.amount),
                logBy: user?.name || "Unknown"
            })
            toast.success("Cash log added")
            onCreated(data.log)
            setOpen(false)
            setForm({ typeOfLog: "", amount: "", description: "" })
        } catch (error) {
            toast.error(error.message || "Failed to add log")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus size={16} /> Add Cash Log
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Cash Log</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Type</Label>
                        <Select 
                            value={form.typeOfLog} 
                            onValueChange={(val) => setForm(prev => ({ ...prev, typeOfLog: val }))}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash-in">Cash In</SelectItem>
                                <SelectItem value="cash-out">Cash Out</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Amount</Label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Enter amount"
                            value={form.amount}
                            onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <Label>Description</Label>
                        <Input
                            placeholder="e.g., Opening balance, Withdrawal"
                            value={form.description}
                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Adding..." : "Add Log"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
