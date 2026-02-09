export function calculateQuantity(quantity, quantitySold){
    let finalQuantity = 0;

    if(quantity === null || quantitySold === null){
        throw new Error("Parameters not passed")
    }

    finalQuantity = quantity - quantitySold;
    
    return finalQuantity;
}