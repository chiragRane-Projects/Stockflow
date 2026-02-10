import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function verifyToken(req) {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch {
        return null;
    }
}

export function requireRole(req, allowedRoles) {
    const user = verifyToken(req);
    
    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!allowedRoles.includes(user.role)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return null;
}
