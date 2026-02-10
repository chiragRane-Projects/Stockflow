"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { createOrder } from "@/services/orderService"
import { getStock } from "@/services/stockService"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "../ui/alert"
import { AlertCircle } from "lucide-react"

export default function CreateOrdersModal({ onCreated }) {
    const [open, setOpen] = useState(false);
    const [stocks, setStocks] = useState([]);
    const [items, setItems] = useState([{ productId: "", quantity: "" }]);
    const [form, setForm] = useState({
        customerName: "NA",
        modeOfPayment: "",
        paymentStatus: ""
    });
    const [loading, setLoading] = useState(false);
    const [lowStockAlerts, setLowStockAlerts] = useState([]);

    useEffect(() => {
        if (open) fetchStocks();
    }, [open]);

    const fetchStocks = async () => {
        try {
            const data = await getStock();
            setStocks(data.stocks);
            checkLowStock(data.stocks);
        } catch (error) {
            toast.error("Failed to fetch stocks");
        }
    };

    const checkLowStock = (stockList) => {
        const alerts = stockList.filter(s => s.quantity === 0 || s.quantity <= s.reorderThreshold)
            .map(s => ({ name: s.name, quantity: s.quantity, status: s.quantity === 0 ? "out" : "low" }));
        setLowStockAlerts(alerts);
    };

    const addItem = () => setItems([...items, { productId: "", quantity: "" }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = await createOrder({ ...form, items });
            toast.success("Order created");
            onCreated(data.order);
            setOpen(false);
            setItems([{ productId: "", quantity: "" }]);
            setForm({ customerName: "NA", modeOfPayment: "", paymentStatus: "" });
        } catch (error) {
            console.error("Order creation error:", error);
            toast.error(error.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Order</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Order</DialogTitle>
                </DialogHeader>
                
                {lowStockAlerts.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {lowStockAlerts.map(alert => (
                                <div key={alert.name}>
                                    {alert.status === "out" ? `${alert.name} is OUT OF STOCK` : `${alert.name} is LOW STOCK (${alert.quantity} left)`}
                                </div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Customer Name</Label>
                        <Input value={form.customerName} onChange={(e) => setForm(prev => ({ ...prev, customerName: e.target.value }))} />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <Label>Items</Label>
                            <Button type="button" size="sm" onClick={addItem}>
                                <Plus size={16} /> Add Item
                            </Button>
                        </div>

                        {items.map((item, index) => (
                            <div key={index} className="flex gap-2 items-end">
                                <div className="flex-1">
                                    <Select value={item.productId} onValueChange={(val) => updateItem(index, "productId", val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select product" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {stocks.map(stock => (
                                                <SelectItem key={stock._id} value={stock._id} disabled={stock.quantity === 0}>
                                                    {stock.name} {stock.quantity === 0 ? "(Out of Stock)" : ""}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-24">
                                    <Input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(index, "quantity", e.target.value)} required />
                                </div>
                                {items.length > 1 && (
                                    <Button type="button" size="icon" variant="destructive" onClick={() => removeItem(index)}>
                                        <Trash2 size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div>
                        <Label>Payment Mode</Label>
                        <Select value={form.modeOfPayment} onValueChange={(val) => setForm(prev => ({ ...prev, modeOfPayment: val }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select mode" />
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
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <Button disabled={loading} type="submit" className="w-full">
                        {loading ? "Creating..." : "Create Order"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
