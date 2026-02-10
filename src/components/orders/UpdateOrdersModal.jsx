"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "../ui/dialog"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { updateOrder } from "@/services/orderService"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"

export default function UpdateOrdersModal({ order, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        modeOfPayment: order.modeOfPayment,
        paymentStatus: order.paymentStatus
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await updateOrder(order._id, form);
            toast.success("Order updated");
            onUpdated(data.updatedOrder);
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="cursor-pointer bg-transparent p-2 rounded-full border border-blue-600">
                    <Pencil size={15} />
                </button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Order</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Payment Mode</Label>
                        <Select value={form.modeOfPayment} onValueChange={(val) => setForm(prev => ({ ...prev, modeOfPayment: val }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>Payment Status</Label>
                        <Select value={form.paymentStatus} onValueChange={(val) => setForm(prev => ({ ...prev, paymentStatus: val }))}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button disabled={loading} type="submit" className="w-full">
                        {loading ? "Updating..." : "Update Order"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
