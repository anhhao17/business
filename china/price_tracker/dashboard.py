"""
Streamlit web dashboard for price tracking.
Run with: streamlit run dashboard.py
"""
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
from pathlib import Path
import sys

# Add parent dir to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from db import (
    init_db, sync_products, get_all_products,
    get_price_history, get_product_by_id, save_price
)
from scrapers import scrape_price
from track import load_config, track_all

# ──── PAGE CONFIG ────

st.set_page_config(
    page_title="Price Tracker - Vietnam Business",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──── INIT ────

init_db()
config = load_config()
sync_products(config.get("products", []))


# ──── HELPER FUNCTIONS ────

def format_vnd(value):
    if value is None:
        return "N/A"
    return f"{value:,.0f} VND"


def format_change(change):
    if change is None:
        return ""
    arrow = "↑" if change > 0 else "↓" if change < 0 else "→"
    color = "red" if change > 0 else "green" if change < 0 else "gray"
    return f"{arrow} {abs(change):.1f}%"


# ──── SIDEBAR ────

st.sidebar.title("📊 Price Tracker")
st.sidebar.markdown("---")

page = st.sidebar.radio(
    "Navigation",
    ["📈 Overview", "🔍 Product Details", "💰 Margin Calculator", "✏️ Manual Entry", "➕ Add Product", "⚙️ Run Tracker"]
)

st.sidebar.markdown("---")
st.sidebar.markdown(f"**Products tracked:** {len(config.get('products', []))}")
st.sidebar.markdown(f"**Last updated:** {datetime.now().strftime('%Y-%m-%d %H:%M')}")


# ──── OVERVIEW PAGE ────

if page == "📈 Overview":
    st.title("📈 Price Overview")

    products = get_all_products()

    if not products:
        st.warning("No products found. Add products to config.yaml and run the tracker.")
        st.stop()

    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)

    supplier_products = [p for p in products if p["role"] == "supplier"]
    competitor_products = [p for p in products if p["role"] == "competitor"]
    tracked = [p for p in products if p["latest_price"] is not None]
    failed = [p for p in products if p["latest_price"] is None and p["platform"] != "manual"]

    col1.metric("Total Products", len(products))
    col2.metric("Supplier Prices", len(supplier_products))
    col3.metric("Competitor Prices", len(competitor_products))
    col4.metric("Successfully Tracked", f"{len(tracked)}/{len(products)}")

    st.markdown("---")

    # Products table
    st.subheader("All Products")

    df_data = []
    for p in products:
        sell = p.get("my_sell_price") or 0
        cost = p.get("latest_price_vnd") or 0
        margin = ((sell - cost) / sell * 100) if sell and cost else None

        df_data.append({
            "Name": p["name"],
            "Category": p["category"],
            "Role": p["role"].title(),
            "Platform": p["platform"],
            "Price": f"{p['latest_price']} {p['latest_currency']}" if p["latest_price"] else "N/A",
            "Price (VND)": p["latest_price_vnd"],
            "My Sell Price": sell,
            "Margin %": f"{margin:.1f}%" if margin is not None else "N/A",
            "Change": format_change(p.get("price_change")),
            "Last Updated": p["latest_date"][:19] if p["latest_date"] else "Never",
            "URL": p["url"],
        })

    df = pd.DataFrame(df_data)

    # Display table with conditional formatting
    st.dataframe(
        df,
        use_container_width=True,
        hide_index=True,
        column_config={
            "URL": st.column_config.LinkColumn("Link", width="small"),
            "Price (VND)": st.column_config.NumberColumn(format="%,.0f"),
            "My Sell Price": st.column_config.NumberColumn(format="%,.0f"),
        }
    )

    # Price change alerts
    st.markdown("---")
    st.subheader("🔔 Price Changes")

    changes = [p for p in products if p.get("price_change") is not None and abs(p["price_change"]) > 1]
    if changes:
        for p in changes:
            change = p["price_change"]
            if change > 0:
                st.error(f"📈 {p['name']}: Price UP {change:.1f}% → {format_vnd(p['latest_price_vnd'])}")
            else:
                st.success(f"📉 {p['name']}: Price DOWN {abs(change):.1f}% → {format_vnd(p['latest_price_vnd'])}")
    else:
        st.info("No significant price changes (>1%) since last check.")

    # Failed scraping
    if failed:
        st.markdown("---")
        st.subheader("⚠️ Failed to Track")
        for p in failed:
            st.warning(f"{p['name']} ({p['platform']}) - Try manual entry or check URL")


