"use client"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Trash2, Pencil } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getStock, deleteInventory } from "@/services/api/stockService"
import { toast } from "sonner"
import CreateStockModal from "@/components/stock/CreateStockModal"
import UpdateStockModal from "@/components/stock/UpdateStockModal"

export default function Inventory() {
    const [stocks, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isOwner = user.role === "owner";

    useEffect(() => {
        fetchStock()
    }, []);

    const fetchStock = async () => {
        try {
            const data = await getStock();
            setStock(data.stocks);
        } catch (error) {
            toast.error("Failed to fetch stocks")
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteInventory(id)
            toast.success("Delete inventory")

            setStock(prev => prev.filter(i => i._id !== id));
        } catch (error) {
            console.error(error)
            toast.error("Delete Failed")
        }
    }

    if (loading) return <p className="p-4">Loading...</p>;

    return (
        <>
            <div className="p-4 flex justify-between items-center">
                <h1 className="font-semibold text-3xl">
                    Inventory Management
                </h1>
                <CreateStockModal onCreated={(newStock) => setStock(prev => [...prev, newStock])} />
            </div>

            <Table className={"border"}>
                <TableHeader>
                    <TableRow>
                        <TableHead className={"text-center"}>Name</TableHead>
                        <TableHead className={"text-center"}>Category</TableHead>
                        <TableHead className={"text-center"}>Quantity</TableHead>
                        <TableHead className={"text-center"}>Price Per Quantity</TableHead>
                        <TableHead className={"text-center"}>Total Price</TableHead>
                        <TableHead className={"text-center"}>Reorder Threshold</TableHead>
                        {isOwner && (
                            <TableHead className={"text-center"}>Actions</TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {stocks.map((stock) => (
                        <TableRow key={stock._id}>
                            <TableCell className={"capitalize text-center"}>{stock.name}</TableCell>
                            <TableCell className={"capitalize text-center"}>{stock.category}</TableCell>
                            <TableCell className={"text-center"}>{stock.quantity}</TableCell>
                            <TableCell className={"text-center"}>{stock.pricePerQuantity}</TableCell>
                            <TableCell className={"text-center"}>{stock.totalPrice}</TableCell>
                            <TableCell className={"text-center"}>{stock.reorderThreshold}</TableCell>
                            {isOwner && (
                                <TableCell className={"flex flex-row gap-2 justify-center items-center"}>
                                    <button onClick={() => handleDelete(stock._id)} className="cursor-pointer bg-transparent p-2 rounded-full border border-red-600">
                                        <Trash2 size={15} />
                                    </button>

                                    <UpdateStockModal stock={stock} onUpdated={(updated) =>
                                        setStock(prev =>
                                            prev.map(s => s._id === updated._id ? updated : s)
                                        )
                                    } />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}