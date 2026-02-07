import User from "@/models/User";
import { verifyPassword, createToken } from "@/utils/auth";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDb();

        const { username, password } = await req.json();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const verifyPwd = await verifyPassword(password, user.password);

        if (!verifyPwd) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        const token = await createToken({
            id: user._id,
            role: user.role,
            name: user.name
        });

        const response = NextResponse.json(
            { message: "Login successful", token},
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}