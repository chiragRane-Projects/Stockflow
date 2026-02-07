import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

    response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0, 
    });

    return response;
}