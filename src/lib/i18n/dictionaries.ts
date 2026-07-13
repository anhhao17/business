// Bilingual UI dictionary (English + Vietnamese).
// Keys are grouped by section for maintainability.
// Product/blog *content* is stored as-entered in the DB/demo data; only
// chrome/UI strings are translated here.

export type Lang = "en" | "vi";

export const LANGS: Lang[] = ["en", "vi"];
export const DEFAULT_LANG: Lang = "vi";
export const LANG_COOKIE = "oc-lang";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  vi: "Tiếng Việt",
};

export const LANG_SHORT: Record<Lang, string> = {
  en: "EN",
  vi: "VI",
};

type Dict = Record<string, string>;

const en: Dict = {
  // Brand / generic
  "brand.name": "OceanCatch",
  "brand.suffix": "Catch",
  "common.viewAll": "View all",
  "common.shopAll": "Shop all",
  "common.readMore": "Read more",
  "common.readArticle": "Read article",
  "common.keepReading": "Keep reading",
  "common.allArticles": "All articles",
  "common.backToStore": "← Back to store",
  "common.backToHome": "Back to home",
  "common.continueShopping": "Continue shopping",
  "common.clearFilters": "Clear filters",
  "common.soldOut": "Sold out",
  "common.fresh": "Fresh",
  "common.frozen": "Frozen",
  "common.frozenAtSea": "Frozen at sea",
  "common.featured": "Featured",
  "common.inStock": "In stock",
  "common.view": "View →",
  "common.results": "result",
  "common.resultsPlural": "results",
  "common.showing": "Showing",
  "common.noResults": "No seafood found",
  "common.tryDifferent": "Try a different search or browse all products.",
  "common.items": "items",
  "common.item": "item",
  "common.qty": "Qty",
  "common.rating": "rating",
  "common.added": "Added",
  "common.quickAdd": "Quick add",
  "common.decrease": "Decrease quantity",
  "common.increase": "Increase quantity",
  "common.remove": "Remove",
  "common.removeitem": "Remove item",
  "common.closeCart": "Close cart",
  "common.empty": "Your cart is empty",
  "common.emptyHint": "Browse the freshest catch of the day.",
  "common.shopSeafood": "Shop seafood",
  "common.shopSeafoodCta": "Shop fresh seafood",
  "common.subtotal": "Subtotal",
  "common.shipping": "Shipping",
  "common.shippingHint": "Shipping & taxes calculated at checkout.",
  "common.free": "Free",
  "common.freeOver": "Free over $75",
  "common.estimatedTotal": "Estimated total",
  "common.total": "Total",
  "common.checkout": "Checkout",
  "common.yourCatch": "Your catch",
  "common.openCart": "Open cart",
  "common.toggleMenu": "Toggle menu",
  "common.cancel": "Cancel",
  "common.delete": "Delete",
  "common.save": "Save",
  "common.saving": "Saving…",
  "common.loading": "Loading…",
  "common.signIn": "Sign in",
  "common.signOut": "Sign out",

  // Nav
  "nav.home": "Home",
  "nav.shop": "Shop",
  "nav.blog": "Recipes & Guides",
  "nav.contact": "Contact",
  "nav.admin": "Admin",

  // Hero
  "hero.eyebrow": "Dock to door, overnight",
  "hero.title1": "The ocean's best,",
  "hero.title2": "on your table tomorrow.",
  "hero.body":
    "Wild-caught and sustainably farmed seafood, hand-selected at the dock and shipped overnight on ice. Restaurant quality, home-cooked in minutes.",
  "hero.ctaShop": "Shop fresh seafood",
  "hero.ctaBlog": "Recipes & guides",
  "hero.trust.shipping": "Overnight shipping",
  "hero.trust.freshness": "Freshness guaranteed",
  "hero.trust.sustainable": "Sustainably sourced",

  // Home — categories
  "home.categories.eyebrow": "Shop by category",
  "home.categories.title": "Find your favorite catch",

  // Home — featured
  "home.featured.eyebrow": "Catch of the day",
  "home.featured.title": "Featured seafood",
  "home.featured.body":
    "Hand-picked favorites from this week's landing at the dock.",

  // Home — value props
  "home.value.dock.title": "From the dock, not the warehouse",
  "home.value.dock.body":
    "We buy direct from day-boat fishermen and trusted aquaculture farms — no middlemen, no mystery sourcing.",
  "home.value.cold.title": "Packed cold, shipped overnight",
  "home.value.cold.body":
    "Every order is hand-packed with gel ice and insulated liners, then rushed to your door overnight in the contiguous US.",
  "home.value.guarantee.title": "Freshness, guaranteed",
  "home.value.guarantee.body":
    "If it doesn't arrive pristine, we'll refund or replace it — no questions, no hassle.",

  // Home — blog teaser
  "home.blog.eyebrow": "From the galley",
  "home.blog.title": "Recipes & guides",

  // Home — CTA
  "home.cta.title": "Tonight's dinner, straight from the sea",
  "home.cta.body":
    "Order by 2pm and your seafood ships today, arriving tomorrow on ice. Restaurant quality, ready to cook.",
  "home.cta.shop": "Start shopping",
  "home.cta.talk": "Talk to a fishmonger",

  // Footer
  "footer.tagline":
    "Premium wild-caught and sustainably farmed seafood, shipped overnight from the dock to your door. Trusted by home chefs and restaurants since 2014.",
  "footer.shop": "Shop",
  "footer.shop.all": "All products",
  "footer.shop.fish": "Fresh fish",
  "footer.shop.crab": "Crab & lobster",
  "footer.shop.specialty": "Caviar & specialty",
  "footer.getInTouch": "Get in touch",
  "footer.rights": "All rights reserved.",
  "footer.chip.shipping": "Overnight shipping",
  "footer.chip.dock": "Dock-fresh",
  "footer.chip.sustainable": "Sustainable",

  // Products page
  "products.market": "Market",
  "products.all": "All seafood",
  "products.allDesc":
    "Browse our full selection of dock-fresh seafood, shipped overnight on ice.",
  "products.search": "Search salmon, scallops, lobster…",
  "products.searchBtn": "Search",
  "products.noResults": "No seafood found",
  "products.noResultsHint": "Try a different search or browse all products.",

  // Product detail
  "product.addToCart": "Add to cart",
  "product.addNtoCart": "Add {n} to cart",
  "product.youMightLike": "You might also like",
  "product.perks.overnight": "Overnight",
  "product.perks.overnightBody": "Ships today if ordered by 2pm",
  "product.perks.cold": "Packed cold",
  "product.perks.coldBody": "Gel ice + insulated liner",
  "product.perks.guarantee": "Guaranteed",
  "product.perks.guaranteeBody": "Arrives fresh or it's free",
  "product.noImage": "No image",

  // Cart page
  "cart.title": "Your cart",
  "cart.empty": "Your cart is empty",
  "cart.orderSummary": "Order summary",

  // Checkout
  "checkout.title": "Checkout",
  "checkout.demoNote": "Demo checkout — no real payment is processed.",
  "checkout.contactShipping": "Contact & shipping",
  "checkout.fullName": "Full name",
  "checkout.email": "Email",
  "checkout.phone": "Phone",
  "checkout.address": "Address",
  "checkout.orderNote": "Order note (optional)",
  "checkout.orderNotePlaceholder": "Delivery instructions, gift message…",
  "checkout.payment": "Payment",
  "checkout.paymentNote":
    "This is a demo store — no card is charged. Plug in Stripe or your processor here for production.",
  "checkout.cardNumber": "Card number",
  "checkout.expiry": "Expiry",
  "checkout.cvc": "CVC",
  "checkout.placeOrder": "Place order",
  "checkout.placing": "Placing order…",
  "checkout.placed": "Order placed!",
  "checkout.placedBody":
    "Thanks for your order. We've sent a confirmation to your email and your seafood will ship overnight on ice.",
  "checkout.orderRef": "Order reference",
  "checkout.keepShopping": "Keep shopping",
  "checkout.empty": "Your cart is empty",

  // Contact
  "contact.eyebrow": "We're here to help",
  "contact.title": "Talk to a fishmonger",
  "contact.body":
    "Questions about sourcing, a custom order for a dinner party, or restaurant wholesale? Send us a note and we'll reply within one business day.",
  "contact.reachUs": "Reach us",
  "contact.email": "Email",
  "contact.phone": "Phone",
  "contact.pier": "Pier",
  "contact.orderCutoff": "Order cutoff",
  "contact.cutoffBody": "Order by 2pm ET for same-day overnight shipping.",
  "contact.name": "Name",
  "contact.subject": "Subject",
  "contact.message": "Message",
  "contact.send": "Send message",
  "contact.sending": "Sending…",
  "contact.sent": "Message sent!",
  "contact.sentBody": "Thanks for reaching out — we'll get back to you shortly.",
  "contact.sendAnother": "Send another",
  "contact.namePlaceholder": "Your name",
  "contact.emailPlaceholder": "you@example.com",
  "contact.subjectPlaceholder": "How can we help?",
  "contact.messagePlaceholder": "Tell us what you need…",

  // Blog
  "blog.eyebrow": "From the galley",
  "blog.title": "Recipes & guides",
  "blog.body":
    "Techniques, sourcing stories, and recipes to help you make the most of every catch.",
  "blog.featured": "Featured",
  "blog.none": "No articles yet — check back soon.",

  // 404
  "404.title": "404",
  "404.body": "This page drifted out to sea. Let's get you back to shore.",

  // Admin
  "admin.signedInAs": "Signed in as",
  "admin.demoMode": "Demo mode",
  "admin.dashboard": "Dashboard",
  "admin.products": "Products",
  "admin.blog": "Blog",
  "admin.orders": "Orders",
  "admin.messages": "Messages",
  "admin.welcome": "Welcome back. Here's what's happening in your store.",
  "admin.addProduct": "Add product",
  "admin.demoWarning":
    "Demo mode: Supabase isn't configured, so new products, orders, and messages are stored in memory and reset on server restart. Add your Supabase keys to .env to persist data. See README.md.",
  "admin.stat.products": "Products",
  "admin.stat.orders": "Orders",
  "admin.stat.posts": "Blog posts",
  "admin.stat.messages": "Messages",
  "admin.stat.pending": "pending",
  "admin.stat.unread": "unread",
  "admin.revenue": "Total revenue (all orders)",
  "admin.recentOrders": "Recent orders",
  "admin.customer": "Customer",
  "admin.total": "Total",
  "admin.status": "Status",
  "admin.date": "Date",
  "admin.viewAll": "View all",
  "admin.tip": "Tip: customers can find products by name or origin on the shop page.",
  "admin.login.title": "Admin sign in",
  "admin.login.subtitle": "Manage products, orders, and content.",
  "admin.login.invalid": "Invalid credentials. Please try again.",
  "admin.login.demoPassword": "Demo password",
  "admin.login.demoHint":
    "Demo mode — password is {pw}. Set ADMIN_PASSWORD in your env to change it.",
  "admin.login.password": "Password",
  "admin.products.title": "Products",
  "admin.products.add": "Add product",
  "admin.products.new": "Add a new product",
  "admin.products.newHint": "Fill in the details and upload an image. It goes live immediately.",
  "admin.products.edit": "Edit product",
  "admin.products.editHint": "Update details, swap the image, or change availability.",
  "admin.products.none": "No products yet.",
  "admin.products.addFirst": "Add your first product",
  "admin.products.category": "Category",
  "admin.products.price": "Price",
  "admin.products.status": "Status",
  "admin.products.added": "Added",
  "admin.products.actions": "Actions",
  "admin.products.deleteConfirm": "Delete \"{name}\"?",
  "admin.products.new.title": "New product",
  "admin.products.name": "Name",
  "admin.products.description": "Description",
  "admin.products.priceUsd": "Price (USD)",
  "admin.products.unit": "Unit",
  "admin.products.origin": "Origin",
  "admin.products.ratingOpt": "Rating (optional)",
  "admin.products.image": "Product image",
  "admin.products.upload": "Upload",
  "admin.products.imageHint":
    "PNG, JPEG, WebP, or GIF. Max 6MB. Leave empty to keep the existing image.",
  "admin.products.toggleFresh": "Fresh (vs frozen)",
  "admin.products.toggleFeatured": "Featured on homepage",
  "admin.products.toggleStock": "In stock",
  "admin.products.save": "Save changes",
  "admin.products.create": "Create product",
  "admin.blog.title": "Blog",
  "admin.blog.add": "New article",
  "admin.blog.new": "New article",
  "admin.blog.newHint": "Write a recipe, guide, or sourcing story in markdown.",
  "admin.blog.edit": "Edit article",
  "admin.blog.editHint": "Update the title, body, or publishing status.",
  "admin.blog.none": "No articles yet.",
  "admin.blog.addFirst": "Write your first article",
  "admin.blog.writeFirst": "Write your first article",
  "admin.blog.publishedAt": "Published",
  "admin.blog.author": "Author",
  "admin.blog.titleField": "Title",
  "admin.blog.excerpt": "Excerpt",
  "admin.blog.excerptPlaceholder": "A one-line summary shown on cards.",
  "admin.blog.coverUrl": "Cover image URL",
  "admin.blog.body": "Body (Markdown)",
  "admin.blog.bodyHint":
    "Supports # headings, **bold**, *italic*, `code`, - lists, > quotes, [links](url).",
  "admin.blog.published": "Published",
  "admin.blog.publish": "Publish",
  "admin.blog.draft": "Draft",
  "admin.orders.title": "Orders",
  "admin.orders.none": "No orders yet. Place a test order from the checkout.",
  "admin.orders.contact": "Contact",
  "admin.orders.items": "Items",
  "admin.orders.note": "Note:",
  "admin.orders.reply": "Reply by email",
  "admin.contact": "Contact",
  "admin.shipping": "Shipping address",
  "admin.note": "Note",
  "admin.items": "Items",
  "admin.messages.title": "Messages",
  "admin.messages.none": "No messages yet. Send a test from the contact page.",
  "admin.messages.new": "New",

  // Status badges
  "status.pending": "pending",
  "status.paid": "paid",
  "status.shipped": "shipped",
  "status.delivered": "delivered",
  "status.cancelled": "cancelled",

  // Catch of the Day
  "catch.title": "Catch of the Day",
  "catch.endsIn": "Offer ends in",
  "catch.grab": "Grab it",

  // Marquee items
  "marquee.fresh": "Fresh from the dock",
  "marquee.sustainable": "Sustainable sourcing",
  "marquee.cold": "Cold chain guaranteed",
  "marquee.dock24": "Dock to door in 24h",
  "marquee.wild": "Wild caught",
  "marquee.daily": "Ocean fresh daily",
  "marquee.premium": "Premium grade seafood",
  "marquee.harvested": "Responsibly harvested",

  // Stats
  "stats.orders": "Orders shipped",
  "stats.dock": "Dock to door",
  "stats.cold": "Cold chain",
  "stats.quality": "Quality guaranteed",
};

