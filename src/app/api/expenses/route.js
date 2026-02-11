import Expenses from "@/models/Expenses";
import { connectToDb } from "@/utils/db";
import { NextResponse } from "next/server";


export async function GET(){
    try {
        await connectToDb();

        const expenses = await Expenses.find();

        if(expenses.length == 0){
            return NextResponse.json({message: "Expenses not found"}, {status: 404});
        }

        return NextResponse.json({message: "Expenses fetched", expenses}, {status:200})
    } catch (error) {
        return NextResponse.json({message: "Internal server error"}, {status: 500});
    }
}

export async function POST(req){
    try {
        await connectToDb();

        const {expenseDescription, expenseAmount, expenseBy} = await req.json();

        const newExpense = await Expenses.create({
            expenseDescription,
            expenseAmount,
            expenseBy
        });
        
        return NextResponse.json({message: "Expense created", expense: newExpense}, {status: 201})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal server error", error}, {status: 500});
    }
}