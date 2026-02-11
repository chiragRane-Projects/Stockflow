"use client"
import { useState, useEffect } from "react"
import { getOrders } from "@/services/orderService"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

export default function SalesReports() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const data = await getOrders()
            setOrders(data.orders || [])
        } catch (error) {
            console.log(error)
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Sales Reports...</p>
        </div>
    )

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Group sales by date for trend chart
    const salesByDate = orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString('en-IN')
        if (!acc[date]) {
            acc[date] = { date, revenue: 0, orders: 0 }
        }
        acc[date].revenue += order.total
        acc[date].orders += 1
        return acc
    }, {})
    const dailySales = Object.values(salesByDate).sort((a, b) => new Date(a.date) - new Date(b.date))

    // Payment method breakdown
    const paymentMethods = orders.reduce((acc, order) => {
        const method = order.modeOfPayment
        if (!acc[method]) {
            acc[method] = { name: method.toUpperCase(), value: 0 }
        }
        acc[method].value += order.total
        return acc
    }, {})
    const paymentData = Object.values(paymentMethods)

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Sales Reports</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹ {totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{orders.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Order Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹ {orders.length ? (totalRevenue / orders.length).toFixed(2) : 0}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Sales Trend - Line Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Sales Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue (₹)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Payment Methods & Orders Count */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Method Distribution - Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ₹${entry.value.toLocaleString()}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {paymentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Daily Order Count - Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Order Count</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailySales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}