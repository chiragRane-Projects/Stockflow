"use client"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Trash2, Loader2, Package, AlertTriangle, TrendingUp } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useState, useEffect } from "react"
import { getStock, deleteInventory } from "@/services/stockService"
import { toast } from "sonner"
import CreateStockModal from "@/components/stock/CreateStockModal"
import UpdateStockModal from "@/components/stock/UpdateStockModal"

export default function Inventory() {
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    const isOwner = user?.role === "owner"

    useEffect(() => {
        fetchStock()
    }, [])

    const fetchStock = async () => {
        try {
            const data = await getStock()
            setInventory(data.inventory || [])
        } catch (error) {
            toast.error("Failed to fetch stocks")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return
        
        try {
            await deleteInventory(id)
            toast.success("Item deleted")
            setInventory(prev => prev.filter(i => i._id !== id))
        } catch (error) {
            console.error(error)
            toast.error("Delete failed")
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Inventory...</p>
        </div>
    )

    // Calculate KPIs
    const totalItems = inventory.length
    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.pricePerQuantity), 0)
    const lowStockCount = inventory.filter(item => item.quantity <= item.reorderThreshold).length
    const outOfStockCount = inventory.filter(item => item.quantity === 0).length

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold text-3xl">Inventory Management</h1>
                <CreateStockModal onCreated={(newStock) => setInventory(prev => [...prev, newStock])} />
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Package size={16} />
                            Total Items
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalItems}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Quantity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalQuantity}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp size={16} />
                            Stock Value
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Low Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-orange-600">{lowStockCount}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Out of Stock
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">{outOfStockCount}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Inventory Table */}
            <Card>
                <CardContent className="pt-6">
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Name</TableHead>
                                <TableHead className="text-center">Category</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-center">Price/Unit</TableHead>
                                <TableHead className="text-center">Total Value</TableHead>
                                <TableHead className="text-center">Reorder Level</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                {isOwner && <TableHead className="text-center">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {inventory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={isOwner ? 8 : 7} className="text-center py-8 text-muted-foreground">
                                        No inventory items found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                inventory.map((inv) => {
                                    const isOutOfStock = inv.quantity === 0
                                    const isLowStock = inv.quantity > 0 && inv.quantity <= inv.reorderThreshold
                                    
                                    return (
                                        <TableRow key={inv._id} className={isOutOfStock ? "bg-red-50" : isLowStock ? "bg-orange-50" : ""}>
                                            <TableCell className="capitalize text-center font-medium">{inv.name}</TableCell>
                                            <TableCell className="capitalize text-center">{inv.category}</TableCell>
                                            <TableCell className={`text-center font-semibold ${
                                                isOutOfStock ? "text-red-600" : isLowStock ? "text-orange-600" : ""
                                            }`}>
                                                {inv.quantity}
                                            </TableCell>
                                            <TableCell className="text-center">₹{inv.pricePerQuantity}</TableCell>
                                            <TableCell className="text-center font-semibold">₹{(inv.quantity * inv.pricePerQuantity).toLocaleString()}</TableCell>
                                            <TableCell className="text-center">{inv.reorderThreshold}</TableCell>
                                            <TableCell className="text-center">
                                                {isOutOfStock ? (
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700">
                                                        OUT OF STOCK
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700">
                                                        LOW STOCK
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700">
                                                        IN STOCK
                                                    </span>
                                                )}
                                            </TableCell>
                                            {isOwner && (
                                                <TableCell className="text-center">
                                                    <div className="flex gap-2 justify-center items-center">
                                                        <button 
                                                            onClick={() => handleDelete(inv._id)} 
                                                            className="cursor-pointer bg-transparent p-2 rounded-full border border-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 size={15} />
                                                        </button>
                                                        <UpdateStockModal 
                                                            stock={inv} 
                                                            onUpdated={(updated) =>
                                                                setInventory(prev =>
                                                                    prev.map(s => s._id === updated._id ? updated : s)
                                                                )
                                                            } 
                                                        />
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    )
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}