"use client"
import { useState, useEffect } from "react"
import { getStock } from "@/services/stockService"
import { getOrders } from "@/services/orderService"
import { Bell, AlertTriangle, Package, TrendingUp, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function NotificationPanel() {
    const [inventory, setInventory] = useState([])
    const [orders, setOrders] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchData()
        const interval = setInterval(fetchData, 60000)
        return () => clearInterval(interval)
    }, [])

    const fetchData = async () => {
        try {
            const [stockData, ordersData] = await Promise.all([
                getStock(),
                getOrders()
            ])
            setInventory(stockData.inventory || [])
            setOrders(ordersData.orders || [])
        } catch (error) {
            console.log(error)
        }
    }

    const lowStockItems = inventory.filter(item => item.quantity > 0 && item.quantity <= item.reorderThreshold)
    const outOfStock = inventory.filter(item => item.quantity === 0)
    const pendingPayments = orders.filter(order => order.paymentStatus === "pending")
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        orderDate.setHours(0, 0, 0, 0)
        return orderDate.getTime() === today.getTime()
    })

    const totalNotifications = outOfStock.length + lowStockItems.length + pendingPayments.length

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
                    <Bell size={20} className={totalNotifications > 0 ? "animate-pulse" : ""} />
                    {totalNotifications > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                            {totalNotifications > 9 ? '9+' : totalNotifications}
                        </span>
                    )}
                </Button>
            </SheetTrigger>

            <SheetContent className="w-[420px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="text-2xl font-bold">Notifications</SheetTitle>
                        {totalNotifications > 0 && (
                            <Badge variant="destructive" className="text-xs">
                                {totalNotifications} Alert{totalNotifications > 1 ? 's' : ''}
                            </Badge>
                        )}
                    </div>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Out of Stock */}
                    {outOfStock.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border-l-4 border-red-500">
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-red-700">Out of Stock</p>
                                    <p className="text-xs text-red-600">{outOfStock.length} item{outOfStock.length > 1 ? 's' : ''} need immediate attention</p>
                                </div>
                            </div>
                            <div className="space-y-2 pl-2">
                                {outOfStock.map(item => (
                                    <div key={item._id} className="group p-3 bg-white rounded-lg border border-red-200 hover:border-red-400 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold capitalize text-gray-900">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-xs text-red-600 font-semibold">Stock: 0</span>
                                                </div>
                                            </div>
                                            <div className="p-1.5 bg-red-100 rounded-full">
                                                <X size={14} className="text-red-600" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Low Stock */}
                    {lowStockItems.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                                <div className="p-2 bg-orange-100 rounded-full">
                                    <Package size={20} className="text-orange-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-orange-700">Low Stock Alert</p>
                                    <p className="text-xs text-orange-600">{lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low</p>
                                </div>
                            </div>
                            <div className="space-y-2 pl-2">
                                {lowStockItems.map(item => (
                                    <div key={item._id} className="group p-3 bg-white rounded-lg border border-orange-200 hover:border-orange-400 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold capitalize text-gray-900">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                                                        {item.category}
                                                    </Badge>
                                                    <span className="text-xs text-orange-600 font-semibold">
                                                        {item.quantity} left
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Reorder at: {item.reorderThreshold}</p>
                                            </div>
                                            <div className="p-1.5 bg-orange-100 rounded-full">
                                                <AlertTriangle size={14} className="text-orange-600" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pending Payments */}
                    {pendingPayments.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    <TrendingUp size={20} className="text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-yellow-700">Pending Payments</p>
                                    <p className="text-xs text-yellow-600">{pendingPayments.length} payment{pendingPayments.length > 1 ? 's' : ''} pending</p>
                                </div>
                            </div>
                            <div className="space-y-2 pl-2">
                                {pendingPayments.map(order => (
                                    <div key={order._id} className="group p-3 bg-white rounded-lg border border-yellow-200 hover:border-yellow-400 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-semibold capitalize text-gray-900">{order.customerName}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-lg font-bold text-yellow-600">₹{order.total.toLocaleString()}</span>
                                                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                                        {order.modeOfPayment.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-1.5 bg-yellow-100 rounded-full">
                                                <TrendingUp size={14} className="text-yellow-600" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Separator */}
                    {totalNotifications > 0 && <Separator className="my-4" />}

                    {/* Today's Summary */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Bell size={20} className="text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-blue-700">Today's Summary</p>
                                <p className="text-xs text-blue-600">Quick overview</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pl-2">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-600 font-medium mb-1">Total Orders</p>
                                <p className="text-2xl font-bold text-blue-700">{todayOrders.length}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                                <p className="text-xs text-green-600 font-medium mb-1">Total Sales</p>
                                <p className="text-2xl font-bold text-green-700">₹{todayOrders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Empty State */}
                    {totalNotifications === 0 && (
                        <div className="text-center py-12">
                            <div className="inline-flex p-4 bg-green-50 rounded-full mb-4">
                                <Bell size={48} className="text-green-500" />
                            </div>
                            <p className="text-lg font-semibold text-gray-700">All Clear!</p>
                            <p className="text-sm text-gray-500 mt-1">No notifications at the moment 👍</p>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
