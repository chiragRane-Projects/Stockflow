"use client"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getOrders } from "@/services/orderService"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import CreateOrdersModal from "@/components/orders/CreateOrdersModal"
import UpdateOrdersModal from "@/components/orders/UpdateOrdersModal"

export default function Orders(){
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isOwner = user?.role === "owner";

    useEffect(() => {
        if (isOwner) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [isOwner]);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            console.log("Orders data:", data.orders);
            setOrders(data.orders);
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    }

    const paidOrders = orders.filter(o => o.paymentStatus === "paid");
    const pendingOrders = orders.filter(o => o.paymentStatus === "pending");

    if (loading) return <p className="p-4">Loading...</p>;

    const OrderTable = ({ orderList }) => (
        <Table className="border">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center">Customer Name</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Payment Mode</TableHead>
                    <TableHead className="text-center">Payment Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orderList.map((order) => (
                    <TableRow key={order._id}>
                        <TableCell className="text-center capitalize">{order.customerName}</TableCell>
                        <TableCell className="text-center">
                            {order.items?.map((item, idx) => (
                                <div key={idx}>
                                    {item.productId?.name || "N/A"} x {item.quantity}
                                </div>
                            ))}
                        </TableCell>
                        <TableCell className="text-center">₹{order.total}</TableCell>
                        <TableCell className="text-center capitalize">{order.modeOfPayment}</TableCell>
                        <TableCell className="text-center capitalize">{order.paymentStatus}</TableCell>
                        <TableCell className="text-center">
                            <UpdateOrdersModal 
                                order={order} 
                                onUpdated={(updated) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o))} 
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return(
        <>
            <div className="p-4 flex justify-between items-center">
                <h1 className="font-semibold text-3xl">
                    {isOwner ? "Orders Management" : "Create Order"}
                </h1>
                <CreateOrdersModal onCreated={(newOrder) => {
                    if (isOwner) {
                        setOrders(prev => [...prev, newOrder]);
                    }
                }} />
            </div>

            {isOwner && (
                <Tabs defaultValue="all" className="p-4">
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
            )}

            {!isOwner && (
                <div className="p-4 text-center text-muted-foreground">
                    Use the "Create Order" button above to add new orders.
                </div>
            )}
        </>
    )
}