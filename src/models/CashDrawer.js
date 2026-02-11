import mongoose from "mongoose";

const cashdrawerSchema = new mongoose.Schema({
    typeOfLog: {type: String, enum:["cash-in", "cash-out"], required: true},
    amount: {type: Number, required: true},
    description: {type: String, required: true},
    logBy: {type: String, required: true}
}, {timestamps: true})

export default mongoose.models.CashDrawer || mongoose.model("CashDrawer", cashdrawerSchema);