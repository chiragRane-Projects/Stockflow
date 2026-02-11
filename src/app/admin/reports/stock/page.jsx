"use client"
import { useState, useEffect } from "react"
import { getStock } from "@/services/stockService"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, AlertTriangle } from "lucide-react"

export default function StockReports() {
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchInventory()
    }, [])

    const fetchInventory = async () => {
        try {
            const data = await getStock()
            setInventory(data.inventory || [])
        } catch (error) {
            console.log(error)
            setInventory([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Stock Reports...</p>
        </div>
    )

    // Calculate total stock value
    const totalStockValue = inventory.reduce((sum, item) => sum + (item.quantity * item.pricePerQuantity), 0)
    const totalItems = inventory.length
    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0)

    // Low stock items (below reorder threshold)
    const lowStockItems = inventory.filter(item => item.quantity <= item.reorderThreshold)

    // Stock by category
    const stockByCategory = inventory.reduce((acc, item) => {
        const category = item.category
        if (!acc[category]) {
            acc[category] = { name: category, value: 0, quantity: 0 }
        }
        acc[category].value += item.quantity * item.pricePerQuantity
        acc[category].quantity += item.quantity
        return acc
    }, {})
    const categoryData = Object.values(stockByCategory)

    // Top 10 items by value
    const topItemsByValue = inventory
        .map(item => ({
            name: item.name,
            value: item.quantity * item.pricePerQuantity,
            quantity: item.quantity
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Stock Reports</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹ {totalStockValue.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalItems}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalQuantity}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <p className="text-3xl font-bold text-red-600">{lowStockItems.length}</p>
                            {lowStockItems.length > 0 && <AlertTriangle className="text-red-500" />}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Low Stock Alert Table */}
            {lowStockItems.length > 0 && (
                <Card className="border-l-4 border-red-500">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="text-red-500" />
                            Low Stock Items - Reorder Required
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Item Name</th>
                                        <th className="text-left p-2">Category</th>
                                        <th className="text-right p-2">Current Stock</th>
                                        <th className="text-right p-2">Reorder Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockItems.map(item => (
                                        <tr key={item._id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 capitalize">{item.name}</td>
                                            <td className="p-2 capitalize">{item.category}</td>
                                            <td className="text-right p-2 font-semibold text-red-600">{item.quantity}</td>
                                            <td className="text-right p-2">{item.reorderThreshold}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Stock Value by Category - Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Stock Value by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Quantity by Category - Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quantity by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="quantity" fill="#8884d8" name="Quantity" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Items by Value */}
            <Card>
                <CardHeader>
                    <CardTitle>Top 10 Items by Stock Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={topItemsByValue} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#82ca9d" name="Value (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}