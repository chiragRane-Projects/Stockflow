"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogFooter, DialogHeader } from "../ui/dialog"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { updateInventory } from "@/services/stockService"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Pencil } from "lucide-react"

export default function UpdateStockModal({ stock, onUpdated }) {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        category: "",
        quantity: "",
        pricePerQuantity: "",
        reorderThreshold: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => setForm(stock), [stock])

    const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log(stock._id);
            const data = await updateInventory(stock._id, form);
            toast.success("Inventory updated");

            onUpdated(data.stock);
            setOpen(false);

            setForm({
                name: "",
                category: "",
                quantity: "",
                pricePerQuantity: "",
                reorderThreshold: ""
            })
        } catch (error) {
            console.error(error);
            toast.error("Failed to create inventory");
        } finally{
            setLoading(false)
        }

        
    };

    return(
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={"bg-transparent rounded-full border border-green-400 text-zinc-900 hover:bg-transparent cursor-pointer p-2"}>
                    <Pencil/>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Stock</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4"> 
                    <div>
                        <Label>Product Name</Label>
                        <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)}/>
                    </div>

                     <div>
                        <Label>Product Category</Label>
                        <Input value={form.category} onChange={(e) => handleChange("category", e.target.value)}/>
                    </div>

                     <div>
                        <Label>Product Quantity</Label>
                        <Input value={form.quantity} onChange={(e) => handleChange("quantity", e.target.value)}/>
                    </div>

                     <div>
                        <Label>Product Price</Label>
                        <Input value={form.pricePerQuantity} onChange={(e) => handleChange("pricePerQuantity", e.target.value)}/>
                    </div>

                     <div>
                        <Label>Product Threshold</Label>
                        <Input value={form.reorderThreshold} onChange={(e) => handleChange("reorderThreshold", e.target.value)}/>
                    </div>
                    
                    <Button disabled={loading} type="submit" className={"w-full"}>
                        {loading ? "Updating" : "Update"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}