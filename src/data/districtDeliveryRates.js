/**
 * Sri Lanka 25 Districts Delivery Rates (LKR)
 * 
 * Rates schedule:
 * - Western Province (Colombo, Gampaha, Kalutara): Rs. 400.00
 * - 14 Outstation Districts: Rs. 450.00
 * - Northern, Eastern & Monaragala (8 Districts): Rs. 500.00
 * - Orders >= Rs. 20,000: FREE DELIVERY
 */

export const FREE_DELIVERY_THRESHOLD = 20000

export const DISTRICT_DELIVERY_FEES = {
    // Western Province (Rs. 400.00)
    "Colombo": 400,
    "Gampaha": 400,
    "Kalutara": 400,

    // Central, Southern, North Western, North Central, Uva, Sabaragamuwa, Trincomalee (Rs. 450.00)
    "Kandy": 450,
    "Matale": 450,
    "Nuwara Eliya": 450,
    "Galle": 450,
    "Matara": 450,
    "Hambantota": 450,
    "Trincomalee": 450,
    "Kurunegala": 450,
    "Puttalam": 450,
    "Anuradhapura": 450,
    "Polonnaruwa": 450,
    "Badulla": 450,
    "Ratnapura": 450,
    "Kegalle": 450,

    // Northern, Eastern, Monaragala (Rs. 500.00)
    "Jaffna": 500,
    "Kilinochchi": 500,
    "Mannar": 500,
    "Vavuniya": 500,
    "Mullaitivu": 500,
    "Batticaloa": 500,
    "Ampara": 500,
    "Monaragala": 500,
}

/**
 * Calculates packaging details (boxes needed, box tare weight) and total gross shipping weight.
 * 
 * Rules:
 * - 1 box: holds max 850g product (1000g gross limit - 150g box weight).
 * - 2 boxes: adds 200g box weight (holds max 1800g product).
 * - 3 boxes: adds 250g box weight (holds max 2750g product).
 * - N boxes: boxWeight = 100 + (N * 50)g. Max product capacity = (N * 1000) - boxWeight.
 * 
 * @param {number} productWeightGrams - Total product net weight in grams
 * @returns {{ boxes: number, boxWeight: number, grossWeight: number }}
 */
export function calculatePackagingAndWeight(productWeightGrams = 0) {
    const netWeight = Math.max(0, Number(productWeightGrams) || 0)
    if (netWeight === 0) {
        return { boxes: 1, boxWeight: 150, grossWeight: 150 }
    }

    let boxes = 1
    while (true) {
        const boxWeight = 100 + (boxes * 50)
        const maxCapacity = (boxes * 1000) - boxWeight
        if (netWeight <= maxCapacity) {
            return {
                boxes,
                boxWeight,
                grossWeight: netWeight + boxWeight
            }
        }
        boxes++
    }
}

/**
 * Calculates the exact delivery fee based on district, subtotal, destination type, and product weight.
 * 
 * Rates schedule:
 * - Free for International or orders >= 20,000 LKR
 * - 0 - 1.0kg (<= 1000g gross): Base district fee (e.g. Rs. 400 Western, 450 Outstation, 500 Remote)
 * - > 1.0kg: adds Rs. 100 per additional 1kg (or fraction thereof).
 * 
 * @param {string} district - Selected Sri Lankan district
 * @param {number} subtotal - Current cart subtotal in LKR
 * @param {string} destinationType - 'srilanka' or 'international'
 * @param {number} productWeightGrams - Total product net weight in grams
 * @returns {number} Delivery fee in LKR
 */
export function getDistrictDeliveryFee(district = "", subtotal = 0, destinationType = "srilanka", productWeightGrams = 0) {
    if (destinationType !== "srilanka") {
        return 0 // Free / International handles separately
    }

    // Free delivery promotion for orders >= 20,000 LKR
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        return 0
    }

    let baseFee = 400
    if (district && DISTRICT_DELIVERY_FEES[district] !== undefined) {
        baseFee = DISTRICT_DELIVERY_FEES[district]
    }

    const { grossWeight } = calculatePackagingAndWeight(productWeightGrams)
    const extraKgs = Math.max(0, Math.ceil(grossWeight / 1000) - 1)

    return baseFee + (extraKgs * 100)
}

