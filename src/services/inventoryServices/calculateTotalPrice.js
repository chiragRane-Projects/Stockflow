export function calculateInventoryTotalPrice(quantity, pricePerQuantity) {
    if (quantity == null || pricePerQuantity == null){
        throw new Error("Missing params");
    }

    return quantity * pricePerQuantity;
}