# ──── PRODUCT DETAILS PAGE ────

elif page == "🔍 Product Details":
    st.title("🔍 Product Price History")

    products = get_all_products()

    if not products:
        st.warning("No products found.")
        st.stop()

    # Product selector
    product_names = [p["name"] for p in products]
    selected_name = st.selectbox("Select product:", product_names)

    selected = next(p for p in products if p["name"] == selected_name)

    # Product info
    col1, col2, col3 = st.columns(3)
    col1.metric("Platform", selected["platform"])
    col2.metric("Current Price", format_vnd(selected["latest_price_vnd"]))
    col3.metric("My Sell Price", format_vnd(selected.get("my_sell_price")))

    if selected["url"]:
        st.markdown(f"**Link:** [{selected['url'][:60]}...]({selected['url']})")

    st.markdown("---")

    # Price history chart
    history = get_price_history(selected["id"], limit=90)

    if history:
        hist_df = pd.DataFrame(history)
        hist_df["checked_at"] = pd.to_datetime(hist_df["checked_at"])

        fig = px.line(
            hist_df,
            x="checked_at",
            y="price_vnd",
            title=f"Price History - {selected_name}",
            labels={"price_vnd": "Price (VND)", "checked_at": "Date"},
            markers=True,
        )
        fig.update_layout(height=400)
        st.plotly_chart(fig, use_container_width=True)

        # History table
        st.subheader("Price History Table")
        display_df = hist_df[["checked_at", "price", "currency", "price_vnd", "stock"]].copy()
        display_df.columns = ["Date", "Price", "Currency", "Price (VND)", "Stock"]
        st.dataframe(display_df, use_container_width=True, hide_index=True)
    else:
        st.info("No price history yet. Run the tracker to start collecting data.")


# ──── MARGIN CALCULATOR PAGE ────

elif page == "💰 Margin Calculator":
    st.title("💰 Margin Calculator")

    products = get_all_products()
    supplier_products = [p for p in products if p["role"] == "supplier" and p["latest_price_vnd"]]

    if not supplier_products:
        st.warning("No supplier prices available. Run the tracker first.")
        st.stop()

    # Group by category
    categories = sorted(set(p["category"] for p in supplier_products))
    selected_cat = st.selectbox("Filter by category:", ["All"] + categories)

    filtered = supplier_products if selected_cat == "All" else [p for p in supplier_products if p["category"] == selected_cat]

    st.markdown("---")

    # Margin cards
    for p in filtered:
        with st.container():
            col1, col2, col3, col4, col5 = st.columns([3, 2, 2, 2, 2])

            sell = p.get("my_sell_price") or 0
            cost = p["latest_price_vnd"]
            gross_profit = sell - cost
            gross_margin = (gross_profit / sell * 100) if sell else 0

            # Estimate net margin (platform fee 6%, ads 15%, shipping 15K, packaging 3K)
            platform_fee = sell * 0.06
            ads = sell * 0.15
            shipping = 15000
            packaging = 3000
            net_profit = sell - cost - platform_fee - ads - shipping - packaging
            net_margin = (net_profit / sell * 100) if sell else 0

            col1.markdown(f"**{p['name']}**")
            col2.metric("Cost", format_vnd(cost))
            col3.metric("Sell Price", format_vnd(sell))
            col4.metric("Gross Margin", f"{gross_margin:.1f}%")

            if net_margin > 15:
                col5.metric("Est. Net Margin", f"{net_margin:.1f}%", delta="Good", delta_color="off")
            elif net_margin > 0:
                col5.metric("Est. Net Margin", f"{net_margin:.1f}%", delta="Low", delta_color="off")
            else:
                col5.metric("Est. Net Margin", f"{net_margin:.1f}%", delta="Loss!", delta_color="inverse")

            st.markdown("---")

    # Custom calculator
    st.subheader("🧮 Custom Calculator")
    st.markdown("Enter your own numbers to calculate margins:")

    ccol1, ccol2, ccol3 = st.columns(3)
    custom_cost = ccol1.number_input("Cost (VND)", min_value=0, value=50000, step=1000)
    custom_sell = ccol2.number_input("Sell Price (VND)", min_value=0, value=149000, step=1000)
    custom_ads = ccol3.number_input("Ads %", min_value=0, max_value=100, value=15, step=1)

    custom_platform = st.slider("Platform fee %", 0, 20, 6)
    custom_ship = st.number_input("Shipping (VND)", min_value=0, value=15000, step=1000)
    custom_pkg = st.number_input("Packaging (VND)", min_value=0, value=3000, step=500)

    custom_gross = custom_sell - custom_cost
    custom_net = custom_sell - custom_cost - (custom_sell * custom_platform / 100) - (custom_sell * custom_ads / 100) - custom_ship - custom_pkg

    st.markdown("---")
    mcol1, mcol2, mcol3 = st.columns(3)
    mcol1.metric("Gross Profit", format_vnd(custom_gross))
    mcol2.metric("Gross Margin", f"{custom_gross/custom_sell*100:.1f}%" if custom_sell else "N/A")
    mcol3.metric("Net Profit", format_vnd(custom_net), delta=f"{custom_net/custom_sell*100:.1f}%" if custom_sell else "")


