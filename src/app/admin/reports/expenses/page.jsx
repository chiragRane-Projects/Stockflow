"use client"
import { useState, useEffect } from "react"
import { getExpenses } from "@/services/expenseServices"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"

export default function ExpenseReports() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses()
            setExpenses(data.expenses || [])
        } catch (error) {
            console.log(error)
            setExpenses([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Expense Reports...</p>
        </div>
    )

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.expenseAmount, 0)

    // Group expenses by date
    const expensesByDate = expenses.reduce((acc, exp) => {
        const date = new Date(exp.expenseDate).toLocaleDateString('en-IN')
        if (!acc[date]) {
            acc[date] = { date, amount: 0, count: 0 }
        }
        acc[date].amount += exp.expenseAmount
        acc[date].count += 1
        return acc
    }, {})
    const dailyExpenses = Object.values(expensesByDate).sort((a, b) => new Date(a.date) - new Date(b.date))

    // Group by category (description)
    const expensesByCategory = expenses.reduce((acc, exp) => {
        const category = exp.expenseDescription || 'Other'
        if (!acc[category]) {
            acc[category] = { name: category, amount: 0 }
        }
        acc[category].amount += exp.expenseAmount
        return acc
    }, {})
    const categoryData = Object.values(expensesByCategory).sort((a, b) => b.amount - a.amount)

    const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-semibold">Expense Reports</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹ {totalExpenses.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{expenses.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-yellow-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Average Expense</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">₹ {expenses.length ? (totalExpenses / expenses.length).toFixed(2) : 0}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Daily Expense Trend - Line Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Daily Expense Trend</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dailyExpenses}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="amount" stroke="#ff6384" name="Expense (₹)" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Expense by Category - Bar Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="amount" fill="#ff6384" name="Amount (₹)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Distribution - Pie Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.name}: ₹${entry.amount.toLocaleString()}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="amount"
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
            </div>
        </div>
    )
}