import { connectToDb } from "@/utils/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { hashPassword } from "@/utils/auth";

export async function POST(req) {
    try {
        await connectToDb();
        
        const { name, username, password, role } = await req.json();
        
        const userExists = await User.findOne({ username });

        if(userExists){
            return NextResponse.json({message: "User already exists"}, {status: 400});
        }
        
        const pwdHash = await hashPassword(password);

        const newUser = await User.create({
            name,
            username,
            password: pwdHash,
            role
        });

        return NextResponse.json({message: "New user created", userId: newUser._id}, {status:201});
    } catch (error) {
        return NextResponse.json({message: "Internal server error", error}, {status: 500})
    }
}