const vi: Dict = {
  // Brand / generic
  "brand.name": "OceanCatch",
  "brand.suffix": "Catch",
  "common.viewAll": "Xem tất cả",
  "common.shopAll": "Mua tất cả",
  "common.readMore": "Đọc thêm",
  "common.readArticle": "Đọc bài viết",
  "common.keepReading": "Đọc tiếp",
  "common.allArticles": "Tất cả bài viết",
  "common.backToStore": "← Về cửa hàng",
  "common.backToHome": "Về trang chủ",
  "common.continueShopping": "Tiếp tục mua sắm",
  "common.clearFilters": "Xóa bộ lọc",
  "common.soldOut": "Hết hàng",
  "common.fresh": "Tươi",
  "common.frozen": "Đông lạnh",
  "common.frozenAtSea": "Đông lạnh trên biển",
  "common.featured": "Nổi bật",
  "common.inStock": "Còn hàng",
  "common.view": "Xem →",
  "common.results": "kết quả",
  "common.resultsPlural": "kết quả",
  "common.showing": "Hiển thị",
  "common.noResults": "Không tìm thấy hải sản",
  "common.tryDifferent": "Thử tìm kiếm khác hoặc xem tất cả sản phẩm.",
  "common.items": "mặt hàng",
  "common.item": "mặt hàng",
  "common.qty": "SL",
  "common.rating": "đánh giá",
  "common.added": "Đã thêm",
  "common.quickAdd": "Thêm nhanh",
  "common.decrease": "Giảm số lượng",
  "common.increase": "Tăng số lượng",
  "common.remove": "Xóa",
  "common.removeitem": "Xóa mặt hàng",
  "common.closeCart": "Đóng giỏ hàng",
  "common.empty": "Giỏ hàng trống",
  "common.emptyHint": "Khám phá hải sản tươi ngon nhất hôm nay.",
  "common.shopSeafood": "Mua hải sản",
  "common.shopSeafoodCta": "Mua hải sản tươi",
  "common.subtotal": "Tạm tính",
  "common.shipping": "Vận chuyển",
  "common.shippingHint": "Phí vận chuyển & thuế tính khi thanh toán.",
  "common.free": "Miễn phí",
  "common.freeOver": "Miễn phí trên $75",
  "common.estimatedTotal": "Tổng ước tính",
  "common.total": "Tổng",
  "common.checkout": "Thanh toán",
  "common.yourCatch": "Giỏ của bạn",
  "common.openCart": "Mở giỏ hàng",
  "common.toggleMenu": "Mở menu",
  "common.cancel": "Hủy",
  "common.delete": "Xóa",
  "common.save": "Lưu",
  "common.saving": "Đang lưu…",
  "common.loading": "Đang tải…",
  "common.signIn": "Đăng nhập",
  "common.signOut": "Đăng xuất",

  // Nav
  "nav.home": "Trang chủ",
  "nav.shop": "Cửa hàng",
  "nav.blog": "Công thức & Hướng dẫn",
  "nav.contact": "Liên hệ",
  "nav.admin": "Quản trị",

  // Hero
  "hero.eyebrow": "Từ bến cá đến tận nhà, qua đêm",
  "hero.title1": "Tuyệt hảo từ đại dương,",
  "hero.title2": "ngày mai có trên bàn ăn.",
  "hero.body":
    "Hải sản đánh bắt hoang dã và nuôi bền vững, tuyển chọn tận bến cá và giao qua đêm trong đá. Chất lượng nhà hàng, nấu tại nhà trong vài phút.",
  "hero.ctaShop": "Mua hải sản tươi",
  "hero.ctaBlog": "Công thức & hướng dẫn",
  "hero.trust.shipping": "Giao qua đêm",
  "hero.trust.freshness": "Đảm bảo độ tươi",
  "hero.trust.sustainable": "Nguồn bền vững",

  // Home — categories
  "home.categories.eyebrow": "Mua theo loại",
  "home.categories.title": "Chọn món yêu thích của bạn",

  // Home — featured
  "home.featured.eyebrow": "Món ngon hôm nay",
  "home.featured.title": "Hải sản nổi bật",
  "home.featured.body": "Những món được chọn kỹ từ lô hàng cập bến tuần này.",

  // Home — value props
  "home.value.dock.title": "Từ bến cá, không qua kho trung chuyển",
  "home.value.dock.body":
    "Chúng tôi mua trực tiếp từ ngư dân ngày bến và các trại nuôi đáng tin cậy — không trung gian, không nguồn gốc mập mờ.",
  "home.value.cold.title": "Đóng gói lạnh, giao qua đêm",
  "home.value.cold.body":
    "Mỗi đơn hàng được đóng gói thủ công với đá gel và lớp cách nhiệt, sau đó giao tận nhà qua đêm.",
  "home.value.guarantee.title": "Đảm bảo độ tươi",
  "home.value.guarantee.body":
    "Nếu hàng không đến tay bạn ở trạng thái hoàn hảo, chúng tôi hoàn tiền hoặc đổi mới — không câu hỏi, không phiền phức.",

  // Home — blog teaser
  "home.blog.eyebrow": "Từ gian bếp",
  "home.blog.title": "Công thức & hướng dẫn",

  // Home — CTA
  "home.cta.title": "Bữa tối nay, tươi từ biển",
  "home.cta.body":
    "Đặt trước 2 giờ chiều để hải sản gửi đi hôm nay, đến nơi vào ngày mai trong đá. Chất lượng nhà hàng, sẵn sàng nấu.",
  "home.cta.shop": "Bắt đầu mua sắm",
  "home.cta.talk": "Trò chuyện với chuyên gia hải sản",

  // Footer
  "footer.tagline":
    "Hải sản hoang dã và nuôi bền vững cao cấp, giao qua đêm từ bến cá đến tận nhà. Tin dùng bởi đầu bếp gia đình và nhà hàng từ năm 2014.",
  "footer.shop": "Cửa hàng",
  "footer.shop.all": "Tất cả sản phẩm",
  "footer.shop.fish": "Cá tươi",
  "footer.shop.crab": "Cua & tôm hùm",
  "footer.shop.specialty": "Trứng cá & đặc sản",
  "footer.getInTouch": "Liên hệ",
  "footer.rights": "Bảo lưu mọi quyền.",
  "footer.chip.shipping": "Giao qua đêm",
  "footer.chip.dock": "Tươi từ bến",
  "footer.chip.sustainable": "Bền vững",

  // Products page
  "products.market": "Chợ",
  "products.all": "Tất cả hải sản",
  "products.allDesc":
    "Khám phá toàn bộ lựa chọn hải sản tươi từ bến, giao qua đêm trong đá.",
  "products.search": "Tìm cá hồi, sò điệp, tôm hùm…",
  "products.searchBtn": "Tìm",
  "products.noResults": "Không tìm thấy hải sản",
  "products.noResultsHint": "Thử tìm kiếm khác hoặc xem tất cả sản phẩm.",

  // Product detail
  "product.addToCart": "Thêm vào giỏ",
  "product.addNtoCart": "Thêm {n} vào giỏ",
  "product.youMightLike": "Bạn có thể thích",
  "product.perks.overnight": "Qua đêm",
  "product.perks.overnightBody": "Gửi hôm nay nếu đặt trước 2 giờ chiều",
  "product.perks.cold": "Đóng lạnh",
  "product.perks.coldBody": "Đá gel + lớp cách nhiệt",
  "product.perks.guarantee": "Đảm bảo",
  "product.perks.guaranteeBody": "Đến tươi hoặc hoàn tiền",
  "product.noImage": "Không có ảnh",

  // Cart page
  "cart.title": "Giỏ hàng của bạn",
  "cart.empty": "Giỏ hàng trống",
  "cart.orderSummary": "Tóm tắt đơn hàng",

  // Checkout
  "checkout.title": "Thanh toán",
  "checkout.demoNote": "Thanh toán thử — không có giao dịch thật.",
  "checkout.contactShipping": "Liên hệ & giao hàng",
  "checkout.fullName": "Họ và tên",
  "checkout.email": "Email",
  "checkout.phone": "Điện thoại",
  "checkout.address": "Địa chỉ",
  "checkout.orderNote": "Ghi chú đơn hàng (tùy chọn)",
  "checkout.orderNotePlaceholder": "Hướng dẫn giao hàng, lời nhắn quà…",
  "checkout.payment": "Thanh toán",
  "checkout.paymentNote":
    "Đây là cửa hàng thử — không có thẻ nào bị trừ. Tích hợp Stripe hoặc cổng thanh toán của bạn khi dùng thật.",
  "checkout.cardNumber": "Số thẻ",
  "checkout.expiry": "Hết hạn",
  "checkout.cvc": "CVC",
  "checkout.placeOrder": "Đặt hàng",
  "checkout.placing": "Đang đặt hàng…",
  "checkout.placed": "Đã đặt hàng!",
  "checkout.placedBody":
    "Cảm ơn đơn hàng của bạn. Chúng tôi đã gửi xác nhận đến email và hải sản sẽ được giao qua đêm trong đá.",
  "checkout.orderRef": "Mã đơn hàng",
  "checkout.keepShopping": "Tiếp tục mua sắm",
  "checkout.empty": "Giỏ hàng trống",

  // Contact
  "contact.eyebrow": "Chúng tôi sẵn sàng hỗ trợ",
  "contact.title": "Trò chuyện với chuyên gia hải sản",
  "contact.body":
    "Câu hỏi về nguồn gốc, đơn hàng riêng cho tiệc, hoặc giá sỉ cho nhà hàng? Gửi cho chúng tôi và sẽ trả lời trong một ngày làm việc.",
  "contact.reachUs": "Liên hệ",
  "contact.email": "Email",
  "contact.phone": "Điện thoại",
  "contact.pier": "Bến cá",
  "contact.orderCutoff": "Giờ cắt đơn",
  "contact.cutoffBody": "Đặt trước 2 giờ chiều để giao qua đêm trong ngày.",
  "contact.name": "Tên",
  "contact.subject": "Chủ đề",
  "contact.message": "Nội dung",
  "contact.send": "Gửi tin nhắn",
  "contact.sending": "Đang gửi…",
  "contact.sent": "Đã gửi tin nhắn!",
  "contact.sentBody": "Cảm ơn bạn đã liên hệ — chúng tôi sẽ phản hồi sớm.",
  "contact.sendAnother": "Gửi tiếp",
  "contact.namePlaceholder": "Tên của bạn",
  "contact.emailPlaceholder": "ban@example.com",
  "contact.subjectPlaceholder": "Chúng tôi có thể giúp gì?",
  "contact.messagePlaceholder": "Hãy cho chúng tôi biết bạn cần…",

  // Blog
  "blog.eyebrow": "Từ gian bếp",
  "blog.title": "Công thức & hướng dẫn",
  "blog.body":
    "Kỹ thuật, câu chuyện nguồn gốc, và công thức giúp bạn tận dụng tối đa từng mẻ cá.",
  "blog.featured": "Nổi bật",
  "blog.none": "Chưa có bài viết — hãy quay lại sau.",

  // 404
  "404.title": "404",
  "404.body": "Trang này đã trôi ra biển. Để chúng tôi đưa bạn về bờ.",

  // Admin
  "admin.signedInAs": "Đăng nhập bởi",
  "admin.demoMode": "Chế độ demo",
  "admin.dashboard": "Bảng điều khiển",
  "admin.products": "Sản phẩm",
  "admin.blog": "Blog",
  "admin.orders": "Đơn hàng",
  "admin.messages": "Tin nhắn",
  "admin.welcome": "Chào mừng trở lại. Đây là tình hình cửa hàng của bạn.",
  "admin.addProduct": "Thêm sản phẩm",
  "admin.demoWarning":
    "Chế độ demo: Supabase chưa được cấu hình, nên sản phẩm, đơn hàng và tin nhắn mới được lưu trong bộ nhớ và sẽ mất khi khởi động lại. Thêm khóa Supabase vào .env để lưu trữ. Xem README.md.",
  "admin.stat.products": "Sản phẩm",
  "admin.stat.orders": "Đơn hàng",
  "admin.stat.posts": "Bài viết",
  "admin.stat.messages": "Tin nhắn",
  "admin.stat.pending": "đang chờ",
  "admin.stat.unread": "chưa đọc",
  "admin.revenue": "Tổng doanh thu (tất cả đơn)",
  "admin.recentOrders": "Đơn hàng gần đây",
  "admin.customer": "Khách hàng",
  "admin.total": "Tổng",
  "admin.status": "Trạng thái",
  "admin.date": "Ngày",
  "admin.viewAll": "Xem tất cả",
  "admin.tip": "Mẹo: khách hàng có thể tìm sản phẩm theo tên hoặc nguồn gốc ở trang cửa hàng.",
  "admin.login.title": "Đăng nhập quản trị",
  "admin.login.subtitle": "Quản lý sản phẩm, đơn hàng, và nội dung.",
  "admin.login.invalid": "Thông tin không hợp lệ. Vui lòng thử lại.",
  "admin.login.demoPassword": "Mật khẩu demo",
  "admin.login.demoHint":
    "Chế độ demo — mật khẩu là {pw}. Đặt ADMIN_PASSWORD trong env để đổi.",
  "admin.login.password": "Mật khẩu",
  "admin.products.title": "Sản phẩm",
  "admin.products.add": "Thêm sản phẩm",
  "admin.products.new": "Thêm sản phẩm mới",
  "admin.products.newHint": "Điền thông tin và tải ảnh lên. Sản phẩm sẽ lên ngay lập tức.",
  "admin.products.edit": "Sửa sản phẩm",
  "admin.products.editHint": "Cập nhật thông tin, đổi ảnh, hoặc thay đổi tình trạng.",
  "admin.products.none": "Chưa có sản phẩm.",
  "admin.products.addFirst": "Thêm sản phẩm đầu tiên",
  "admin.products.category": "Loại",
  "admin.products.price": "Giá",
  "admin.products.status": "Trạng thái",
  "admin.products.added": "Ngày thêm",
  "admin.products.actions": "Thao tác",
  "admin.products.deleteConfirm": "Xóa \"{name}\"?",
  "admin.products.new.title": "Sản phẩm mới",
  "admin.products.name": "Tên",
  "admin.products.description": "Mô tả",
  "admin.products.priceUsd": "Giá (USD)",
  "admin.products.unit": "Đơn vị",
  "admin.products.origin": "Nguồn gốc",
  "admin.products.ratingOpt": "Đánh giá (tùy chọn)",
  "admin.products.image": "Ảnh sản phẩm",
  "admin.products.upload": "Tải lên",
  "admin.products.imageHint":
    "PNG, JPEG, WebP, hoặc GIF. Tối đa 6MB. Để trống để giữ ảnh hiện tại.",
  "admin.products.toggleFresh": "Tươi (vs đông lạnh)",
  "admin.products.toggleFeatured": "Nổi bật ở trang chủ",
  "admin.products.toggleStock": "Còn hàng",
  "admin.products.save": "Lưu thay đổi",
  "admin.products.create": "Tạo sản phẩm",
  "admin.blog.title": "Blog",
  "admin.blog.add": "Bài viết mới",
  "admin.blog.new": "Bài viết mới",
  "admin.blog.newHint": "Viết công thức, hướng dẫn, hoặc câu chuyện nguồn gốc bằng markdown.",
  "admin.blog.edit": "Sửa bài viết",
  "admin.blog.editHint": "Cập nhật tiêu đề, nội dung, hoặc tình trạng đăng.",
  "admin.blog.none": "Chưa có bài viết.",
  "admin.blog.addFirst": "Viết bài đầu tiên",
  "admin.blog.writeFirst": "Viết bài đầu tiên",
  "admin.blog.publishedAt": "Ngày đăng",
  "admin.blog.author": "Tác giả",
  "admin.blog.titleField": "Tiêu đề",
  "admin.blog.excerpt": "Tóm tắt",
  "admin.blog.excerptPlaceholder": "Một dòng tóm tắt hiển thị trên thẻ.",
  "admin.blog.coverUrl": "URL ảnh bìa",
  "admin.blog.body": "Nội dung (Markdown)",
  "admin.blog.bodyHint":
    "Hỗ trợ # tiêu đề, **đậm**, *nghiêng*, `code`, - danh sách, > trích dẫn, [liên kết](url).",
  "admin.blog.published": "Đã đăng",
  "admin.blog.publish": "Đăng",
  "admin.blog.draft": "Bản nháp",
  "admin.orders.title": "Đơn hàng",
  "admin.orders.none": "Chưa có đơn hàng. Đặt đơn thử từ trang thanh toán.",
  "admin.orders.contact": "Liên hệ",
  "admin.orders.items": "Mặt hàng",
  "admin.orders.note": "Ghi chú:",
  "admin.orders.reply": "Trả lời qua email",
  "admin.contact": "Liên hệ",
  "admin.shipping": "Địa chỉ giao hàng",
  "admin.note": "Ghi chú",
  "admin.items": "Mặt hàng",
  "admin.messages.title": "Tin nhắn",
  "admin.messages.none": "Chưa có tin nhắn. Gửi tin thử từ trang liên hệ.",
  "admin.messages.new": "Mới",

  // Status badges
  "status.pending": "đang chờ",
  "status.paid": "đã thanh toán",
  "status.shipped": "đã gửi",
  "status.delivered": "đã giao",
  "status.cancelled": "đã hủy",

  // Catch of the Day
  "catch.title": "Món Ngon Hôm Nay",
  "catch.endsIn": "Kết thúc trong",
  "catch.grab": "Chốt đơn",

  // Marquee items
  "marquee.fresh": "Tươi từ bến cá",
  "marquee.sustainable": "Khai thác bền vững",
  "marquee.cold": "Đảm bảo chuỗi lạnh",
  "marquee.dock24": "Từ bến đến tận nơi trong 24h",
  "marquee.wild": "Cá đánh bắt tự nhiên",
  "marquee.daily": "Tươi mới mỗi ngày",
  "marquee.premium": "Hải sản cao cấp",
  "marquee.harvested": "Khai thác có trách nhiệm",

  // Stats
  "stats.orders": "Đơn đã giao",
  "stats.dock": "Từ bến đến nơi",
  "stats.cold": "Chuỗi lạnh",
  "stats.quality": "Đảm bảo chất lượng",
};

export const dictionaries: Record<Lang, Dict> = { en, vi };

/** Translate a key for a given language, with optional {placeholder} substitution. */
export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  let str = dict[key] ?? dictionaries[DEFAULT_LANG][key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
