export interface Product {
  id: number
  name: string
  price: string
  originalPrice?: string
  discount?: string
  rating?: number
  reviews?: number
  image: string
  rocketDelivery?: boolean
  freeShipping?: boolean
  badge?: string
}

const productImages = [
  "https://picsum.photos/seed/cp1/400/400",
  "https://picsum.photos/seed/cp2/400/400",
  "https://picsum.photos/seed/cp3/400/400",
  "https://picsum.photos/seed/cp4/400/400",
  "https://picsum.photos/seed/cp5/400/400",
  "https://picsum.photos/seed/cp6/400/400",
  "https://picsum.photos/seed/cp7/400/400",
  "https://picsum.photos/seed/cp8/400/400",
  "https://picsum.photos/seed/cp9/400/400",
  "https://picsum.photos/seed/cp10/400/400",
  "https://picsum.photos/seed/cp11/400/400",
  "https://picsum.photos/seed/cp12/400/400",
  "https://picsum.photos/seed/cp13/400/400",
  "https://picsum.photos/seed/cp14/400/400",
  "https://picsum.photos/seed/cp15/400/400",
  "https://picsum.photos/seed/cp16/400/400",
  "https://picsum.photos/seed/cp17/400/400",
  "https://picsum.photos/seed/cp18/400/400",
  "https://picsum.photos/seed/cp19/400/400",
  "https://picsum.photos/seed/cp20/400/400",
  "https://picsum.photos/seed/cp21/400/400",
  "https://picsum.photos/seed/cp22/400/400",
  "https://picsum.photos/seed/cp23/400/400",
  "https://picsum.photos/seed/cp24/400/400",
]

export const todayRecommended: Product[] = [
  { id: 1, name: "Premium Korean Red Ginseng Extract Health Supplement", price: "$29.99", originalPrice: "$49.99", discount: "40%", rating: 4.8, reviews: 3241, image: productImages[0], rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 2, name: "Organic Green Tea Set - 100 Tea Bags Premium Quality", price: "$15.99", originalPrice: "$24.99", discount: "36%", rating: 4.5, reviews: 1823, image: productImages[1], rocketDelivery: true, freeShipping: true },
  { id: 3, name: "Stainless Steel Vacuum Insulated Water Bottle 500ml", price: "$18.99", originalPrice: "$32.99", discount: "42%", rating: 4.7, reviews: 5621, image: productImages[2], rocketDelivery: true },
  { id: 4, name: "Cotton Casual T-shirt Unisex Basic Tee Multiple Colors", price: "$12.99", originalPrice: "$19.99", discount: "35%", rating: 4.3, reviews: 892, image: productImages[3], freeShipping: true },
  { id: 5, name: "Wireless Bluetooth Earbuds with Noise Cancellation", price: "$39.99", originalPrice: "$79.99", discount: "50%", rating: 4.6, reviews: 7234, image: productImages[4], rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 6, name: "Natural Bamboo Cutting Board Set Kitchen Essential", price: "$22.99", originalPrice: "$34.99", discount: "34%", rating: 4.4, reviews: 456, image: productImages[5], rocketDelivery: true },
]

export const rocketDeliveryProducts: Product[] = [
  { id: 7, name: "Memory Foam Pillow Ergonomic Neck Support Sleep Better", price: "$24.99", originalPrice: "$44.99", discount: "44%", rating: 4.6, reviews: 2345, image: productImages[6], rocketDelivery: true, freeShipping: true },
  { id: 8, name: "LED Desk Lamp with USB Charging Port Eye-Caring", price: "$19.99", originalPrice: "$35.99", discount: "44%", rating: 4.5, reviews: 1234, image: productImages[7], rocketDelivery: true, freeShipping: true, badge: "NEW" },
  { id: 9, name: "Japanese Style Ceramic Bowl Set 4 Pieces Home Dining", price: "$27.99", originalPrice: "$42.99", discount: "35%", rating: 4.7, reviews: 678, image: productImages[8], rocketDelivery: true },
  { id: 10, name: "Yoga Mat Premium Non-Slip Exercise Fitness 6mm Thick", price: "$21.99", originalPrice: "$36.99", discount: "41%", rating: 4.8, reviews: 3456, image: productImages[9], rocketDelivery: true, freeShipping: true },
  { id: 11, name: "USB-C Fast Charging Cable Braided Nylon 2-Pack 6ft", price: "$9.99", originalPrice: "$19.99", discount: "50%", rating: 4.4, reviews: 8901, image: productImages[10], rocketDelivery: true, badge: "SALE" },
  { id: 12, name: "Portable Bluetooth Speaker Waterproof Outdoor Sound", price: "$34.99", originalPrice: "$59.99", discount: "42%", rating: 4.5, reviews: 2567, image: productImages[11], rocketDelivery: true, freeShipping: true },
]

