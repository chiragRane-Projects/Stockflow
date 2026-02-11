import CashDrawer from "@/models/CashDrawer";
import { NextResponse } from "next/server";
import { connectToDb } from "@/utils/db";

export async function GET(){
    try {
        await connectToDb();

        const cashdrawer = await CashDrawer.find();

        if(cashdrawer.length === 0){
            return NextResponse.json({message: "No logs found"}, {status: 404})
        }

        return NextResponse.json({cashdrawer}, {status: 200});
    } catch (error) {
        return NextResponse.json({message: "Error fetching logs", error: error.message}, {status: 500});
    }
}

export async function POST(req){
    try{
        await connectToDb();

        const {typeOfLog, amount, description, logBy} = await req.json();

        const newLog = await CashDrawer.create({
            typeOfLog,
            amount,
            description,
            logBy
        });

        return NextResponse.json({message: "Log created", log: newLog}, {status: 201})
    } catch(error){
        return NextResponse.json({message: "Error creating log", error: error.message}, {status: 500});
    }
}