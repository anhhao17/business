# Business Tracker - How to Use

> 4 CSV files for tracking your import business. Open in Excel, Google Sheets, or LibreOffice.

---

## Files Overview

| File | Purpose | Update Frequency |
|---|---|---|
| `tracker_orders.csv` | Track orders from China agents | When placing/receiving orders |
| `tracker_sales.csv` | Track individual sales on Shopee/TikTok | Daily (each sale) |
| `tracker_inventory.csv` | Track stock levels + margins | Weekly |
| `tracker_monthly.csv` | Monthly P&L summary | End of each month |

---

## 1. tracker_orders.csv - Import Orders

Track every order you place with Chinese suppliers via agents.

### Columns

| Column | Description | Example |
|---|---|---|
| OrderID | Your order reference | ORD-001 |
| Date | Order date | 2026-07-15 |
| Agent | Agent name | Mã Tốc |
| Product Name | Product name | Neck Fan USB |
| Supplier Link | 1688/Taobao/Alibaba link | https://... |
| Quantity | Number of units | 100 |
| Unit Cost (VND) | Product cost per unit | 27650 |
| Agent Fee (VND) | Agent service fee per unit | 2212 |
| Shipping/Unit (VND) | Shipping cost per unit | 7125 |
| Customs/Unit (VND) | Customs + tax per unit | 1383 |
| Total Landed/Unit (VND) | Sum of all costs per unit | 38370 |
| Total Order Cost (VND) | Total Landed × Quantity | 3837000 |
| Status | Pending / In Transit / Received / Cancelled | Pending |
| Expected Delivery | Date expected | 2026-07-25 |
| Actual Delivery | Date actually received | 2026-07-24 |
| Notes | Any notes | First order |

### Status Values
- **Pending** - Order placed, waiting for agent to buy
- **In Transit** - Shipping from China to Vietnam
- **Customs** - At customs clearance
- **Received** - You received the goods
- **Cancelled** - Order cancelled

### Formula: Total Landed/Unit
```
Total Landed/Unit = Unit Cost + Agent Fee + Shipping/Unit + Customs/Unit
```

### Formula: Total Order Cost
```
Total Order Cost = Total Landed/Unit × Quantity
```

---

## 2. tracker_sales.csv - Individual Sales

Track every sale on Shopee and TikTok Shop.

### Columns

| Column | Description | Example |
|---|---|---|
| SaleID | Your sale reference | SALE-001 |
| Date | Sale date | 2026-08-01 |
| Platform | Shopee / TikTok | Shopee |
| Product Name | Product name | Neck Fan USB |
| Order Ref | Platform order number | SPX001 |
| Quantity | Units sold | 1 |
| Sell Price (VND) | Price per unit | 149000 |
| Platform Fee (VND) | Shopee/TikTok commission | 8940 |
| Ads Cost (VND) | Ad spend attributed to this sale | 22350 |
| Shipping Cost (VND) | Shipping to customer | 15000 |
| Packaging (VND) | Box + bubble wrap + tape | 3000 |
| COGS (VND) | Cost of goods sold (from inventory) | 38370 |
| Net Profit (VND) | Sell Price - all costs | 61340 |
| Status | Delivered / Returned / Cancelled | Delivered |
| Customer Note | Any notes | Bundle order |

### Formula: Net Profit
```
Net Profit = (Sell Price × Quantity) - Platform Fee - Ads Cost - Shipping - Packaging - (COGS × Quantity)
```

### Example Calculation (Neck Fan, 1 unit)
```
Revenue:        149,000
- Platform fee:  -8,940 (6%)
- Ads:          -22,350 (15%)
- Shipping:     -15,000
- Packaging:     -3,000
- COGS:         -38,370
= Net Profit:   61,340 (41%)
```

---

## 3. tracker_inventory.csv - Stock Management

Track your stock levels and know when to reorder.

### Columns

| Column | Description | Example |
|---|---|---|
| ProductID | Your product reference | P001 |
| Product Name | Product name | Neck Fan USB |
| Category | Product category | Tech Accessories |
| Source Platform | 1688 / Alibaba / etc | 1688 |
| Supplier Link | Direct link | https://... |
| Unit Cost (VND) | Product cost | 27650 |
| Landed Cost (VND) | Total cost including shipping/tax | 38370 |
| Sell Price (VND) | Your selling price | 149000 |
| Gross Margin (VND) | Sell Price - Landed Cost | 110630 |
| Gross Margin % | Margin percentage | 74% |
| Stock On Hand | Units currently in stock | 100 |
| Stock In Transit | Units ordered but not received | 0 |
| Reorder Point | When to reorder (stock level) | 30 |
| Reorder Qty | How many to reorder | 100 |
| Last Restock Date | Date of last restock | 2026-07-25 |
| Days Since Last Sale | Days since last sale | 0 |
| Status | Active / Out of Stock / Pending | Active |