export const fashionProducts: Product[] = [
  { id: 13, name: "Oversized Hoodie Streetwear Unisex Cotton Blend", price: "$28.99", originalPrice: "$45.99", discount: "37%", rating: 4.3, reviews: 1567, image: productImages[12], freeShipping: true },
  { id: 14, name: "High Waist Straight Leg Jeans Vintage Wash Denim", price: "$32.99", originalPrice: "$54.99", discount: "40%", rating: 4.5, reviews: 2341, image: productImages[13], freeShipping: true, badge: "TREND" },
  { id: 15, name: "Leather Crossbody Bag Minimalist Design Shoulder", price: "$35.99", originalPrice: "$65.99", discount: "45%", rating: 4.6, reviews: 891, image: productImages[14], rocketDelivery: true },
  { id: 16, name: "Running Shoes Lightweight Breathable Sport Sneakers", price: "$42.99", originalPrice: "$78.99", discount: "46%", rating: 4.7, reviews: 4523, image: productImages[15], rocketDelivery: true, freeShipping: true },
  { id: 17, name: "Silk Scarf Printed Pattern Luxury Feel Accessory", price: "$16.99", originalPrice: "$29.99", discount: "43%", rating: 4.2, reviews: 345, image: productImages[16] },
  { id: 18, name: "Canvas Tote Bag Eco-Friendly Reusable Large Capacity", price: "$11.99", originalPrice: "$19.99", discount: "40%", rating: 4.4, reviews: 2678, image: productImages[17], freeShipping: true },
]

export const beautyProducts: Product[] = [
  { id: 19, name: "Korean Skin Care Set 7 Step Routine Hydrating Kit", price: "$45.99", originalPrice: "$89.99", discount: "49%", rating: 4.8, reviews: 5634, image: productImages[18], rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 20, name: "Vitamin C Serum Brightening Anti-Aging Face Treatment", price: "$14.99", originalPrice: "$28.99", discount: "48%", rating: 4.6, reviews: 3421, image: productImages[19], rocketDelivery: true },
  { id: 21, name: "Hair Care Repair Shampoo & Conditioner Set Natural", price: "$18.99", originalPrice: "$32.99", discount: "42%", rating: 4.4, reviews: 1987, image: productImages[20], freeShipping: true },
  { id: 22, name: "Sunscreen SPF 50+ Lightweight Daily UV Protection", price: "$12.99", originalPrice: "$22.99", discount: "43%", rating: 4.7, reviews: 6789, image: productImages[21], rocketDelivery: true, freeShipping: true },
  { id: 23, name: "Face Mask Pack 30 Sheets Hydrating Moisturizing", price: "$8.99", originalPrice: "$16.99", discount: "47%", rating: 4.5, reviews: 4321, image: productImages[22], rocketDelivery: true },
  { id: 24, name: "Perfume Gift Set Mini Collection 5 Fragrances", price: "$38.99", originalPrice: "$68.99", discount: "43%", rating: 4.3, reviews: 876, image: productImages[23], freeShipping: true },
]

export const freshProducts: Product[] = [
  { id: 25, name: "Organic Fresh Mixed Berry Pack 500g Premium Quality", price: "$8.99", originalPrice: "$14.99", discount: "40%", rating: 4.6, reviews: 2345, image: "https://picsum.photos/seed/fresh1/400/400", rocketDelivery: true, freeShipping: true },
  { id: 26, name: "Free Range Eggs Large 30 Pack Farm Fresh Organic", price: "$6.99", originalPrice: "$9.99", discount: "30%", rating: 4.8, reviews: 5678, image: "https://picsum.photos/seed/fresh2/400/400", rocketDelivery: true },
  { id: 27, name: "Premium Wagyu Beef Steak Grade A5 300g Frozen", price: "$45.99", originalPrice: "$69.99", discount: "34%", rating: 4.9, reviews: 1234, image: "https://picsum.photos/seed/fresh3/400/400", rocketDelivery: true, freeShipping: true, badge: "PREMIUM" },
  { id: 28, name: "Salmon Fillet Norwegian Atlantic Fresh 500g Pack", price: "$22.99", originalPrice: "$35.99", discount: "36%", rating: 4.7, reviews: 3456, image: "https://picsum.photos/seed/fresh4/400/400", rocketDelivery: true },
  { id: 29, name: "Organic Avocado Pack of 6 Ripe and Ready to Eat", price: "$7.99", originalPrice: "$12.99", discount: "38%", rating: 4.5, reviews: 4567, image: "https://picsum.photos/seed/fresh5/400/400", rocketDelivery: true, freeShipping: true },
  { id: 30, name: "Greek Yogurt Natural Plain 1kg No Sugar Added", price: "$5.99", originalPrice: "$8.99", discount: "33%", rating: 4.4, reviews: 2890, image: "https://picsum.photos/seed/fresh6/400/400", rocketDelivery: true },
]

