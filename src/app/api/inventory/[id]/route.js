import Inventory from "@/models/Inventory";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    await connectToDb();

    const { id } = await params;
    const body = await req.json();

    const stock = await Inventory.findById(id);

    if (!stock) {
      return NextResponse.json({ message: "Stock not found" }, { status: 404 });
    }

    if (body.quantitySold !== undefined) {
      const sold = Number(body.quantitySold);

      const finalQuantity = stock.quantity - sold;

      if (finalQuantity < 0) {
        return NextResponse.json({ message: "Insufficient stock" }, { status: 400 });
      }

      stock.quantity = finalQuantity;
    }

    if (body.quantity !== undefined) stock.quantity = Number(body.quantity);
    if (body.pricePerQuantity !== undefined)
      stock.pricePerQuantity = Number(body.pricePerQuantity);
    if (body.name !== undefined) stock.name = body.name;
    if (body.category !== undefined) stock.category = body.category;
    if (body.reorderThreshold !== undefined)
      stock.reorderThreshold = Number(body.reorderThreshold);

    await stock.save();

    return NextResponse.json({ message: "Stock updated", stock });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDb();

        const { id } = await params;

        const deleteStock = await Inventory.findByIdAndDelete(id);

        if (!deleteStock) {
            return NextResponse.json({ message: "Stock not found" }, { status: 400 });
        }

        return NextResponse.json({ message: "Stock deleted" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: "Internal Server Error", error }, { status: 500 });
    }
}