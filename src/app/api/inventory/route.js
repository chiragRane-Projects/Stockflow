import Inventory from "@/models/Inventory";
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/db";
import { calculateInventoryTotalPrice } from "@/services/inventoryServices/calculateTotalPrice";

export async function GET(){
    try {
        await connectToDb();
        
        const stocks = await Inventory.find();

        if(stocks.length === 0){
            return NextResponse.json({message: "No inventory found"}, {status:404});
        }

        return NextResponse.json({message: "Stocks fetched", stocks}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Internal server error", error}, {status: 500})
    }
};

export async function POST(req) {
    try {
        await connectToDb();

        const{name, category, quantity, pricePerQuantity, reorderThreshold} = await req.json();

        const finalPrice = calculateInventoryTotalPrice(quantity, pricePerQuantity);

        const newStock = await Inventory.create({
            name,
            category,
            quantity,
            pricePerQuantity,
            totalPrice: finalPrice,
            reorderThreshold
        });

        return NextResponse.json({message: "New stock created", stock: newStock}, {status: 201});
    } catch (error) {
        return NextResponse.json({message: "Internal server error", error}, {status: 500})
    }
}