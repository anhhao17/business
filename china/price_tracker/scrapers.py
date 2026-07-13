"""
Price scrapers for different platforms.
Each scraper tries to fetch the product page and extract the price.
Returns: (price, currency, price_vnd, stock, raw_data)
If scraping fails, returns (None, None, None, None, error_message)

NOTE: Many e-commerce sites (1688, Taobao, Shopee) use anti-bot protection
that blocks automated requests. For sites that fail, use manual entry
in the dashboard or CLI (python track.py --manual).
"""
import re
import json
import requests
from bs4 import BeautifulSoup

# Currency conversion rates (approximate - update as needed)
RATES = {
    "CNY_TO_VND": 3500,   # 1 CNY ≈ 3,500 VND
    "USD_TO_VND": 25000,  # 1 USD ≈ 25,000 VND
}

# Common headers to mimic a real browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,vi;q=0.6",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}

API_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Referer": "https://shopee.vn/",
    "X-Shopee-Language": "vi",
    "X-API-SOURCE": "pc",
    "X-Shopee-Region": "vn",
}


def convert_to_vnd(price, currency):
    """Convert price to VND."""
    if price is None:
        return None
    if currency == "CNY":
        return round(price * RATES["CNY_TO_VND"])
    elif currency == "USD":
        return round(price * RATES["USD_TO_VND"])
    elif currency == "VND":
        return round(price)
    return None


# ──── 1688 SCRAPER ────

def scrape_1688(url):
    """Scrape price from 1688.com product page."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.encoding = "utf-8"
        html = resp.text

        # Method 1: Look for price in JSON data embedded in page
        # 1688 embeds product data in a script tag
        price_patterns = [
            r'"price"\s*:\s*"?(\d+\.?\d*)"?',           # "price": 7.90
            r'"priceRange"\s*:\s*\[?\{[^}]*"price"\s*:\s*"?(\d+\.?\d*)"?',  # priceRange
            r'priceView["\s:]+(\d+\.?\d*)',
            r'"unitPrice"\s*:\s*"?(\d+\.?\d*)"?',
            r'detailPrice["\s:]+(\d+\.?\d*)',
            r'offerPrice["\s:]+(\d+\.?\d*)',
        ]

        for pattern in price_patterns:
            match = re.search(pattern, html)
            if match:
                price = float(match.group(1))
                if 0.01 < price < 100000:  # sanity check
                    price_vnd = convert_to_vnd(price, "CNY")
                    return (price, "CNY", price_vnd, "", f"Pattern: {pattern}")

        # Method 2: Parse with BeautifulSoup, look for price elements
        soup = BeautifulSoup(html, "lxml")

        # Try to find price in meta tags
        meta_price = soup.find("meta", {"property": "og:price:amount"})
        if meta_price:
            price = float(meta_price["content"])
            price_vnd = convert_to_vnd(price, "CNY")
            return (price, "CNY", price_vnd, "", "meta og:price")

        # Method 3: Look for price in specific div classes
        price_elements = soup.find_all(class_=re.compile(r"price|Price|amount", re.I))
        for el in price_elements:
            text = el.get_text(strip=True)
            match = re.search(r"(\d+\.?\d*)", text)
            if match:
                price = float(match.group(1))
                if 0.01 < price < 100000:
                    price_vnd = convert_to_vnd(price, "CNY")
                    return (price, "CNY", price_vnd, "", f"Element: {el.name}.{el.get('class', '')}")

        return (None, None, None, None, "Could not find price on 1688 page (may require login)")

    except requests.RequestException as e:
        return (None, None, None, None, f"Request error: {e}")
    except Exception as e:
        return (None, None, None, None, f"Error: {e}")


# ──── ALIBABA SCRAPER ────

def scrape_alibaba(url):
    """Scrape price from Alibaba.com product page."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.encoding = "utf-8"
        html = resp.text

        # Method 1: Look for price in JSON-LD or embedded data
        price_patterns = [
            r'"price"\s*:\s*"?(\d+\.?\d*)"?\s*,\s*"priceCurrency"\s*:\s*"USD"',
            r'"priceCurrency"\s*:\s*"USD"\s*,\s*"price"\s*:\s*"?(\d+\.?\d*)"?',
            r'"minPrice"\s*:\s*"?(\d+\.?\d*)"?',
            r'"maxPrice"\s*:\s*"?(\d+\.?\d*)"?',
            r'\$\s*(\d+\.?\d*)\s*[-–]\s*\$?\s*(\d+\.?\d*)',  # $3.70 - $9.80
            r'\$\s*(\d+\.?\d*)',  # $3.70
        ]

        for i, pattern in enumerate(price_patterns):
            match = re.search(pattern, html)
            if match:
                # For range pattern, take the lower price
                price = float(match.group(1))
                if 0.01 < price < 100000:
                    price_vnd = convert_to_vnd(price, "USD")
                    return (price, "USD", price_vnd, "", f"Pattern {i}: {pattern}")

        # Method 2: Parse with BeautifulSoup
        soup = BeautifulSoup(html, "lxml")

        # JSON-LD
        scripts = soup.find_all("script", type="application/ld+json")
        for script in scripts:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict):
                    offers = data.get("offers", {})
                    if isinstance(offers, dict):
                        price = offers.get("price")
                        if price:
                            price = float(price)
                            price_vnd = convert_to_vnd(price, "USD")
                            return (price, "USD", price_vnd, "", "JSON-LD offers.price")
                    elif isinstance(offers, list) and offers:
                        price = offers[0].get("price")
                        if price:
                            price = float(price)
                            price_vnd = convert_to_vnd(price, "USD")
                            return (price, "USD", price_vnd, "", "JSON-LD list offers")
            except (json.JSONDecodeError, TypeError, ValueError):
                continue

        # Method 3: Find price in page text
        price_divs = soup.find_all(class_=re.compile(r"price|Price", re.I))
        for div in price_divs:
            text = div.get_text(strip=True)
            match = re.search(r"\$\s*(\d+\.?\d*)", text)
            if match:
                price = float(match.group(1))
                if 0.01 < price < 100000:
                    price_vnd = convert_to_vnd(price, "USD")
                    return (price, "USD", price_vnd, "", f"Div: {div.get('class', '')}")

        return (None, None, None, None, "Could not find price on Alibaba page")

    except requests.RequestException as e:
        return (None, None, None, None, f"Request error: {e}")
    except Exception as e:
        return (None, None, None, None, f"Error: {e}")


