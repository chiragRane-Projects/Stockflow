import Order from "@/models/Order";
import Inventory from "@/models/Inventory";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await connectToDb();
        const { id } = await params;
        const { modeOfPayment, paymentStatus } = await req.json();

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { modeOfPayment, paymentStatus },
            { new: true }
        ).populate("items.productId", "name category pricePerQuantity");

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Order updated", updatedOrder },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
