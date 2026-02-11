"use client"
import { useState, useEffect } from "react"
import { getOrders } from "@/services/orderService"
import { getExpenses } from "@/services/expenseServices"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2, TrendingUp, TrendingDown } from "lucide-react"

export default function ProfitLossReport() {
    const [orders, setOrders] = useState([])
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [ordersData, expensesData] = await Promise.all([
                getOrders(),
                getExpenses()
            ])
            setOrders(ordersData.orders || [])
            setExpenses(expensesData.expenses || [])
        } catch (error) {
            console.log(error)
            setOrders([])
            setExpenses([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading P&L Report...</p>
        </div>
    )

    // Calculate totals
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.expenseAmount, 0)
    const netProfit = totalRevenue - totalExpenses
    const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(2) : 0

    // Group by date for comparison
    const dateMap = {}

    // Add revenue by date
    orders.forEach(order => {
        const date = new Date(order.createdAt).toLocaleDateString('en-IN')
        if (!dateMap[date]) {
            dateMap[date] = { date, revenue: 0, expenses: 0 }
        }
        dateMap[date].revenue += order.total
    })

    // Add expenses by date
    expenses.forEach(exp => {
        const date = new Date(exp.expenseDate).toLocaleDateString('en-IN')
        if (!dateMap[date]) {
            dateMap[date] = { date, revenue: 0, expenses: 0 }
        }
        dateMap[date].expenses += exp.expenseAmount
    })

    // Calculate profit for each date
    const dailyPL = Object.values(dateMap)
        .map(item => ({
            ...item,
            profit: item.revenue - item.expenses
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Profit & Loss Report</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">₹ {totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">₹ {totalExpenses.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className={`border-l-4 ${netProfit >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit/Loss</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                                ₹ {Math.abs(netProfit).toLocaleString()}
                            </p>
                            {netProfit >= 0 ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Profit Margin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{profitMargin}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue vs Expenses - Line Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Revenue vs Expenses Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={dailyPL}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue (₹)" strokeWidth={2} />
                            <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses (₹)" strokeWidth={2} />
                            <Line type="monotone" dataKey="profit" stroke="#3b82f6" name="Profit (₹)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Daily Profit/Loss - Bar Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Profit/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyPL}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="profit" fill="#3b82f6" name="Profit/Loss (₹)" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}