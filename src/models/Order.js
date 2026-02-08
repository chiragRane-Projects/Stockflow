import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    productName: {type: mongoose.Types.ObjectId, ref: "Inventory", required: true},
    quantity: {type: Number, required: true},
    total: {type: Number, required: true},
    orderCreated: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    modeOfPayment: {type: String, enum: ["cash", "upi"], required: true},
    paymentStatus: {type: String, enum: ["pending", "paid"], required: true}
}, {timestamps: true});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);