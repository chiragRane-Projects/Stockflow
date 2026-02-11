"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { getOrders } from "@/services/orderService"
import { toast } from "sonner"
import { Loader2, ShoppingCart, Wallet, CreditCard } from "lucide-react"
import CreateOrdersModal from "@/components/orders/CreateOrdersModal"
import UpdateOrdersModal from "@/components/orders/UpdateOrdersModal"

export default function Orders() {
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
            toast.error("Failed to fetch orders")
        } finally {
            setLoading(false)
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center flex-col gap-2 h-screen">
            <Loader2 className="animate-spin" size={18} />
            <p>Loading Orders...</p>
        </div>
    )

    const paidOrders = orders.filter(o => o.paymentStatus === "paid")
    const pendingOrders = orders.filter(o => o.paymentStatus === "pending")
    
    // Today's calculations
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
    })
    const todaySales = todayOrders.reduce((sum, order) => sum + order.total, 0)
    const todayCash = todayOrders.filter(o => o.modeOfPayment === "cash").reduce((sum, o) => sum + o.total, 0)
    const todayUpi = todayOrders.filter(o => o.modeOfPayment === "upi").reduce((sum, o) => sum + o.total, 0)

    const OrderTable = ({ orderList }) => (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Customer</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Payment</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderList.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No orders found
                        </TableCell>
                    </TableRow>
                ) : (
                    orderList.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell className="text-center capitalize font-medium">{order.customerName}</TableCell>
                            <TableCell className="text-center">
                                {order.items?.map((item, idx) => (
                                    <div key={idx} className="text-sm">
                                        {item.productId?.name || "N/A"} x {item.quantity}
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell className="text-center font-semibold">₹{order.total.toLocaleString()}</TableCell>
                            <TableCell className="text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    order.modeOfPayment === "cash" 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-blue-100 text-blue-700"
                                }`}>
                                    {order.modeOfPayment.toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell className="text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                    order.paymentStatus === "paid" 
                                        ? "bg-green-100 text-green-700" 
                                        : "bg-yellow-100 text-yellow-700"
                                }`}>
                                    {order.paymentStatus.toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell className="text-center text-sm">
                                {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </TableCell>
                            <TableCell className="text-center">
                                <UpdateOrdersModal
                                    order={order}
                                    onUpdated={(updated) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold text-3xl">Order Management</h1>
                <CreateOrdersModal onCreated={(newOrder) => setOrders(prev => [...prev, newOrder])} />
            </div>

            {/* Today's KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ShoppingCart size={16} />
                            Today's Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{todayOrders.length}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Today's Sales
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-green-600">₹{todaySales.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-orange-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wallet size={16} />
                            Cash
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{todayCash.toLocaleString()}</p>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CreditCard size={16} />
                            UPI
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">₹{todayUpi.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Orders Tabs */}
            <Tabs defaultValue="all">
                <TabsList>
                    <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
                    <TabsTrigger value="paid">Paid ({paidOrders.length})</TabsTrigger>
                    <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="all">
                    <OrderTable orderList={orders} />
                </TabsContent>
                <TabsContent value="paid">
                    <OrderTable orderList={paidOrders} />
                </TabsContent>
                <TabsContent value="pending">
                    <OrderTable orderList={pendingOrders} />
                </TabsContent>
            </Tabs>
        </div>
    )
}