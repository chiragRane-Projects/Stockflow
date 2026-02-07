import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { connectToDb } from "@/utils/db";

export async function GET(req) {
    try {
        await connectToDb();

        const token = req.cookies.get("token")?.value;

        if(!token){
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.id).select("-password");

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}