export const electronicsProducts: Product[] = [
  { id: 31, name: "Wireless Mouse Ergonomic Silent Click 2.4G USB", price: "$14.99", originalPrice: "$24.99", discount: "40%", rating: 4.5, reviews: 3456, image: "https://picsum.photos/seed/elec1/400/400", rocketDelivery: true, freeShipping: true },
  { id: 32, name: "Mechanical Keyboard RGB Backlit Gaming 104 Keys", price: "$49.99", originalPrice: "$89.99", discount: "44%", rating: 4.7, reviews: 5678, image: "https://picsum.photos/seed/elec2/400/400", rocketDelivery: true, freeShipping: true, badge: "HOT" },
  { id: 33, name: "Webcam HD 1080p with Microphone USB Plug and Play", price: "$24.99", originalPrice: "$44.99", discount: "44%", rating: 4.4, reviews: 2345, image: "https://picsum.photos/seed/elec3/400/400", rocketDelivery: true },
  { id: 34, name: "Power Bank 20000mAh Fast Charge USB-C Portable", price: "$22.99", originalPrice: "$39.99", discount: "42%", rating: 4.6, reviews: 7890, image: "https://picsum.photos/seed/elec4/400/400", rocketDelivery: true, freeShipping: true },
  { id: 35, name: "Smart Watch Fitness Tracker Heart Rate Monitor IP68", price: "$39.99", originalPrice: "$79.99", discount: "50%", rating: 4.5, reviews: 4567, image: "https://picsum.photos/seed/elec5/400/400", rocketDelivery: true, freeShipping: true, badge: "DEAL" },
  { id: 36, name: "USB Hub 7 Port Multi Splitter High Speed Data Transfer", price: "$12.99", originalPrice: "$21.99", discount: "41%", rating: 4.3, reviews: 1234, image: "https://picsum.photos/seed/elec6/400/400", rocketDelivery: true },
]

export const homeProducts: Product[] = [
  { id: 37, name: "Scented Candle Set 3 Pack Soy Wax Natural Aroma", price: "$16.99", originalPrice: "$28.99", discount: "41%", rating: 4.6, reviews: 2345, image: "https://picsum.photos/seed/home1/400/400", rocketDelivery: true, freeShipping: true },
  { id: 38, name: "Throw Blanket Super Soft Fleece Cozy Warm 150x200cm", price: "$24.99", originalPrice: "$42.99", discount: "42%", rating: 4.7, reviews: 3456, image: "https://picsum.photos/seed/home2/400/400", rocketDelivery: true },
  { id: 39, name: "Indoor Plant Pot Ceramic Minimalist Modern Design Set", price: "$19.99", originalPrice: "$34.99", discount: "43%", rating: 4.5, reviews: 1234, image: "https://picsum.photos/seed/home3/400/400", freeShipping: true },
  { id: 40, name: "Kitchen Storage Container Set Airtight Glass 5 Pack", price: "$27.99", originalPrice: "$44.99", discount: "38%", rating: 4.8, reviews: 5678, image: "https://picsum.photos/seed/home4/400/400", rocketDelivery: true, freeShipping: true, badge: "BEST" },
  { id: 41, name: "Bath Towel Set 100% Cotton Soft Absorbent 4 Piece", price: "$22.99", originalPrice: "$38.99", discount: "41%", rating: 4.4, reviews: 2678, image: "https://picsum.photos/seed/home5/400/400", rocketDelivery: true },
  { id: 42, name: "Wall Clock Modern Minimalist Design Silent Non-Ticking", price: "$18.99", originalPrice: "$32.99", discount: "42%", rating: 4.3, reviews: 890, image: "https://picsum.photos/seed/home6/400/400", freeShipping: true },
]

export const goldBoxDeals: Product[] = [
  { id: 43, name: "Robot Vacuum Cleaner Smart Mapping Auto Charging", price: "$129.99", originalPrice: "$299.99", discount: "57%", rating: 4.6, reviews: 4567, image: "https://picsum.photos/seed/gold1/400/400", rocketDelivery: true, freeShipping: true, badge: "MEGA DEAL" },
  { id: 44, name: "Air Fryer Digital 5.5L Large Capacity Oil-Free Cooking", price: "$59.99", originalPrice: "$119.99", discount: "50%", rating: 4.7, reviews: 8901, image: "https://picsum.photos/seed/gold2/400/400", rocketDelivery: true, freeShipping: true },
  { id: 45, name: "Electric Toothbrush Sonic Rechargeable 5 Modes IPX7", price: "$24.99", originalPrice: "$54.99", discount: "55%", rating: 4.5, reviews: 3456, image: "https://picsum.photos/seed/gold3/400/400", rocketDelivery: true },
  { id: 46, name: "Laptop Stand Adjustable Aluminum Ergonomic Riser", price: "$19.99", originalPrice: "$39.99", discount: "50%", rating: 4.4, reviews: 2345, image: "https://picsum.photos/seed/gold4/400/400", rocketDelivery: true, freeShipping: true },
  { id: 47, name: "Coffee Machine Espresso Maker 15 Bar Pump Pressure", price: "$89.99", originalPrice: "$179.99", discount: "50%", rating: 4.8, reviews: 5678, image: "https://picsum.photos/seed/gold5/400/400", rocketDelivery: true, freeShipping: true, badge: "BEST DEAL" },
  { id: 48, name: "Massage Gun Deep Tissue 6 Heads 30 Speed Levels", price: "$44.99", originalPrice: "$99.99", discount: "55%", rating: 4.6, reviews: 3456, image: "https://picsum.photos/seed/gold6/400/400", rocketDelivery: true },
]
