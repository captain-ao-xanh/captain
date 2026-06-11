// app.js

// --- TIỆN ÍCH ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const renderStars = (rating) => {
    let starsHtml = '';
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for(let i = 0; i < full; i++) starsHtml += `<i class="fa-solid fa-star"></i>`;
    if(half) starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`;
    return `<span class="text-yellow-400 text-xs">${starsHtml}</span> <span class="text-gray-500 text-xs">(${rating})</span>`;
};

const badgeMap = {
    hot: "🔥 HOT", best_seller: "👑 BÁN CHẠY", new: "✨ MỚI", sale: "⚡ SALE",
    limited: "⏳ GIỚI HẠN", trending: "📈 XU HƯỚNG", featured: "⭐ NỔI BẬT", premium: "💎 CAO CẤP"
};

const renderBadges = (badges) => {
    return badges.map(b => `<span class="badge-${b} text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm uppercase">${badgeMap[b]}</span>`).join('');
};

// Component thẻ sản phẩm tối ưu Affiliate (CTR)
const createProductCard = (product) => {
    const isShopee = product.affiliatePlatform === 'shopee';
    const btnColor = isShopee ? 'bg-shopee hover:bg-orange-600' : 'bg-tiktok hover:bg-gray-800';
    const iconPlatform = isShopee ? '<i class="fa-solid fa-bag-shopping"></i>' : '<i class="fa-brands fa-tiktok"></i>';
    const platformName = isShopee ? 'Shopee' : 'TikTok Shop';

    // Tính % giảm giá
    let discountTag = '';
    if (product.originalPrice > product.price) {
        const percent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        discountTag = `<div class="absolute top-0 right-0 bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-bl-lg">-${percent}%</div>`;
    }

    return `
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-50 group">
            <div class="relative overflow-hidden aspect-[4/5]">
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                ${discountTag}
                <div class="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    ${renderBadges(product.badges)}
                </div>
            </div>
            
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2" title="${product.name}">${product.name}</h3>
                <div class="flex items-center gap-2 mb-2">
                    ${renderStars(product.rating)}
                    <span class="text-xs text-gray-400">| Đã bán ${new Intl.NumberFormat('vi-VN').format(product.sold)}</span>
                </div>
                
                <div class="mt-auto mb-4">
                    <div class="flex items-baseline gap-2">
                        <span class="text-lg font-extrabold text-red-500">${formatCurrency(product.price)}</span>
                        ${product.originalPrice > product.price ? `<span class="text-xs text-gray-400 line-through">${formatCurrency(product.originalPrice)}</span>` : ''}
                    </div>
                </div>

                <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="w-full ${btnColor} text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-md">
                    ${iconPlatform} ${platformName}
                </a>
            </div>
        </div>
    `;
};


// --- RENDER DỮ LIỆU TĨNH ---
const initUI = () => {
    // Banner & Info
    document.getElementById('hero-title').innerText = shopData.info.name;
    document.getElementById('hero-slogan').innerText = shopData.info.slogan;
    document.getElementById('hero-img').src = shopData.info.banner;

    // Filter Options
    const catFilter = document.getElementById('category-filter');
    catFilter.innerHTML = `<option value="all">Tất cả danh mục</option>` + 
        shopData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    // Render các Section Nổi Bật theo Badge
    const badgeSectionsConfig = [
        { id: 'featured', title: 'Sản Phẩm Nổi Bật ⭐', bg: 'bg-white' },
        { id: 'hot', title: 'Đang Hot 🔥', bg: 'bg-gray-50' },
        { id: 'sale', title: 'Siêu Sale Giảm Giá ⚡', bg: 'bg-white' }
    ];

    let dynamicHtml = '';
    badgeSectionsConfig.forEach(section => {
        const items = shopData.products.filter(p => p.badges.includes(section.id)).slice(0, 4); // Lấy 4 item đầu
        if (items.length > 0) {
            dynamicHtml += `
            <section id="${section.id}-section" class="py-12 ${section.bg}">
                <div class="container mx-auto px-4">
                    <div class="flex justify-between items-end mb-6">
                        <h2 class="text-2xl md:text-3xl font-bold text-gray-800">${section.title}</h2>
                        <a href="#all-products-section" onclick="document.getElementById('badge-filter').value='${section.id}'; updateProductList();" class="text-primary hover:underline text-sm font-semibold">Xem tất cả <i class="fa-solid fa-arrow-right text-xs"></i></a>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        ${items.map(p => createProductCard(p)).join('')}
                    </div>
                </div>
            </section>`;
        }
    });
    document.getElementById('dynamic-badge-sections').innerHTML = dynamicHtml;
};

// --- XỬ LÝ LỌC, TÌM KIẾM, SẮP XẾP ---
let currentProducts = [...shopData.products];
let currentPage = 1;
const itemsPerPage = 12;

const elements = {
    container: document.getElementById('all-products-container'),
    pagination: document.getElementById('pagination-container'),
    search: document.getElementById('search-input'),
    platform: document.getElementById('platform-filter'),
    category: document.getElementById('category-filter'),
    badge: document.getElementById('badge-filter'),
    sort: document.getElementById('sort-filter')
};

const updateProductList = () => {
    const keyword = elements.search.value.toLowerCase().trim();
    const platVal = elements.platform.value;
    const catVal = elements.category.value;
    const badgeVal = elements.badge.value;
    const sortVal = elements.sort.value;

    let filtered = shopData.products.filter(p => {
        const matchName = p.name.toLowerCase().includes(keyword);
        const matchPlat = platVal === 'all' || p.affiliatePlatform === platVal;
        const matchCat = catVal === 'all' || p.categoryId == catVal;
        const matchBadge = badgeVal === 'all' || p.badges.includes(badgeVal);
        return matchName && matchPlat && matchCat && matchBadge;
    });

    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortVal === 'sold-desc') filtered.sort((a, b) => b.sold - a.sold);
    else if (sortVal === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

    currentProducts = filtered;
    currentPage = 1; 
    renderPaginated();
};

const renderPaginated = () => {
    if (currentProducts.length === 0) {
        elements.container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-300">Không tìm thấy deal nào phù hợp với bộ lọc của bạn.</div>`;
        elements.pagination.innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = currentProducts.slice(start, start + itemsPerPage);
    elements.container.innerHTML = paginatedItems.map(p => createProductCard(p)).join('');
    
    // Pagination Controls
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    let btns = `<button onclick="changePage(${currentPage - 1})" class="px-4 py-2 border border-gray-200 bg-white rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary transition'}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        // Rút gọn hiển thị số trang nếu quá dài
        if (totalPages > 5 && i !== 1 && i !== totalPages && Math.abs(currentPage - i) > 1) {
            if (i === 2 || i === totalPages - 1) btns += `<span class="px-2 text-gray-400">...</span>`;
            continue;
        }
        const activeClass = i === currentPage ? "bg-primary text-white border-primary shadow-md" : "bg-white border-gray-200 hover:border-primary hover:text-primary text-gray-600";
        btns += `<button onclick="changePage(${i})" class="w-10 h-10 border rounded-lg font-bold transition ${activeClass}">${i}</button>`;
    }

    btns += `<button onclick="changePage(${currentPage + 1})" class="px-4 py-2 border border-gray-200 bg-white rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary transition'}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;

    elements.pagination.innerHTML = btns;
};

window.changePage = (page) => {
    currentPage = page;
    renderPaginated();
    document.getElementById('all-products-section').scrollIntoView({ behavior: 'smooth' });
};

// --- EVENTS ---
['search', 'platform', 'category', 'badge', 'sort'].forEach(id => {
    elements[id].addEventListener(id === 'search' ? 'input' : 'change', updateProductList);
});

// Back To Top
const backToTopBtn = document.getElementById("back-to-top");
window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
    } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
    }
});
backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initUI();
    updateProductList();
});