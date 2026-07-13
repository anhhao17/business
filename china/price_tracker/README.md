# Price Tracker Tool

A web dashboard tool to track supplier prices (China) and competitor prices (Vietnam Shopee) for your e-commerce business.

## Features

- **Track supplier prices** from 1688, Alibaba, Taobao
- **Track competitor prices** from Shopee Vietnam
- **Manual price entry** for products that can't be scraped
- **Price history charts** - see how prices change over time
- **Margin calculator** - calculate gross and net margins
- **Web dashboard** - view everything in your browser

## Quick Start

### 1. Install dependencies

```bash
cd ~/work/business/price_tracker
pip install -r requirements.txt
```

### 2. Configure products

Edit `config.yaml` to add products you want to track:

```yaml
products:
  - name: "Neck Fan USB (Supplier)"
    category: "Tech Accessories"
    role: "supplier"           # supplier = China source
    platform: "1688"           # 1688, alibaba, shopee, taobao, manual
    url: "https://detail.1688.com/offer/784671047598.html"
    my_sell_price: 149000      # your selling price in VND

  - name: "Neck Fan - Competitor A"
    category: "Tech Accessories"
    role: "competitor"         # competitor = Vietnam seller
    platform: "shopee"
    url: "https://shopee.vn/product-name-i.123456.789012"
    my_sell_price: 149000
```

### 3. Run the tracker (scrape prices)

```bash
python track.py
```

### 4. Launch the web dashboard

```bash
streamlit run dashboard.py
```

Then open your browser to `http://localhost:8501`

## CLI Commands

```bash
# Scrape all product prices
python track.py

# List all products with latest prices
python track.py --list

# Track specific product (partial name match)
python track.py --product "Neck Fan"

# Enter prices manually
python track.py --manual
```

## Dashboard Pages

| Page | What it shows |
|---|---|
| **Overview** | All products with current prices, margins, price changes |
| **Product Details** | Price history chart for each product |
| **Margin Calculator** | Gross/net margin for each product + custom calculator |
| **Manual Entry** | Enter prices manually for products that can't be scraped |
| **Run Tracker** | Scrape all prices from within the dashboard |

## How Scraping Works

| Platform | Method | Reliability |
|---|---|---|
| **Alibaba** | HTML parsing + JSON-LD | ⚠️ Medium (some pages work, some block) |
| **Shopee VN** | Public API + HTML fallback | ⚠️ Medium (API may require tokens) |
| **1688** | HTML regex + embedded JSON | ❌ Low (anti-bot CAPTCHA blocks requests) |
| **Taobao** | HTML regex | ❌ Low (requires login) |
| **Manual** | User enters price | ✅ Always works |

> **Important:** Most e-commerce sites (1688, Taobao, Shopee) use anti-bot protection
> that blocks automated requests. The scrapers will try their best, but for many products
> you'll need to use **manual entry** - just browse the website, note the price, and enter
> it in the dashboard's "Manual Entry" or "Bulk Quick Entry" page.
>
> This is actually fine for a small business - you should be checking supplier prices
> manually anyway to verify quality and negotiate.

## Adding Shopee Competitor Products

To track a competitor's price on Shopee Vietnam:

1. Find the product on shopee.vn
2. Copy the URL (format: `https://shopee.vn/product-name-i.{shopid}.{itemid}`)
3. Add to config.yaml:

```yaml
- name: "Neck Fan - Competitor A"
  category: "Tech Accessories"
  role: "competitor"
  platform: "shopee"
  url: "https://shopee.vn/quat-co-mini-i.123456.789012"
  my_sell_price: 149000
```

## Database

All price data is stored in `data/prices.db` (SQLite). You can query it directly:

```bash
sqlite3 data/prices.db

# See all products
SELECT * FROM products;

# See price history for a product
SELECT * FROM price_history WHERE product_id = 1 ORDER BY checked_at DESC;

# See latest prices
SELECT p.name, ph.price, ph.currency, ph.price_vnd, ph.checked_at
FROM products p
JOIN price_history ph ON p.id = ph.product_id
WHERE ph.checked_at = (SELECT MAX(checked_at) FROM price_history WHERE product_id = p.id);
```

## Currency Conversion

The tool uses approximate rates (update in `scrapers.py`):

```python
RATES = {
    "CNY_TO_VND": 3500,   # 1 CNY ≈ 3,500 VND
    "USD_TO_VND": 25000,  # 1 USD ≈ 25,000 VND
}
```

Update these rates as exchange rates change.

## Tips

1. **Run the tracker regularly** - daily or every few days to build price history
2. **Check before ordering** - run the tracker before placing orders to get the best price
3. **Track competitors** - add 2-3 Shopee competitors per product to monitor their pricing
4. **Use manual entry** - if scraping fails, enter the price you see on the website manually
5. **Watch price trends** - if a supplier price drops, it's a good time to stock up
6. **Margin alerts** - check the Overview page for price changes >1%
