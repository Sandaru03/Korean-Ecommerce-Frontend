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
 * Calculates the exact delivery fee based on district, subtotal, and destination type.
 * 
 * @param {string} district - Selected Sri Lankan district
 * @param {number} subtotal - Current cart subtotal in LKR
 * @param {string} destinationType - 'srilanka' or 'international'
 * @returns {number} Delivery fee in LKR
 */
export function getDistrictDeliveryFee(district = "", subtotal = 0, destinationType = "srilanka") {
    if (destinationType !== "srilanka") {
        return 0 // Free / International handles separately
    }

    // Free delivery promotion for orders >= 20,000 LKR
    if (subtotal >= FREE_DELIVERY_THRESHOLD) {
        return 0
    }

    if (district && DISTRICT_DELIVERY_FEES[district] !== undefined) {
        return DISTRICT_DELIVERY_FEES[district]
    }

    // Default base delivery fee when district is not selected yet
    return 400
}
