import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password) {
    return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
}

export async function createToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})
}