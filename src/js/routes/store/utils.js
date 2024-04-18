/**
 * @param {number} price
 */
export function toDollarFormat(price) {
    if (price <= 0) return "FREE";
    if (price.toString().indexOf(".") === -1) return `$${price}.00`;
    
    const splitPrice = price.toFixed(2).toString().split(".");
    const beforeDecimal = splitPrice[0];
    const afterDecimal = splitPrice[1].padEnd(2, "0");
    return `$${beforeDecimal}.${afterDecimal}`;
}