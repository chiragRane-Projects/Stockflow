"use client"
import { useState, useEffect } from "react"
import { getCashDrawer } from "@/services/cashDrawerService"
import { getOrders } from "@/services/orderService"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, TrendingUp, TrendingDown, Wallet } from "lucide-react"
import AddCashLogDialog from "@/components/cashdrawer/AddCashLogDialog"

export default function CashDrawer() {
    const [logs, setLogs] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [cashData, ordersData] = await Promise.all([
                getCashDrawer(),
                getOrders()
            ])
            setLogs(cashData.cashdrawer || [])
            setOrders(ordersData.orders || [])
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Cash Drawer...</p>
        </div>
    )

    // Today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter today's data
    const todayLogs = logs.filter(log => {
        const logDate = new Date(log.createdAt)
        logDate.setHours(0, 0, 0, 0)
        return logDate.getTime() === today.getTime()
    })

    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
    })

    // Calculate today's cash in/out from logs
    const todayCashIn = todayLogs.filter(log => log.typeOfLog === "cash-in").reduce((sum, log) => sum + log.amount, 0)
    const todayCashOut = todayLogs.filter(log => log.typeOfLog === "cash-out").reduce((sum, log) => sum + log.amount, 0)

    // Calculate today's sales (cash and UPI)
    const todayCashSales = todayOrders.filter(order => order.modeOfPayment === "cash").reduce((sum, order) => sum + order.total, 0)
    const todayUpiSales = todayOrders.filter(order => order.modeOfPayment === "upi").reduce((sum, order) => sum + order.total, 0)

    // Today's closing balance
    const todayClosingCash = todayCashIn + todayCashSales - todayCashOut
    const todayTotalClosing = todayClosingCash + todayUpiSales

    const formatDate = (date) => new Date(date).toLocaleString('en-IN')

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-semibold">Cash Drawer</h1>
                    <p className="text-sm text-muted-foreground mt-1">Today's closing becomes tomorrow's opening balance</p>
                </div>
                <AddCashLogDialog onCreated={(newLog) => setLogs(prev => [...prev, newLog])} />
            </div>

            {/* Today's KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp size={16} />
                            Today's Cash In
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">₹ {todayCashIn.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Manual entries</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingDown size={16} />
                            Today's Cash Out
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-red-600">₹ {todayCashOut.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Withdrawals</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wallet size={16} />
                            Today's Sales (Cash)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-blue-600">₹ {todayCashSales.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">From orders</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Today's Sales (UPI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-purple-600">₹ {todayUpiSales.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">From orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Closing Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Today's Closing Cash Balance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-orange-600">₹ {todayClosingCash.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Cash In + Cash Sales - Cash Out</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-indigo-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Today's Total Closing (Cash + UPI)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-indigo-600">₹ {todayTotalClosing.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Complete day closing</p>
                    </CardContent>
                </Card>
            </div>

            {/* Cash Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Cash Drawer Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    {logs.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No cash logs yet. Add your first entry!</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Logged By</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log._id}>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                                log.typeOfLog === "cash-in" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {log.typeOfLog === "cash-in" ? "Cash In" : "Cash Out"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ₹ {log.amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="capitalize">{log.description}</TableCell>
                                        <TableCell className="capitalize">{log.logBy}</TableCell>
                                        <TableCell>{formatDate(log.createdAt)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}