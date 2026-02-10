import mongoose from "mongoose";

const invSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    quantity: {type: Number, required: true},
    pricePerQuantity: {type: Number, required: true},
    reorderThreshold: {type: Number, required: true}
}, {timestamps: true});

export default mongoose.models.Inventory || mongoose.model("Inventory", invSchema);