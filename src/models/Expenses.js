import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    expenseDescription: {type: String, required: true},
    expenseAmount: {type: Number, required: true},
    expenseDate: {type: Date, default: Date.now(), required: true},
    expenseBy: {type: String, required: true}
}, {timestamps: true});

export default mongoose.models.Expenditure || mongoose.model("Expenditure", expenseSchema);