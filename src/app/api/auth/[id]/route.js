import User from "@/models/User";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}){
    try {
        await connectToDb();

        const {id} = await params;

        const deleteUser = await User.findByIdAndDelete(id);

        if(!deleteUser){
            return NextResponse.json({message: "User not found"}, {status: 404});
        }

        return NextResponse.json({message: `${id} deleted`}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Internal server error"}, {status: 500})
    }
}