import User from "@/models/User";
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/db";

export async function GET(){
    try {
        await connectToDb();

        const users = await User.find();

        if(users.length === 0) return NextResponse.json({message: "No users found"}, {status: 404});

        return NextResponse.json({message: "Users fetched", users}, {status: 200});
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}