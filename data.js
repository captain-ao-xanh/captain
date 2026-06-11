// data.js

const shopData = {
    info: {
        name: "Captain Áo Xanh",
        slogan: "Săn Deal Thời Trang Xịn - Giá Tận Gốc",
        banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
        email: "contact@captainaoxanh.com"
    },
    
    categories: [
        { id: 1, name: "Áo Thun Nam Nữ", icon: "fa-shirt" },
        { id: 2, name: "Áo Sơ Mi", icon: "fa-user-tie" },
        { id: 3, name: "Áo Khoác", icon: "fa-vest" },
        { id: 4, name: "Quần Jeans", icon: "fa-viadeo" },
        { id: 5, name: "Hoodie & Sweater", icon: "fa-mitten" },
        { id: 6, name: "Quần Short", icon: "fa-person-running" },
        { id: 7, name: "Phụ Kiện (Mũ, Ví)", icon: "fa-hat-cowboy" },
        { id: 8, name: "Giày Sneaker", icon: "fa-shoe-prints" }
    ],

    reviews: [
        { id: 1, name: "Tuấn Anh", rating: 5, text: "Website tổng hợp deal ngon quá, mình săn được áo khoác bên Shopee rẻ hơn hẳn." },
        { id: 2, name: "Ngọc Diệp", rating: 5, text: "Thích cách phân loại sản phẩm, click qua TikTok Shop mua cực tiện." },
        { id: 3, name: "Hải Đăng", rating: 4.5, text: "Nhiều sản phẩm xịn, rate sao rất chuẩn xác. Sẽ ủng hộ web dài dài." }
    ],

    // Dữ liệu sản phẩm sẽ được gen tự động qua hàm bên dưới
    products: []
};

// Hàm tự động sinh 60 sản phẩm đa dạng cho hệ thống Affiliate
const generateAffiliateProducts = () => {
    const images = [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        "https://images.unsplash.com/photo-1596755094514-f87e32f85e23?w=500&q=80",
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80",
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80",
        "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&q=80",
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500&q=80",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80"
    ];

    const platforms = ["shopee", "tiktok"];
    const allBadges = ["hot", "best_seller", "new", "sale", "limited", "trending", "featured", "premium"];

    for (let i = 1; i <= 60; i++) {
        const catId = (i % 8) + 1;
        const basePrice = (Math.floor(Math.random() * 50) + 10) * 10000; // Giá từ 100k - 600k
        const isSale = Math.random() > 0.3; // 70% có giảm giá
        const price = isSale ? basePrice * (Math.floor(Math.random() * 40 + 50) / 100) : basePrice; // Giảm 10-50%
        
        // Random 1 đến 3 badges
        const shuffledBadges = allBadges.sort(() => 0.5 - Math.random());
        const productBadges = shuffledBadges.slice(0, Math.floor(Math.random() * 3) + 1);
        
        // Gắn cứng badge sale nếu có giảm giá
        if (isSale && !productBadges.includes("sale")) productBadges.push("sale");

        shopData.products.push({
            id: i,
            name: `${shopData.categories[catId-1].name} Cao Cấp Mẫu ${i}`,
            price: Math.floor(price),
            originalPrice: basePrice,
            image: images[catId - 1],
            categoryId: catId,
            description: "Thiết kế trẻ trung, chất liệu thoáng mát, form dáng chuẩn phong cách Hàn Quốc.",
            sold: Math.floor(Math.random() * 15000) + 100,
            rating: (Math.random() * 1 + 4).toFixed(1), // Rate 4.0 - 5.0
            affiliatePlatform: platforms[Math.floor(Math.random() * platforms.length)],
            affiliateUrl: "https://google.com?q=affiliate-link-mock", // Thay bằng link tracking thực tế
            badges: productBadges
        });
    }
};

generateAffiliateProducts();