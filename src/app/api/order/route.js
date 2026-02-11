import Order from "@/models/Order";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";
import Inventory from "@/models/Inventory";

export async function GET() {
    try {
        await connectToDb();

        const orders = await Order.find().populate("items.productId", "name category pricePerQuantity");

        if (orders.length == 0) {
            return NextResponse.json({ message: "No orders found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Orders fetched", orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDb();

        const { customerName, items, modeOfPayment, paymentStatus } = await req.json();

        const orderItems = [];
        let totalAmount = 0;

        for (const item of items) {
            const { productId, quantity } = item;
            const qty = Number(quantity);

            if (!productId || !qty || qty <= 0) {
                return NextResponse.json(
                    { message: "Invalid item data" },
                    { status: 400 }
                );
            }

            const inv = await Inventory.findById(productId);
            if (!inv) {
                return NextResponse.json(
                    { message: `Product not found: ${productId}` },
                    { status: 404 }
                );
            }

            if (inv.quantity < qty) {
                return NextResponse.json(
                    { message: `Insufficient stock for ${inv.name}` },
                    { status: 400 }
                );
            }

            await Inventory.findByIdAndUpdate(productId, { $inc: { quantity: -qty } });

            const itemTotal = qty * inv.pricePerQuantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId,
                quantity: qty,
                price: itemTotal
            });
        }

        const newOrder = await Order.create({
            customerName,
            items: orderItems,
            total: totalAmount,
            modeOfPayment,
            paymentStatus
        });

        const populatedOrder = await Order.findById(newOrder._id).populate("items.productId", "name category pricePerQuantity");

        return NextResponse.json(
            { message: "Order created", order: populatedOrder },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}