### Reorder Logic
- When **Stock On Hand** ≤ **Reorder Point** → place new order
- **Reorder Qty** = how many units to order (based on sales velocity)

### Status Values
- **Active** - Selling normally
- **Out of Stock** - No stock, need to reorder urgently
- **Pending Certification** - Waiting for product certification
- **Discontinued** - No longer selling

---

## 4. tracker_monthly.csv - Monthly P&L Summary

Track your monthly performance by platform and category.

### Columns

| Column | Description |
|---|---|
| Month | YYYY-MM format |
| Platform | Shopee / TikTok / Total |
| Product Category | Tech Accessories / Smart Home / etc |
| Units Sold | Total units sold that month |
| Revenue (VND) | Total revenue |
| COGS (VND) | Total cost of goods sold |
| Platform Fees (VND) | Total platform commissions |
| Ads Cost (VND) | Total ad spend |
| Shipping (VND) | Total shipping costs |
| Packaging (VND) | Total packaging costs |
| Returns Cost (VND) | Cost of returned items |
| Total Costs (VND) | Sum of all costs |
| Net Profit (VND) | Revenue - Total Costs |
| Net Margin % | Net Profit / Revenue |
| Notes | Monthly notes |

### Formula: Total Costs
```
Total Costs = COGS + Platform Fees + Ads + Shipping + Packaging + Returns Cost
```

### Formula: Net Profit
```
Net Profit = Revenue - Total Costs
```

---

## How to Use in Google Sheets (Recommended)

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new spreadsheet
3. File → Import → Upload each CSV file
4. Each CSV becomes a tab/sheet
5. Use formulas to auto-calculate (see below)

### Useful Google Sheets Formulas

**Auto-calculate Total Landed Cost (in tracker_orders.csv):**
```
=SUM(F2:I2)  // Unit Cost + Agent Fee + Shipping + Customs
```

**Auto-calculate Total Order Cost:**
```
=K2*E2  // Total Landed/Unit × Quantity
```

**Auto-calculate Net Profit (in tracker_sales.csv):**
```
=(G2*E2)-H2-I2-J2-K2-(L2*E2)  // Revenue - Fees - Ads - Shipping - Packaging - COGS
```

**Sum monthly sales (in tracker_monthly.csv):**
```
=SUMIFS(tracker_sales!E:E, tracker_sales!B:B, ">="&DATE(2026,8,1), tracker_sales!B:B, "<="&DATE(2026,8,31))
```

---

## Recommended Workflow

### Daily (5 minutes)
1. Add each new sale to `tracker_sales.csv`
2. Update `tracker_inventory.csv` stock (decrement sold units)
3. Check if any product hit reorder point

### Weekly (15 minutes)
1. Review `tracker_sales.csv` - which products are selling?
2. Update `tracker_inventory.csv` - check stock levels
3. Place reorder if any product below reorder point
4. Add new order to `tracker_orders.csv`

### Monthly (30 minutes)
1. Fill in `tracker_monthly.csv` with month's totals
2. Calculate net profit for the month
3. Review which products are profitable, which are not
4. Decide: restock winners, discontinue losers
5. Plan next month's ad budget based on what worked

### Key Metrics to Watch

| Metric | Target | Action if Below |
|---|---|---|
| Net margin | >15% | Raise prices or find cheaper supplier |
| Return rate | <10% | Check product quality |
| Days since last sale | <7 | Boost ads or lower price |
| Stock turnover | <30 days | Don't reorder, sell what you have |
| Ad ROAS | >3x | Kill ad, try new creative |

---

## Tips

1. **Back up your files** - save copies monthly or use Google Sheets (auto-saved)
2. **Be honest with numbers** - don't hide costs from yourself
3. **Track EVERY sale** - even small ones, patterns emerge over time
4. **Review weekly** - don't wait until month-end to spot problems
5. **Use the data** - if a product isn't selling after 30 days, drop it
6. **Compare platforms** - Shopee vs TikTok, which gives better ROI?