# ──── MANUAL ENTRY PAGE ────

elif page == "✏️ Manual Entry":
    st.title("✏️ Manual Price Entry")

    st.markdown("Enter prices manually for products that can't be scraped automatically.")

    products = get_all_products()
    manual_products = [p for p in products if p["platform"] == "manual"]

    if not manual_products:
        st.info("No manual products in config. Add products with platform: 'manual' in config.yaml.")
        st.stop()

    for p in manual_products:
        with st.form(f"form_{p['id']}"):
            st.markdown(f"**{p['name']}**")
            st.markdown(f"Category: {p['category']} | Sell price: {format_vnd(p.get('my_sell_price'))}")

            price_input = st.number_input(
                f"Price (VND):",
                min_value=0,
                value=0,
                step=1000,
                key=f"price_{p['id']}"
            )

            stock_input = st.text_input("Stock info (optional):", key=f"stock_{p['id']}")

            submitted = st.form_submit_button("Save Price")

            if submitted and price_input > 0:
                save_price(p["id"], price_input, "VND", int(price_input), stock_input, "Manual entry via dashboard")
                st.success(f"Saved: {price_input:,.0f} VND for {p['name']}")

    # Bulk quick entry for ALL products
    st.markdown("---")
    st.subheader("📋 Bulk Quick Entry")
    st.markdown("Enter prices for all products at once. Useful after browsing supplier websites manually.")

    with st.form("bulk_entry_form"):
        bulk_data = []
        for p in products:
            cols = st.columns([3, 2, 2])
            cols[0].markdown(f"**{p['name']}**")
            cols[1].markdown(f"Platform: {p['platform']}")
            price_val = cols[2].number_input(
                "Price (VND)",
                min_value=0,
                value=0,
                step=1000,
                key=f"bulk_{p['id']}",
                label_visibility="collapsed",
            )
            if price_val > 0:
                bulk_data.append((p, price_val))

        submitted = st.form_submit_button("💾 Save All Prices")

        if submitted and bulk_data:
            for product, price in bulk_data:
                save_price(product["id"], price, "VND", int(price), "", "Bulk entry via dashboard")
            st.success(f"✅ Saved {len(bulk_data)} prices!")
            st.rerun()

    # Also allow manual entry for any product (override)
    st.markdown("---")
    st.subheader("Override Any Product Price")
    st.markdown("Use this to manually enter a price for any product (e.g. if scraping failed).")

    all_names = [p["name"] for p in products]
    override_name = st.selectbox("Select product:", all_names, key="override_select")
    override_price = st.number_input("Price (VND):", min_value=0, value=0, step=1000, key="override_price")

    if st.button("Save Override Price") and override_price > 0:
        override_product = next(p for p in products if p["name"] == override_name)
        save_price(override_product["id"], override_price, "VND", int(override_price), "", "Manual override via dashboard")
        st.success(f"Saved: {override_price:,.0f} VND for {override_name}")


# ──── ADD PRODUCT PAGE ────

