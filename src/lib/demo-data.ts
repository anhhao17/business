import type { Category, Product, BlogPost } from "@/lib/types";

export const demoCategories: Category[] = [
  {
    id: "c-fish",
    slug: "fish",
    name: "Fresh Fish",
    description: "Wild-caught and day-boat fish, delivered ice-cold.",
    icon: "fish",
  },
  {
    id: "c-shrimp",
    slug: "shrimp",
    name: "Shrimp & Prawns",
    description: "Sweet, snap-fresh shrimp and jumbo prawns.",
    icon: "shrimp",
  },
  {
    id: "c-crab",
    slug: "crab",
    name: "Crab & Lobster",
    description: "Live and cooked crustaceans from cold waters.",
    icon: "crab",
  },
  {
    id: "c-shellfish",
    slug: "shellfish",
    name: "Shellfish",
    description: "Oysters, mussels, clams — straight from the tide.",
    icon: "shell",
  },
  {
    id: "c-specialty",
    slug: "specialty",
    name: "Specialty & Caviar",
    description: "Smoked, cured, and premium roe selections.",
    icon: "star",
  },
];

export const demoProducts: Product[] = [
  {
    id: "p-1",
    slug: "wild-alaskan-salmon",
    name: "Wild Alaskan King Salmon",
    description:
      "Rich, buttery king salmon caught off the coast of Alaska. Hand-cut into center-cut fillets, skin-on for the perfect sear. High in omega-3s with a firm, succulent texture.",
    price: 32.9,
    unit: "per lb",
    category_id: "c-fish",
    image_url: "/products/salmon.jpg",
    gallery: null,
    origin: "Alaska, USA",
    is_fresh: true,
    is_featured: true,
    in_stock: true,
    rating: 4.9,
    created_at: "2025-01-10T00:00:00.000Z",
  },
  {
    id: "p-2",
    slug: "atlantic-sea-scallops",
    name: "Dry Atlantic Sea Scallops",
    description:
      "U/10 dry-pack scallops — never soaked in preservatives. Sear them golden for a caramelized crust and a sweet, tender center.",
    price: 28.5,
    unit: "per lb",
    category_id: "c-shellfish",
    image_url: "/products/scallops.jpg",
    gallery: null,
    origin: "New Bedford, USA",
    is_fresh: true,
    is_featured: true,
    in_stock: true,
    rating: 4.8,
    created_at: "2025-01-11T00:00:00.000Z",
  },
  {
    id: "p-3",
    slug: "gulf-tiger-shrimp",
    name: "Jumbo Gulf Tiger Shrimp",
    description:
      "16/20 count tiger shrimp with a firm bite and clean, briny sweetness. Peel-and-devein ready. Perfect for grilling or garlic butter.",
    price: 19.9,
    unit: "per lb",
    category_id: "c-shrimp",
    image_url: "/products/shrimp.jpg",
    gallery: null,
    origin: "Gulf of Mexico",
    is_fresh: false,
    is_featured: true,
    in_stock: true,
    rating: 4.7,
    created_at: "2025-01-12T00:00:00.000Z",
  },
  {
    id: "p-4",
    slug: "dungeness-crab",
    name: "Live Dungeness Crab",
    description:
      "Sweet, delicate meat from the Pacific Northwest. Delivered live and feisty, ready to steam whole or pick for cakes.",
    price: 24.0,
    unit: "per crab",
    category_id: "c-crab",
    image_url: "/products/dungeness-crab.jpg",
    gallery: null,
    origin: "Oregon, USA",
    is_fresh: true,
    is_featured: false,
    in_stock: true,
    rating: 4.9,
    created_at: "2025-01-13T00:00:00.000Z",
  },
  {
    id: "p-5",
    slug: "maine-lobster",
    name: "Live Maine Lobster",
    description:
      "Hard-shell Maine lobsters, 1.5 lb each, shipped overnight in saltwater-soaked seaweed. The classic New England feast.",
    price: 26.5,
    unit: "per lb",
    category_id: "c-crab",
    image_url: "/products/lobster.jpg",
    gallery: null,
    origin: "Maine, USA",
    is_fresh: true,
    is_featured: true,
    in_stock: true,
    rating: 5.0,
    created_at: "2025-01-14T00:00:00.000Z",
  },
  {
    id: "p-6",
    slug: "blue-point-oysters",
    name: "Blue Point Oysters",
    description:
      "Briny, medium-bodied Long Island Sound oysters. Shipped fresh on ice, dozen count. Shuck and serve with mignonette.",
    price: 18.0,
    unit: "per dozen",
    category_id: "c-shellfish",
    image_url: "/products/oysters.jpg",
    gallery: null,
    origin: "Long Island, USA",
    is_fresh: true,
    is_featured: false,
    in_stock: true,
    rating: 4.6,
    created_at: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "p-7",
    slug: "ahi-tuna-loin",
    name: "Sushi-Grade Ahi Tuna Loin",
    description:
      "Sashimi-grade yellowfin tuna loin, deep red and clean-flavored. Cut for searing or raw preparations. Sashimi-grade, frozen at sea.",
    price: 30.0,
    unit: "per lb",
    category_id: "c-fish",
    image_url: "/products/tuna.jpg",
    gallery: null,
    origin: "Hawaii, USA",
    is_fresh: false,
    is_featured: true,
    in_stock: true,
    rating: 4.8,
    created_at: "2025-01-16T00:00:00.000Z",
  },
  {
    id: "p-8",
    slug: "smoked-salmon-fillet",
    name: "Cold-Smoked Salmon Fillet",
    description:
      "Traditionally cold-smoked over alder wood. Thinly sliced, silky, and perfectly balanced in salt. A brunch and charcuterie staple.",
    price: 22.0,
    unit: "per 8oz pack",
    category_id: "c-specialty",
    image_url: "/products/smoked-salmon.jpg",
    gallery: null,
    origin: "Scotland",
    is_fresh: false,
    is_featured: false,
    in_stock: true,
    rating: 4.7,
    created_at: "2025-01-17T00:00:00.000Z",
  },
  {
    id: "p-9",
    slug: "black-cod",
    name: "Black Cod (Sablefish)",
    description:
      "Velvety, omega-rich black cod from the Pacific. Buttery and flaky — ideal for miso marinade or slow-roasting.",
    price: 27.0,
    unit: "per lb",
    category_id: "c-fish",
    image_url: "/products/black-cod.jpg",
    gallery: null,
    origin: "British Columbia, CA",
    is_fresh: true,
    is_featured: false,
    in_stock: true,
    rating: 4.8,
    created_at: "2025-01-18T00:00:00.000Z",
  },
  {
    id: "p-10",
    slug: "king-crab-legs",
    name: "Alaskan Red King Crab Legs",
    description:
      "Colossal red king crab legs, pre-cooked and flash-frozen. Sweet, snowy meat — just thaw and steam gently. 2 lb cluster.",
    price: 64.0,
    unit: "per 2lb",
    category_id: "c-crab",
    image_url: "/products/king-crab.jpg",
    gallery: null,
    origin: "Bering Sea, AK",
    is_fresh: false,
    is_featured: true,
    in_stock: true,
    rating: 5.0,
    created_at: "2025-01-19T00:00:00.000Z",
  },
  {
    id: "p-11",
    slug: "mussels-prince-edward",
    name: "PEI Cultivated Mussels",
    description:
      "Rope-cultured Prince Edward Island mussels — clean, plump, and low-grit. Steam in white wine and garlic for a bistro classic. 2 lb bag.",
    price: 9.5,
    unit: "per 2lb",
    category_id: "c-shellfish",
    image_url: "/products/mussels.jpg",
    gallery: null,
    origin: "Prince Edward Island, CA",
    is_fresh: true,
    is_featured: false,
    in_stock: true,
    rating: 4.5,
    created_at: "2025-01-20T00:00:00.000Z",
  },
  {
    id: "p-12",
    slug: "ossetra-caviar",
    name: "Farm-Raised Ossetra Caviar",
    description:
      "Sustainable farm-raised Ossetra — nutty, golden-brown pearls with a long, clean finish. Packed in 30g tins, refrigerated shipping.",
    price: 95.0,
    unit: "per 30g",
    category_id: "c-specialty",
    image_url: "/products/caviar.jpg",
    gallery: null,
    origin: "California, USA",
    is_fresh: false,
    is_featured: true,
    in_stock: true,
    rating: 4.9,
    created_at: "2025-01-21T00:00:00.000Z",
  },
];

