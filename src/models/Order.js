import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: {type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true},
    quantity: {type: Number, required: true},
    price: {type: Number, required: true}
});

const orderSchema = new mongoose.Schema({
    customerName: {type: String},
    items: [orderItemSchema],
    total: {type: Number, required: true},
    modeOfPayment: {type: String, enum: ["cash", "upi"], required: true},
    paymentStatus: {type: String, enum: ["pending", "paid"], required: true}
}, {timestamps: true});

export default mongoose.model("Order", orderSchema);