elif page == "➕ Add Product":
    st.title("➕ Add New Product")

    st.markdown("Add a new product to track. It will be saved to config.yaml and the database.")

    with st.form("add_product_form"):
        col1, col2 = st.columns(2)

        name = col1.text_input("Product Name *", placeholder="e.g. Neck Fan - Competitor A")
        category = col2.text_input("Category", placeholder="e.g. Tech Accessories")

        col3, col4 = st.columns(2)
        role = col3.selectbox("Role *", ["supplier", "competitor"], help="supplier = China source, competitor = Vietnam seller")
        platform = col4.selectbox("Platform *", ["manual", "alibaba", "1688", "shopee", "taobao"],
                                   help="manual = enter prices yourself")

        url = st.text_input("Product URL", placeholder="https://detail.1688.com/offer/123456.html")
        sell_price = st.number_input("Your Sell Price (VND)", min_value=0, value=0, step=1000)

        submitted = st.form_submit_button("➕ Add Product")

        if submitted and name:
            # Load current config
            import yaml
            config_path = Path(__file__).parent / "config.yaml"
            with open(config_path, "r", encoding="utf-8") as f:
                cfg = yaml.safe_load(f)

            # Add new product
            new_product = {
                "name": name,
                "category": category or "Uncategorized",
                "role": role,
                "platform": platform,
                "url": url,
                "my_sell_price": sell_price if sell_price > 0 else None,
            }

            if "products" not in cfg:
                cfg["products"] = []
            cfg["products"].append(new_product)

            # Save config
            with open(config_path, "w", encoding="utf-8") as f:
                yaml.dump(cfg, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

            # Sync to database
            sync_products(cfg["products"])

            st.success(f"✅ Added: {name}")
            st.info("Go to 'Manual Entry' or 'Run Tracker' to start tracking its price.")
            st.rerun()

    # List existing products with delete option
    st.markdown("---")
    st.subheader("Existing Products")

    products = get_all_products()
    for p in products:
        col1, col2, col3 = st.columns([4, 2, 1])
        col1.markdown(f"**{p['name']}** ({p['platform']})")
        col2.markdown(f"{p.get('category', '')} | {p['role']}")
        if col3.button("🗑️", key=f"del_{p['id']}", help="Remove product"):
            # Remove from config.yaml
            config_path = Path(__file__).parent / "config.yaml"
            with open(config_path, "r", encoding="utf-8") as f:
                cfg = yaml.safe_load(f)

            cfg["products"] = [p2 for p2 in cfg.get("products", []) if p2["name"] != p["name"]]

            with open(config_path, "w", encoding="utf-8") as f:
                yaml.dump(cfg, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

            # Remove from database
            from db import get_connection
            conn = get_connection()
            conn.execute("DELETE FROM price_history WHERE product_id=?", (p["id"],))
            conn.execute("DELETE FROM products WHERE id=?", (p["id"],))
            conn.commit()
            conn.close()

            st.success(f"Removed: {p['name']}")
            st.rerun()


# ──── RUN TRACKER PAGE ────

elif page == "⚙️ Run Tracker":
    st.title("⚙️ Run Price Tracker")

    st.markdown("Click the button below to scrape all product prices from their sources.")

    st.markdown("""
    **What this does:**
    - Fetches current prices from 1688, Alibaba, Shopee
    - Saves prices to the database with timestamp
    - Updates the overview and product detail pages

    **Note:** Some sites (1688, Taobao) may block automated requests.
    If a product fails, use the Manual Entry page.
    """)

    if st.button("🚀 Track All Prices Now", type="primary"):
        with st.spinner("Fetching prices..."):
            track_all(verbose=False)

        st.success("✅ Tracking complete! Go to Overview to see results.")
        st.balloons()

    st.markdown("---")

    # Show last run info
    products = get_all_products()
    tracked = [p for p in products if p["latest_price"] is not None]
    failed = [p for p in products if p["latest_price"] is None and p["platform"] != "manual"]

    col1, col2, col3 = st.columns(3)
    col1.metric("Tracked Successfully", len(tracked))
    col2.metric("Failed", len(failed))
    col3.metric("Manual Entry", len([p for p in products if p["platform"] == "manual"]))

    if failed:
        st.markdown("---")
        st.subheader("⚠️ Failed Products")
        for p in failed:
            st.warning(f"{p['name']} ({p['platform']}) - Use Manual Entry to add price")
