"""
SQLite database module for price tracking.
Stores product info and price history.
"""
import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).parent / "data" / "prices.db"


def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_connection()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            role TEXT NOT NULL,          -- 'supplier' or 'competitor'
            platform TEXT NOT NULL,      -- '1688', 'alibaba', 'shopee', 'manual'
            url TEXT,
            my_sell_price INTEGER,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        );

        CREATE TABLE IF NOT EXISTS price_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            price REAL,                  -- price in original currency
            currency TEXT DEFAULT 'CNY', -- CNY, USD, VND
            price_vnd REAL,              -- converted to VND
            stock TEXT,                  -- stock info if available
            raw_data TEXT,               -- raw response snippet for debugging
            checked_at TEXT DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (product_id) REFERENCES products(id)
        );

        CREATE INDEX IF NOT EXISTS idx_price_product ON price_history(product_id);
        CREATE INDEX IF NOT EXISTS idx_price_date ON price_history(checked_at);
    """)
    conn.commit()
    conn.close()


def sync_products(config_products):
    """Sync products from config.yaml to database. Returns {config_name: product_id}."""
    conn = get_connection()
    name_to_id = {}

    for p in config_products:
        # Check if product exists (match by name + url)
        row = conn.execute(
            "SELECT id FROM products WHERE name = ? AND url = ?",
            (p["name"], p.get("url", ""))
        ).fetchone()

        if row:
            # Update
            conn.execute(
                "UPDATE products SET category=?, role=?, platform=?, my_sell_price=? WHERE id=?",
                (p.get("category"), p["role"], p["platform"], p.get("my_sell_price"), row["id"])
            )
            name_to_id[p["name"]] = row["id"]
        else:
            # Insert
            cur = conn.execute(
                "INSERT INTO products (name, category, role, platform, url, my_sell_price) VALUES (?, ?, ?, ?, ?, ?)",
                (p["name"], p.get("category"), p["role"], p["platform"], p.get("url", ""), p.get("my_sell_price"))
            )
            name_to_id[p["name"]] = cur.lastrowid

    conn.commit()
    conn.close()
    return name_to_id


def save_price(product_id, price, currency, price_vnd, stock="", raw_data=""):
    """Save a price point to history."""
    conn = get_connection()
    conn.execute(
        "INSERT INTO price_history (product_id, price, currency, price_vnd, stock, raw_data) VALUES (?, ?, ?, ?, ?, ?)",
        (product_id, price, currency, price_vnd, stock, raw_data)
    )
    conn.commit()
    conn.close()


def get_all_products():
    """Get all products with their latest price."""
    conn = get_connection()
    products = conn.execute("SELECT * FROM products ORDER BY category, name").fetchall()

    result = []
    for p in products:
        latest = conn.execute(
            "SELECT * FROM price_history WHERE product_id=? ORDER BY checked_at DESC LIMIT 1",
            (p["id"],)
        ).fetchone()

        prev = conn.execute(
            "SELECT * FROM price_history WHERE product_id=? ORDER BY checked_at DESC LIMIT 1 OFFSET 1",
            (p["id"],)
        ).fetchone()

        result.append({
            "id": p["id"],
            "name": p["name"],
            "category": p["category"],
            "role": p["role"],
            "platform": p["platform"],
            "url": p["url"],
            "my_sell_price": p["my_sell_price"],
            "latest_price": latest["price"] if latest else None,
            "latest_currency": latest["currency"] if latest else None,
            "latest_price_vnd": latest["price_vnd"] if latest else None,
            "latest_stock": latest["stock"] if latest else None,
            "latest_date": latest["checked_at"] if latest else None,
            "prev_price_vnd": prev["price_vnd"] if prev else None,
            "price_change": ((latest["price_vnd"] - prev["price_vnd"]) / prev["price_vnd"] * 100)
                            if (latest and prev and prev["price_vnd"]) else None,
        })

    conn.close()
    return result


def get_price_history(product_id, limit=90):
    """Get price history for a product (last N entries)."""
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM price_history WHERE product_id=? ORDER BY checked_at DESC LIMIT ?",
        (product_id, limit)
    ).fetchall()
    conn.close()
    return [dict(r) for r in reversed(rows)]


def get_product_by_id(product_id):
    """Get single product info."""
    conn = get_connection()
    row = conn.execute("SELECT * FROM products WHERE id=?", (product_id,)).fetchone()
    conn.close()
    return dict(row) if row else None
