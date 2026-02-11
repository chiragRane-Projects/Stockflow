"use client"
import { useState, useEffect } from "react"
import { getOrders } from "@/services/orderService"
import { getExpenses } from "@/services/expenseServices"
import { getStock } from "@/services/stockService"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp, AlertTriangle, Package, Wallet } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function Dashboard() {
    const [orders, setOrders] = useState([])
    const [expenses, setExpenses] = useState([])
    const [inventory, setInventory] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            const [ordersData, expensesData, stockData] = await Promise.all([
                getOrders(),
                getExpenses(),
                getStock()
            ])
            setOrders(ordersData.orders || [])
            setExpenses(expensesData.expenses || [])
            setInventory(stockData.inventory || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Dashboard...</p>
        </div>
    )

    // Today's calculations
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
    })

    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0)
    const todayExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.expenseDate)
        expDate.setHours(0, 0, 0, 0)
        return expDate.getTime() === today.getTime()
    }).reduce((sum, exp) => sum + exp.expenseAmount, 0)

    const todayProfit = todaySales - todayExpenses

    // This month calculations
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const monthOrders = orders.filter(order => new Date(order.createdAt) >= startOfMonth)
    const monthSales = monthOrders.reduce((sum, order) => sum + order.total, 0)

    // Stock alerts
    const lowStockItems = inventory.filter(item => item.quantity <= item.reorderThreshold)
    const outOfStock = inventory.filter(item => item.quantity === 0)

    // Total stock value
    const totalStockValue = inventory.reduce((sum, item) => sum + (item.quantity * item.pricePerQuantity), 0)

    // Last 7 days sales for chart
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        date.setHours(0, 0, 0, 0)
        
        const dayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt)
            orderDate.setHours(0, 0, 0, 0)
            return orderDate.getTime() === date.getTime()
        })
        
        last7Days.push({
            day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
            sales: dayOrders.reduce((sum, order) => sum + order.total, 0)
        })
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <p className="text-muted-foreground">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
            </div>

            {/* Today's Business */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Today's Business</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-green-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <Wallet size={16} />
                                Today's Sales
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-green-600">₹ {todaySales.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">{todayOrders.length} orders</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-red-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Today's Expenses
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-red-600">₹ {todayExpenses.toLocaleString()}</p>
                        </CardContent>
                    </Card>

                    <Card className={`border-l-4 ${todayProfit >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <TrendingUp size={16} />
                                Today's Profit
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-3xl font-bold ${todayProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                ₹ {Math.abs(todayProfit).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* This Month & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-lg font-semibold mb-3">This Month</h2>
                    <div className="space-y-4">
                        <Card className="border-l-4 border-purple-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Monthly Sales
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">₹ {monthSales.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">{monthOrders.length} orders</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-indigo-500">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                    <Package size={16} />
                                    Stock Value
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">₹ {totalStockValue.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground mt-1">{inventory.length} items</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Stock Alerts */}
                <div>
                    <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <AlertTriangle size={20} className="text-orange-500" />
                        Stock Alerts
                    </h2>
                    <Card className="border-l-4 border-orange-500">
                        <CardContent className="pt-6">
                            {lowStockItems.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4">All items are well stocked! 👍</p>
                            ) : (
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {outOfStock.length > 0 && (
                                        <div className="mb-3">
                                            <p className="text-sm font-semibold text-red-600 mb-2">Out of Stock:</p>
                                            {outOfStock.map(item => (
                                                <div key={item._id} className="flex justify-between items-center py-1 px-2 bg-red-50 rounded mb-1">
                                                    <span className="text-sm capitalize">{item.name}</span>
                                                    <span className="text-xs font-semibold text-red-600">0 left</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {lowStockItems.filter(item => item.quantity > 0).length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-orange-600 mb-2">Low Stock:</p>
                                            {lowStockItems.filter(item => item.quantity > 0).map(item => (
                                                <div key={item._id} className="flex justify-between items-center py-1 px-2 bg-orange-50 rounded mb-1">
                                                    <span className="text-sm capitalize">{item.name}</span>
                                                    <span className="text-xs font-semibold text-orange-600">{item.quantity} left</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Last 7 Days Sales Chart */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Last 7 Days Sales</h2>
                <Card>
                    <CardContent className="pt-6">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={last7Days}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Bar dataKey="sales" fill="#10b981" name="Sales" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}