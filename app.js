// app.js

// Biến lưu trữ data toàn cục sau khi tải từ file JSON
let shopData = {};
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 12;

const renderStars = (rating) => {
    let starsHtml = '';
    const full = Math.floor(rating);
    const half = rating % 1 !== 0;
    for(let i = 0; i < full; i++) starsHtml += `<i class="fa-solid fa-star"></i>`;
    if(half) starsHtml += `<i class="fa-solid fa-star-half-stroke"></i>`;
    return `<span class="text-yellow-400 text-xs">${starsHtml}</span> <span class="text-gray-500 text-xs">(${rating})</span>`;
};

const badgeConfig = {
    hot: { text: "HOT", icon: "fa-fire", style: "bg-gradient-to-r from-red-500 to-orange-500 text-white" },
    best_seller: { text: "BÁN CHẠY", icon: "fa-crown", style: "bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-gray-900" },
    new: { text: "MỚI", icon: "fa-wand-magic-sparkles", style: "bg-gradient-to-r from-emerald-500 to-teal-400 text-white" },
    sale: { text: "SIÊU SALE", icon: "fa-bolt", style: "bg-gradient-to-r from-pink-500 to-rose-500 text-white" },
    limited: { text: "GIỚI HẠN", icon: "fa-hourglass-half", style: "bg-gradient-to-r from-gray-800 to-gray-600 text-white" },
    trending: { text: "XU HƯỚNG", icon: "fa-arrow-trend-up", style: "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white" },
    featured: { text: "NỔI BẬT", icon: "fa-star", style: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white" },
    premium: { text: "CAO CẤP", icon: "fa-gem", style: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" }
};

const renderBadges = (badges) => {
    if(!badges || badges.length === 0) return '';
    const b = badges[0];
    const config = badgeConfig[b];
    if(!config) return '';
    
    return `<div class="${config.style} text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-br-xl rounded-tl-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                <i class="fa-solid ${config.icon} animate-pulse"></i> ${config.text}
            </div>`;
};

const createProductCard = (product) => {
    const isShopee = product.affiliatePlatform === 'shopee';
    const btnColor = isShopee ? 'bg-shopee hover:bg-orange-600' : 'bg-tiktok hover:bg-gray-800';
    const iconPlatform = isShopee ? '<i class="fa-solid fa-bag-shopping"></i>' : '<i class="fa-brands fa-tiktok"></i>';

    return `
        <div class="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)] transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group relative">
            <div class="relative overflow-hidden aspect-[4/5]">
                <img src="${product.image}" alt="${product.name}" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-0 left-0">
                    ${renderBadges(product.badges)}
                </div>
            </div>
            
            <div class="p-4 flex flex-col flex-1">
                <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2" title="${product.name}">${product.name}</h3>
                <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="w-full mt-auto ${btnColor} text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition transform active:scale-95 shadow-md">
                    ${iconPlatform} Xem chi tiết
                </a>
            </div>
        </div>
    `;
};

const initUI = () => {
    document.getElementById('hero-title').innerText = shopData.info.name;
    document.getElementById('hero-slogan').innerText = shopData.info.slogan;
    document.getElementById('hero-img').src = shopData.info.banner;

    const catFilter = document.getElementById('category-filter');
    if(catFilter) {
        catFilter.innerHTML = `<option value="all">Tất cả danh mục</option>` + 
            shopData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }

    const badgeSectionsConfig = [
        { id: 'featured', title: 'Sản Phẩm Nổi Bật ⭐', bg: 'bg-white' },
        { id: 'hot', title: 'Đang Hot 🔥', bg: 'bg-gray-50' },
        { id: 'sale', title: 'Siêu Sale Giảm Giá ⚡', bg: 'bg-white' }
    ];

    let dynamicHtml = '';
    badgeSectionsConfig.forEach(section => {
        const items = shopData.products.filter(p => p.badges.includes(section.id)).slice(0, 4);
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
    
    const dynamicSections = document.getElementById('dynamic-badge-sections');
    if(dynamicSections) dynamicSections.innerHTML = dynamicHtml;
};

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
    const keyword = elements.search ? elements.search.value.toLowerCase().trim() : '';
    const platVal = elements.platform ? elements.platform.value : 'all';
    const catVal = elements.category ? elements.category.value : 'all';
    const badgeVal = elements.badge ? elements.badge.value : 'all';
    const sortVal = elements.sort ? elements.sort.value : '';

    let filtered = shopData.products.filter(p => {
        const matchName = p.name.toLowerCase().includes(keyword);
        const matchPlat = platVal === 'all' || p.affiliatePlatform === platVal;
        const matchCat = catVal === 'all' || p.categoryId == catVal;
        const matchBadge = badgeVal === 'all' || p.badges.includes(badgeVal);
        return matchName && matchPlat && matchCat && matchBadge;
    });

    // Vẫn giữ lại thuật toán sắp xếp theo giá ngầm bên dưới nếu trong file HTML bạn vẫn dùng bộ lọc này
    if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    else if (sortVal === 'sold-desc') filtered.sort((a, b) => b.sold - a.sold);
    else if (sortVal === 'rating-desc') filtered.sort((a, b) => b.rating - a.rating);

    currentProducts = filtered;
    currentPage = 1; 
    renderPaginated();
};

const renderPaginated = () => {
    if (!elements.container) return;
    
    if (currentProducts.length === 0) {
        elements.container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500 font-medium bg-gray-50 rounded-2xl border border-dashed border-gray-300">Không tìm thấy deal nào phù hợp với bộ lọc của bạn.</div>`;
        elements.pagination.innerHTML = '';
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const paginatedItems = currentProducts.slice(start, start + itemsPerPage);
    elements.container.innerHTML = paginatedItems.map(p => createProductCard(p)).join('');
    
    const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
    if (totalPages <= 1) {
        elements.pagination.innerHTML = '';
        return;
    }

    let btns = `<button onclick="changePage(${currentPage - 1})" class="px-4 py-2 border border-gray-200 bg-white rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary transition'}" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 5 && i !== 1 && i !== totalPages && Math.abs(currentPage - i) > 1) {
            if (i === 2 || i === totalPages - 1) btns += `<span class="px-2 text-gray-400">...</span>`;
            continue;
        }
        const activeClass = i === currentPage ? "bg-primary text-white border-primary shadow-md" : "bg-white border-gray-200 hover:border-primary hover:text-primary text-gray-600";
        btns += `<button onclick="changePage(${i})" class="w-10 h-10 border rounded-lg font-bold transition ${activeClass}">${i}</button>`;
    }

    btns += `<button onclick="changePage(${currentPage + 1})" class="px-4 py-2 border border-gray-200 bg-white rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:text-primary transition'}" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;

    if(elements.pagination) elements.pagination.innerHTML = btns;
};

window.changePage = (page) => {
    currentPage = page;
    renderPaginated();
    const section = document.getElementById('all-products-section');
    if(section) section.scrollIntoView({ behavior: 'smooth' });
};

['search', 'platform', 'category', 'badge', 'sort'].forEach(id => {
    if(elements[id]) {
        elements[id].addEventListener(id === 'search' ? 'input' : 'change', updateProductList);
    }
});

const backToTopBtn = document.getElementById("back-to-top");
if(backToTopBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
        } else {
            backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
        }
    });
    backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Fetch dữ liệu từ file JSON
document.addEventListener('DOMContentLoaded', () => {
    fetch('shop_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Không thể tải file dữ liệu JSON");
            }
            return response.json();
        })
        .then(data => {
            shopData = data;
            currentProducts = [...shopData.products];
            
            initUI();
            updateProductList();
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu:", error);
            if(document.getElementById('all-products-container')) {
                document.getElementById('all-products-container').innerHTML = `<p class="text-red-500 text-center col-span-full">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng chạy dự án trên Local Server.</p>`;
            }
        });
});