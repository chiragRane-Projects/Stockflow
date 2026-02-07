import mongoose from "mongoose";

const invSchema = new mongoose.Schema({
    name: {type: String, required: true},
    sku: {type: String, required: true, unique: true},
    quantity: {type: String, required: true},
    pricePerQuantity: {type: Number, required: true},
    reorderThreshold: {type: Number, required: true}
}, {timestamps: true});

export default mongoose.models.Inventory || mongoose.model("Inventory", invSchema);