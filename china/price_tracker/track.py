"""
CLI tool to track prices.
Usage:
    python track.py                # Scrape all products in config
    python track.py --list         # List all products and latest prices
    python track.py --manual       # Enter prices manually for manual products
    python track.py --product "Neck Fan"  # Track specific product
"""
import sys
import argparse
import yaml
from pathlib import Path
from datetime import datetime

from db import init_db, sync_products, save_price, get_all_products
from scrapers import scrape_price

CONFIG_PATH = Path(__file__).parent / "config.yaml"


def load_config():
    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def track_all(verbose=True):
    """Scrape prices for all products in config."""
    config = load_config()
    products = config.get("products", [])

    if not products:
        print("No products in config.yaml!")
        return

    init_db()
    name_to_id = sync_products(products)

    print(f"\n{'='*80}")
    print(f"  Price Tracker - {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print(f"  Tracking {len(products)} products")
    print(f"{'='*80}\n")

    success = 0
    failed = 0
    manual = 0

    for p in products:
        name = p["name"]
        platform = p["platform"]
        url = p.get("url", "")
        pid = name_to_id[name]

        if platform == "manual":
            manual += 1
            if verbose:
                print(f"  [SKIP] {name} ({platform}) - manual entry needed")
            continue

        if verbose:
            print(f"  [FETCH] {name} ({platform})...")

        price, currency, price_vnd, stock, raw_data = scrape_price(platform, url)

        if price is not None:
            save_price(pid, price, currency, price_vnd, stock, raw_data)
            sell_price = p.get("my_sell_price", 0)
            margin = ((sell_price - price_vnd) / sell_price * 100) if (sell_price and price_vnd) else None

            if verbose:
                stock_str = f" | {stock}" if stock else ""
                margin_str = f" | Margin: {margin:.1f}%" if margin is not None else ""
                print(f"  [OK]    {name}: {price} {currency} = {price_vnd:,} VND{stock_str}{margin_str}")
            success += 1
        else:
            if verbose:
                print(f"  [FAIL]  {name}: {raw_data}")
            failed += 1

    print(f"\n{'='*80}")
    print(f"  Results: {success} success, {failed} failed, {manual} manual")
    print(f"{'='*80}\n")


def list_products():
    """List all products with latest prices."""
    init_db()
    products = get_all_products()

    if not products:
        print("No products found. Run 'python track.py' first.")
        return

    print(f"\n{'='*100}")
    print(f"  {'Name':<35} {'Platform':<10} {'Price':<15} {'VND':<12} {'Margin':<10} {'Updated':<20}")
    print(f"{'='*100}")

    for p in products:
        name = p["name"][:33]
        platform = p["platform"]
        price = f"{p['latest_price']} {p['latest_currency']}" if p["latest_price"] else "N/A"
        vnd = f"{p['latest_price_vnd']:,}" if p["latest_price_vnd"] else "N/A"

        sell = p.get("my_sell_price") or 0
        if sell and p["latest_price_vnd"]:
            margin = f"{(sell - p['latest_price_vnd']) / sell * 100:.1f}%"
        else:
            margin = "N/A"

        updated = p["latest_date"][:19] if p["latest_date"] else "Never"

        print(f"  {name:<35} {platform:<10} {price:<15} {vnd:<12} {margin:<10} {updated:<20}")

    print(f"{'='*100}\n")


def manual_entry():
    """Enter prices manually for manual-platform products."""
    config = load_config()
    products = config.get("products", [])
    manual_products = [p for p in products if p["platform"] == "manual"]

    if not manual_products:
        print("No manual products in config.")
        return

    init_db()
    name_to_id = sync_products(products)

    print("\n  Manual Price Entry")
    print(f"  {'='*60}\n")

    for p in manual_products:
        name = p["name"]
        pid = name_to_id[name]
        print(f"  Product: {name}")
        print(f"  Sell price target: {p.get('my_sell_price', 'N/A')} VND")

        try:
            price_input = input("  Enter price (VND, or 's' to skip): ").strip()
            if price_input.lower() == "s":
                print("  Skipped.\n")
                continue

            price = float(price_input)
            save_price(pid, price, "VND", int(price), "", "Manual entry")
            print(f"  Saved: {price:,.0f} VND\n")

        except ValueError:
            print("  Invalid input. Skipped.\n")

    print("  Manual entry complete.\n")


def track_product(name_filter):
    """Track a specific product by name (partial match)."""
    config = load_config()
    products = config.get("products", [])

    matches = [p for p in products if name_filter.lower() in p["name"].lower()]

    if not matches:
        print(f"No products matching '{name_filter}'")
        return

    init_db()
    name_to_id = sync_products(products)

    for p in matches:
        name = p["name"]
        platform = p["platform"]
        url = p.get("url", "")
        pid = name_to_id[name]

        if platform == "manual":
            print(f"  [SKIP] {name} - manual entry needed")
            continue

        print(f"  [FETCH] {name} ({platform})...")
        price, currency, price_vnd, stock, raw_data = scrape_price(platform, url)

        if price is not None:
            save_price(pid, price, currency, price_vnd, stock, raw_data)
            print(f"  [OK]    {name}: {price} {currency} = {price_vnd:,} VND")
        else:
            print(f"  [FAIL]  {name}: {raw_data}")


def main():
    parser = argparse.ArgumentParser(description="Price Tracker CLI")
    parser.add_argument("--list", action="store_true", help="List all products and latest prices")
    parser.add_argument("--manual", action="store_true", help="Enter prices manually")
    parser.add_argument("--product", type=str, help="Track specific product by name")

    args = parser.parse_args()

    if args.list:
        list_products()
    elif args.manual:
        manual_entry()
    elif args.product:
        track_product(args.product)
    else:
        track_all()


if __name__ == "__main__":
    main()