# ──── SHOPEE SCRAPER ────

def scrape_shopee(url):
    """Scrape price from Shopee Vietnam product page."""
    try:
        # Extract shopid and itemid from URL
        # URL format: https://shopee.vn/product-name-i.{shopid}.{itemid}
        match = re.search(r"-i\.(\d+)\.(\d+)", url)
        if not match:
            return (None, None, None, None, "Could not parse shopid/itemid from URL")

        shop_id = match.group(1)
        item_id = match.group(2)

        # Try Shopee API
        api_url = f"https://shopee.vn/api/v4/item/get"
        params = {
            "itemid": item_id,
            "shopid": shop_id,
        }

        resp = requests.get(api_url, headers=API_HEADERS, params=params, timeout=15)

        if resp.status_code == 200:
            try:
                data = resp.json()
                item = data.get("data", {}).get("item", {})
                if item:
                    # Shopee prices are in multiples of 100000 (cents * 100)
                    price_min = item.get("price_min", 0) / 100000
                    price_max = item.get("price_max", 0) / 100000
                    price = price_min if price_min > 0 else price_max

                    if price > 0:
                        stock = item.get("stock", "")
                        historical_sold = item.get("historical_sold", "")
                        stock_info = f"stock={stock}, sold={historical_sold}"
                        return (price, "VND", int(price), stock_info, "Shopee API v4")

            except (json.JSONDecodeError, KeyError):
                pass

        # Fallback: scrape the HTML page
        resp = requests.get(url, headers=HEADERS, timeout=15)
        html = resp.text

        # Look for price in embedded JSON
        price_match = re.search(r'"price"\s*:\s*(\d+)', html)
        if price_match:
            price = int(price_match.group(1)) / 100000
            if price > 0:
                return (price, "VND", int(price), "", "HTML fallback")

        return (None, None, None, None, "Could not fetch price from Shopee (may require login/anti-bot)")

    except requests.RequestException as e:
        return (None, None, None, None, f"Request error: {e}")
    except Exception as e:
        return (None, None, None, None, f"Error: {e}")


# ──── TAOBAO SCRAPER ────

def scrape_taobao(url):
    """Scrape price from Taobao product page. Note: Taobao heavily blocks scraping."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.encoding = "utf-8"
        html = resp.text

        # Taobao embeds data in g_page_config or similar
        price_patterns = [
            r'"price"\s*:\s*"?(\d+\.?\d*)"?',
            r'"defaultPrice"\s*:\s*"?(\d+\.?\d*)"?',
            r'"reservePrice"\s*:\s*"?(\d+\.?\d*)"?',
        ]

        for pattern in price_patterns:
            match = re.search(pattern, html)
            if match:
                price = float(match.group(1))
                if 0.01 < price < 100000:
                    price_vnd = convert_to_vnd(price, "CNY")
                    return (price, "CNY", price_vnd, "", f"Pattern: {pattern}")

        return (None, None, None, None, "Could not find price on Taobao (often requires login)")

    except requests.RequestException as e:
        return (None, None, None, None, f"Request error: {e}")
    except Exception as e:
        return (None, None, None, None, f"Error: {e}")


# ──── SCRAPER DISPATCHER ────

SCRAPERS = {
    "1688": scrape_1688,
    "alibaba": scrape_alibaba,
    "shopee": scrape_shopee,
    "taobao": scrape_taobao,
}


def scrape_price(platform, url):
    """
    Main entry point. Scrape price from given platform.
    Returns: (price, currency, price_vnd, stock, raw_data)
    """
    if platform == "manual":
        return (None, None, None, None, "Manual entry - no scraping")

    scraper = SCRAPERS.get(platform)
    if not scraper:
        return (None, None, None, None, f"Unknown platform: {platform}")

    if not url:
        return (None, None, None, None, "No URL provided")

    return scraper(url)
