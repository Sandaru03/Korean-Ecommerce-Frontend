// Using Unsplash for realistic Korean beauty product images (public, no API key needed)
const img = (seed) => `https://picsum.photos/seed/${seed}/400/400`

// ─── K-Beauty ───────────────────────────────────────
export const kBeautyProducts = [
  { id: 1, name: "COSRX Advanced Snail 96 Mucin Power Essence 100ml", price: "LKR 18.99", originalPrice: "LKR 29.99", discount: "37%", rating: 4.9, reviews: 12453, image: img("kbeauty1"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 2, name: "Anua Heartleaf 77% Soothing Toner 250ml Calming", price: "LKR 22.99", originalPrice: "LKR 34.99", discount: "34%", rating: 4.8, reviews: 8921, image: img("kbeauty2"), rocketDelivery: true, freeShipping: true },
  { id: 3, name: "Medicube Zero Pore Pads 2.0 Exfoliating Daily Cotton", price: "LKR 24.99", originalPrice: "LKR 38.99", discount: "36%", rating: 4.7, reviews: 6543, image: img("kbeauty3"), rocketDelivery: true },
  { id: 4, name: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF50+", price: "LKR 15.99", originalPrice: "LKR 23.99", discount: "33%", rating: 4.9, reviews: 14201, image: img("kbeauty4"), rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 5, name: "Some By Mi AHA BHA PHA 30 Days Miracle Starter Kit", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 5432, image: img("kbeauty5"), freeShipping: true },
  { id: 6, name: "Skin1004 Centella Ampoule 100ml Calming Concentrate", price: "LKR 21.99", originalPrice: "LKR 35.99", discount: "39%", rating: 4.8, reviews: 9876, image: img("kbeauty6"), rocketDelivery: true, freeShipping: true },
]

// ─── Skin Care ──────────────────────────────────────
export const skinCareProducts = [
  { id: 10, name: "COSRX Hydrium Triple Hyaluronic Moisture Cleanser", price: "LKR 13.99", originalPrice: "LKR 21.99", discount: "36%", rating: 4.6, reviews: 4532, image: img("skincare1"), rocketDelivery: true, freeShipping: true },
  { id: 11, name: "The Ordinary Niacinamide 10% + Zinc 1% Serum 30ml", price: "LKR 7.99", originalPrice: "LKR 12.99", discount: "38%", rating: 4.7, reviews: 23456, image: img("skincare2"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 12, name: "Cetaphil Gentle Skin Cleanser for All Skin Types 250ml", price: "LKR 11.99", originalPrice: "LKR 18.99", discount: "37%", rating: 4.8, reviews: 31000, image: img("skincare3"), rocketDelivery: true },
  { id: 13, name: "Anua Heartleaf Quercetinol Pore Deep Cleansing Foam", price: "LKR 16.99", originalPrice: "LKR 26.99", discount: "37%", rating: 4.7, reviews: 7654, image: img("skincare4"), freeShipping: true },
  { id: 14, name: "Medicube Collagen Night Capsule Cream 50ml Anti-Aging", price: "LKR 29.99", originalPrice: "LKR 49.99", discount: "40%", rating: 4.8, reviews: 5321, image: img("skincare5"), rocketDelivery: true, freeShipping: true, badge: "NEW" },
  { id: 15, name: "Skin1004 Madagascar Centella Tone Brightening Capsule Ampoule", price: "LKR 18.99", originalPrice: "LKR 31.99", discount: "41%", rating: 4.6, reviews: 4231, image: img("skincare6"), rocketDelivery: true },
]

// ─── Dry Skin ───────────────────────────────────────
export const drySkinProducts = [
  { id: 20, name: "COSRX Balancium Comfort Ceramide Cream 80g Rich", price: "LKR 17.99", originalPrice: "LKR 28.99", discount: "38%", rating: 4.8, reviews: 6543, image: img("dryskin1"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 21, name: "Cetaphil Moisturizing Cream for Dry Sensitive Skin 250g", price: "LKR 14.99", originalPrice: "LKR 22.99", discount: "35%", rating: 4.9, reviews: 18754, image: img("dryskin2"), rocketDelivery: true, freeShipping: true },
  { id: 22, name: "Beauty of Joseon Dynasty Cream Rice + RJ 50ml Deep Moisture", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.8, reviews: 8432, image: img("dryskin3"), rocketDelivery: true },
  { id: 23, name: "Some By Mi Yuja Niacin Brightening Moisture Gel Cream", price: "LKR 16.99", originalPrice: "LKR 27.99", discount: "39%", rating: 4.6, reviews: 4321, image: img("dryskin4"), freeShipping: true },
  { id: 24, name: "Anua Peach 77 Niacin Enriched Barrier Cream 50ml", price: "LKR 22.99", originalPrice: "LKR 36.99", discount: "38%", rating: 4.7, reviews: 5678, image: img("dryskin5"), rocketDelivery: true, freeShipping: true },
  { id: 25, name: "Skin1004 Centella Hyalu-Cica Moisture Ampoule 75ml", price: "LKR 20.99", originalPrice: "LKR 33.99", discount: "38%", rating: 4.7, reviews: 3987, image: img("dryskin6"), rocketDelivery: true },
]

// ─── Oily Skin ──────────────────────────────────────
export const oilySkinProducts = [
  { id: 30, name: "COSRX BHA Blackhead Power Liquid 100ml Pore Cleanse", price: "LKR 24.99", originalPrice: "LKR 39.99", discount: "37%", rating: 4.7, reviews: 9876, image: img("oilyskin1"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 31, name: "Medicube Zero Pore Pad 70 Sheets Oil Control Exfoliate", price: "LKR 22.99", originalPrice: "LKR 37.99", discount: "39%", rating: 4.8, reviews: 7654, image: img("oilyskin2"), rocketDelivery: true },
  { id: 32, name: "Some By Mi AHA 30 Days Miracle Toner 150ml Oil Control", price: "LKR 16.99", originalPrice: "LKR 27.99", discount: "39%", rating: 4.6, reviews: 5432, image: img("oilyskin3"), freeShipping: true },
  { id: 33, name: "The Ordinary Salicylic Acid 2% Solution 30ml Blemish", price: "LKR 6.99", originalPrice: "LKR 11.99", discount: "42%", rating: 4.5, reviews: 12345, image: img("oilyskin4"), rocketDelivery: true, freeShipping: true },
  { id: 34, name: "Anua Heartleaf Pore Control Serum 30ml Sebum Minimize", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 4321, image: img("oilyskin5"), rocketDelivery: true },
  { id: 35, name: "Beauty of Joseon Green Plum Refreshing Toner Pores", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.7, reviews: 6754, image: img("oilyskin6"), freeShipping: true, badge: "HOT" },
]

// ─── K-Pop Merchandise ──────────────────────────────
export const kpopProducts = [
  { id: 40, name: "BTS Butter Official Album CD + Photocard Set Limited", price: "LKR 24.99", originalPrice: "LKR 39.99", discount: "37%", rating: 4.9, reviews: 8765, image: img("kpop1"), rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 41, name: "BLACKPINK Born Pink Concert Lightstick Official MD", price: "LKR 34.99", originalPrice: "LKR 54.99", discount: "36%", rating: 4.8, reviews: 6543, image: img("kpop2"), rocketDelivery: true, freeShipping: true },
  { id: 42, name: "SEVENTEEN Carrot Plush Official Merch 30cm Cute Gift", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 4321, image: img("kpop3"), freeShipping: true },
  { id: 43, name: "STRAY KIDS Skzoo Plush Doll Official 20cm Collection", price: "LKR 22.99", originalPrice: "LKR 35.99", discount: "36%", rating: 4.8, reviews: 5432, image: img("kpop4"), rocketDelivery: true },
  { id: 44, name: "NewJeans How Sweet Official Wristband + Photocard Set", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.6, reviews: 3219, image: img("kpop5"), freeShipping: true, badge: "NEW" },
  { id: 45, name: "aespa Armageddon Official Poster + Mini Album Bundle", price: "LKR 17.99", originalPrice: "LKR 29.99", discount: "40%", rating: 4.7, reviews: 2987, image: img("kpop6"), rocketDelivery: true, freeShipping: true },
]

// ─── Makeup ─────────────────────────────────────────
export const makeupProducts = [
  { id: 50, name: "ROMAND Juicy Lasting Tint 5.5g - 38 Shades Available", price: "LKR 12.99", originalPrice: "LKR 19.99", discount: "35%", rating: 4.8, reviews: 15432, image: img("makeup1"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 51, name: "Etude House Play Color Eyes Shadow Palette 0.9g x 15", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 8765, image: img("makeup2"), rocketDelivery: true },
  { id: 52, name: "3CE Mood Recipe Matte Lip Color 3.5g Long-lasting", price: "LKR 16.99", originalPrice: "LKR 26.99", discount: "37%", rating: 4.6, reviews: 6543, image: img("makeup3"), freeShipping: true },
  { id: 53, name: "Laneige Lip Sleeping Mask Berry 20g Overnight Hydrate", price: "LKR 18.99", originalPrice: "LKR 30.99", discount: "39%", rating: 4.9, reviews: 21345, image: img("makeup4"), rocketDelivery: true, freeShipping: true, badge: "CULT" },
  { id: 54, name: "CLIO Kill Cover Mesh Foundation SPF50+ PA+++ 38g", price: "LKR 22.99", originalPrice: "LKR 37.99", discount: "39%", rating: 4.7, reviews: 9876, image: img("makeup5"), rocketDelivery: true },
  { id: 55, name: "Peripera Ink Velvet Lip 4g 20 Colors Matte Finish", price: "LKR 9.99", originalPrice: "LKR 15.99", discount: "38%", rating: 4.6, reviews: 7654, image: img("makeup6"), freeShipping: true },
]

// ─── Hair Care ──────────────────────────────────────
export const hairCareProducts = [
  { id: 60, name: "Aromatica Rosemary Hair Grower Scalp Scaling Serum", price: "LKR 21.99", originalPrice: "LKR 35.99", discount: "39%", rating: 4.7, reviews: 7654, image: img("haircare1"), rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 61, name: "MASIL 8 Seconds Salon Hair Mask 200ml Repair Damaged", price: "LKR 16.99", originalPrice: "LKR 27.99", discount: "39%", rating: 4.8, reviews: 9876, image: img("haircare2"), rocketDelivery: true },
  { id: 62, name: "Amos professional Raspberry Vinegar Hair Treatment 300ml", price: "LKR 18.99", originalPrice: "LKR 29.99", discount: "37%", rating: 4.6, reviews: 5432, image: img("haircare3"), freeShipping: true },
  { id: 63, name: "Ryo Hair Loss Expert Care Shampoo 550ml Anti Hair Fall", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 8765, image: img("haircare4"), rocketDelivery: true, freeShipping: true },
  { id: 64, name: "innisfree My Hair Recipe Treatment Watery Volume 330ml", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.5, reviews: 4321, image: img("haircare5"), rocketDelivery: true },
  { id: 65, name: "Mise En Scene Perfect Serum Original Extra Rich 80ml", price: "LKR 12.99", originalPrice: "LKR 20.99", discount: "38%", rating: 4.7, reviews: 11234, image: img("haircare6"), freeShipping: true, badge: "BEST" },
]

// ─── Health & Supplements ───────────────────────────
export const healthProducts = [
  { id: 70, name: "Korean Red Ginseng Extract Gold Premium 240g Energy", price: "LKR 49.99", originalPrice: "LKR 89.99", discount: "44%", rating: 4.8, reviews: 8765, image: img("health1"), rocketDelivery: true, freeShipping: true, badge: "PREMIUM" },
  { id: 71, name: "Collagen Peptide Powder 10000mg Daily Beauty Drink 30", price: "LKR 34.99", originalPrice: "LKR 59.99", discount: "42%", rating: 4.7, reviews: 6543, image: img("health2"), rocketDelivery: true },
  { id: 72, name: "Vitamin C 1000mg Effervescent Tablets 100ct Immune Support", price: "LKR 12.99", originalPrice: "LKR 21.99", discount: "41%", rating: 4.6, reviews: 12345, image: img("health3"), freeShipping: true },
  { id: 73, name: "Korean Probiotics 30 Billion CFU 60 Capsules Gut Health", price: "LKR 24.99", originalPrice: "LKR 42.99", discount: "42%", rating: 4.7, reviews: 5432, image: img("health4"), rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 74, name: "Omega-3 Fish Oil 2000mg 180 Softgels Heart & Brain", price: "LKR 19.99", originalPrice: "LKR 34.99", discount: "43%", rating: 4.7, reviews: 9876, image: img("health5"), rocketDelivery: true },
  { id: 75, name: "Korean Glow Collagen Vitamin Jelly Stick 30 Packs Berry", price: "LKR 22.99", originalPrice: "LKR 38.99", discount: "41%", rating: 4.8, reviews: 7654, image: img("health6"), freeShipping: true },
]

// ─── Foods ──────────────────────────────────────────
export const foodProducts = [
  { id: 80, name: "Ottogi Jin Ramen Spicy Korean Instant Noodles 5 Pack", price: "LKR 6.99", originalPrice: "LKR 10.99", discount: "36%", rating: 4.8, reviews: 23456, image: img("food1"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 81, name: "Nongshim Shin Ramyun Black Premium Noodles 5 Servings", price: "LKR 8.99", originalPrice: "LKR 13.99", discount: "36%", rating: 4.9, reviews: 34567, image: img("food2"), rocketDelivery: true },
  { id: 82, name: "Korean Laver Roasted Seaweed Snack 20 Pack Crispy Salty", price: "LKR 9.99", originalPrice: "LKR 15.99", discount: "37%", rating: 4.7, reviews: 12345, image: img("food3"), freeShipping: true },
  { id: 83, name: "Binggrae Banana Flavored Milk 200ml x 6 Pack Sweet", price: "LKR 7.99", originalPrice: "LKR 12.99", discount: "38%", rating: 4.8, reviews: 8765, image: img("food4"), rocketDelivery: true, freeShipping: true },
  { id: 84, name: "Tteokbokki Rice Cake Spicy Sauce Kit Authentic 200g", price: "LKR 5.99", originalPrice: "LKR 9.99", discount: "40%", rating: 4.6, reviews: 7654, image: img("food5"), rocketDelivery: true, badge: "NEW" },
  { id: 85, name: "Korean Honey Butter Chips Snack 60g Premium Sweet", price: "LKR 4.99", originalPrice: "LKR 7.99", discount: "38%", rating: 4.7, reviews: 16543, image: img("food6"), freeShipping: true },
]

// ─── Home & Kitchen ─────────────────────────────────
export const homeProducts = [
  { id: 90, name: "Ttukbaegi Korean Stone Bowl Set 2pc Hot Pot Soup", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 5432, image: img("home1"), rocketDelivery: true, freeShipping: true },
  { id: 91, name: "Korean Hanji Diffuser Deco Lamp Handcrafted Paper Light", price: "LKR 34.99", originalPrice: "LKR 54.99", discount: "36%", rating: 4.6, reviews: 2345, image: img("home2"), freeShipping: true, badge: "NEW" },
  { id: 92, name: "Stainless Steel Rice Cooker 6-Cup Warm Keep Function", price: "LKR 44.99", originalPrice: "LKR 74.99", discount: "40%", rating: 4.8, reviews: 8765, image: img("home3"), rocketDelivery: true, freeShipping: true },
  { id: 93, name: "Korean Traditional Ceramic Mug Handmade Celadon 300ml", price: "LKR 16.99", originalPrice: "LKR 27.99", discount: "39%", rating: 4.7, reviews: 3210, image: img("home4"), freeShipping: true },
  { id: 94, name: "Non-stick Frying Pan Ceramic Coating IH Induction 28cm", price: "LKR 29.99", originalPrice: "LKR 49.99", discount: "40%", rating: 4.8, reviews: 11234, image: img("home5"), rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 95, name: "Bamboo Cutting Board Set with Juice Groove 3 Sizes", price: "LKR 22.99", originalPrice: "LKR 38.99", discount: "41%", rating: 4.6, reviews: 4567, image: img("home6"), rocketDelivery: true },
]

// ─── Baby & Kids ─────────────────────────────────────
export const babyProducts = [
  { id: 100, name: "Burt's Bees Baby Wash & Shampoo 236ml Tear Free Gentle", price: "LKR 9.99", originalPrice: "LKR 15.99", discount: "37%", rating: 4.8, reviews: 9876, image: img("baby1"), rocketDelivery: true, freeShipping: true, badge: "SAFE" },
  { id: 101, name: "Korean Organic Baby Lotion Sensitive Skin 200ml Natural", price: "LKR 12.99", originalPrice: "LKR 20.99", discount: "38%", rating: 4.7, reviews: 6543, image: img("baby2"), rocketDelivery: true },
  { id: 102, name: "Soft Cotton Baby Blanket Swaddle Wrap Newborn 80x80cm", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.8, reviews: 8765, image: img("baby3"), freeShipping: true },
  { id: 103, name: "Baby Food Puree Organic Pumpkin & Sweet Potato 100g x6", price: "LKR 11.99", originalPrice: "LKR 18.99", discount: "37%", rating: 4.9, reviews: 12345, image: img("baby4"), rocketDelivery: true, freeShipping: true, badge: "ORGANIC" },
  { id: 104, name: "Wooden Educational Toy Building Blocks 50pc Kids 3+", price: "LKR 19.99", originalPrice: "LKR 32.99", discount: "39%", rating: 4.7, reviews: 4321, image: img("baby5"), rocketDelivery: true },
  { id: 105, name: "Baby Mineral Sunscreen SPF50+ Gentle Formula 75ml", price: "LKR 13.99", originalPrice: "LKR 22.99", discount: "39%", rating: 4.8, reviews: 7654, image: img("baby6"), freeShipping: true, badge: "BEST" },
]

// ─── Sports ──────────────────────────────────────────
export const sportsProducts = [
  { id: 110, name: "Resistance Bands Set 5 Levels Exercise Loop Booty Bands", price: "LKR 12.99", originalPrice: "LKR 21.99", discount: "41%", rating: 4.7, reviews: 15432, image: img("sports1"), rocketDelivery: true, freeShipping: true },
  { id: 111, name: "Yoga Mat Premium Anti-Slip Eco-friendly TPE 6mm Thick", price: "LKR 22.99", originalPrice: "LKR 38.99", discount: "41%", rating: 4.8, reviews: 11234, image: img("sports2"), rocketDelivery: true, badge: "BEST" },
  { id: 112, name: "Jump Rope Digital Counter Speed Cable 3m Adjustable", price: "LKR 9.99", originalPrice: "LKR 16.99", discount: "41%", rating: 4.6, reviews: 6543, image: img("sports3"), freeShipping: true },
  { id: 113, name: "Water Bottle BPA-Free 1L Leak-Proof Gym Sports Flask", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.7, reviews: 9876, image: img("sports4"), rocketDelivery: true, freeShipping: true },
  { id: 114, name: "Adjustable Dumbbell Set 5–25kg Quick Select Home Gym", price: "LKR 89.99", originalPrice: "LKR 159.99", discount: "44%", rating: 4.8, reviews: 4321, image: img("sports5"), rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 115, name: "KF94 Premium Korean Face Mask Black 10 Pack 4-Layer", price: "LKR 14.99", originalPrice: "LKR 24.99", discount: "40%", rating: 4.9, reviews: 34567, image: img("sports6"), rocketDelivery: true },
]

// ─── Flat id → product lookup (used by ProductPage) ─────────
// Combines all category arrays into one { "id": product } map
const _allProducts = [
  ...kBeautyProducts, ...skinCareProducts, ...drySkinProducts,
  ...oilySkinProducts, ...kpopProducts, ...makeupProducts,
  ...hairCareProducts, ...healthProducts, ...foodProducts,
  ...homeProducts, ...babyProducts, ...sportsProducts,
]
export const ALL_PRODUCTS = Object.fromEntries(
  _allProducts.map(p => [String(p.id), p])
)