export const demoBlogPosts: BlogPost[] = [
  {
    id: "b-1",
    slug: "how-to-sear-the-perfect-scallop",
    title: "How to Sear the Perfect Scallop",
    excerpt:
      "A foolproof method for a golden crust and a translucent, sweet center — every time.",
    body: `Searing scallops is one of the most rewarding techniques in home cooking. The goal is a deep mahogany crust on the outside and a barely-warm, translucent center.

## The Setup
1. Pat the scallops completely dry with paper towels. Moisture is the enemy of a crust.
2. Season generously with salt just before cooking — salting too early pulls moisture out.
3. Use a heavy stainless or cast pan and get it smoking hot before adding oil.

## The Cook
Add a thin layer of neutral oil (grapeseed or canola). Place scallops flat-side down and **do not touch them** for 90 seconds. Press gently once to ensure contact. Flip, drop in a knob of butter and a crushed garlic clove, and baste for another 45–60 seconds.

Serve immediately with a squeeze of lemon. The center should still be slightly translucent — carryover heat will finish it on the plate.`,
    cover_image: "/products/blog-scallops.jpg",
    author: "Chef Marina Reyes",
    published: true,
    published_at: "2025-02-02T00:00:00.000Z",
  },
  {
    id: "b-2",
    slug: "oysters-101-a-buyers-guide",
    title: "Oysters 101: A Buyer's Guide",
    excerpt:
      "Briny, sweet, metallic or creamy — learn the five flavors of oysters and how to pair them.",
    body: `Oysters taste like the water they grew in. That's why two oysters of the same species can taste completely different depending on their bay.

## The Five Profiles
- **Briny**: high salinity, clean finish (East Coast classics like Blue Point)
- **Sweet**: low salt, almost melon-like (Kumamoto)
- **Metallic**: mineral, coppery notes (Belon, European Flat)
- **Creamy**: buttery texture, rich (Beau Soleil)
- **Cucumber**: fresh, green finish (Hama Hama)

## Serving
Shuck just before serving, keep on crushed ice, and offer mignonette (shallot, vinegar, pepper), lemon, and cocktail sauce. Pair with a crisp Muscadet or a dry sparkling wine.`,
    cover_image: "/products/blog-oysters.jpg",
    author: "The Ocean Catch Team",
    published: true,
    published_at: "2025-02-10T00:00:00.000Z",
  },
  {
    id: "b-3",
    slug: "sustainable-seafood-what-to-look-for",
    title: "Sustainable Seafood: What to Look For",
    excerpt:
      "A practical guide to choosing seafood that's good for you and the ocean.",
    body: `Sustainable seafood means it's caught or farmed in a way that maintains healthy populations and minimizes environmental harm.

## Quick Rules of Thumb
1. Look for the **MSC** blue tick (Marine Stewardship Council) for wild-caught.
2. Look for **BAP** or **ASC** certification for farmed seafood.
3. Eat lower on the food chain sometimes — sardines, mussels, and clams are among the most sustainable proteins on earth.
4. Ask your fishmonger where it came from. A good one will know.

## At Ocean Catch
We source from fisheries and farms with verifiable sustainability practices, and we list the origin of every product on its page.`,
    cover_image: "/products/blog-sustainable.jpg",
    author: "The Ocean Catch Team",
    published: true,
    published_at: "2025-02-18T00:00:00.000Z",
  },
];
