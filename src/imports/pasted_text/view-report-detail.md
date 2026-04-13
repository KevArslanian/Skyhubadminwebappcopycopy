Using the approved SkyHub design system, create a full-page "View Report" detail screen opened from the Reports table.

Critical rule:
Do not redesign the shell.
Keep the exact same sidebar, header, spacing system, typography scale, icon family, card radius, input style, button style, and table style as the Reports page.
This screen must look like the same exact product.

SCREEN TYPE
This is a read-only report detail page, not an edit form.
It is opened when the user clicks the "View" action in the Generated Reports table.

CANVAS
- Desktop frame: 1600 x 1280 px

GLOBAL APP SHELL
- Sidebar fixed on the left, identical to Reports
- Header fixed on top, identical to Reports
- Main content wrapper starts at x=272, y=104, width=1296

PAGE CONTEXT
This report is opened from:
- Report ID: RPT-2026-0412
- Report Type: Monthly Volume
- Period: Mar 2026
- Station / Route: HKG
- Status: Complete
- Generated At: Apr 1, 08:00

PAGE HEADER BLOCK
Position:
- x=272, y=104, width=1296, height=64

Content:
- breadcrumb: Reports / Generated Reports / RPT-2026-0412
- page title: Monthly Volume Report
- subtitle: Detailed reporting view for March 2026 cargo throughput and performance
- top-right actions:
  - Export PDF
  - Download CSV
  - Back to Reports

Layout rule:
- title area left aligned
- action buttons right aligned
- keep clean and balanced

SECTION 1 — REPORT META CARD
Position:
- x=272, y=184, width=1296, height=108

Card content in 5 compact meta blocks:
1. Report ID: RPT-2026-0412
2. Type: Monthly Volume
3. Period: Mar 2026
4. Station: HKG
5. Generated: Apr 1, 08:00

Optional small badge:
- Status: Complete

Style:
- one horizontal metadata card
- clean operational look
- no unnecessary decoration

SECTION 2 — KPI SUMMARY ROW
Position:
- x=272, y=312, width=1296, height=108

Layout:
- 4 equal KPI cards
- each width about 312 px
- gap 16 px
- height 108 px

KPI cards:
1. Total Shipments
   - 2,450
   - +8.4% vs previous month
2. Total Weight
   - 67.8 t
   - +6.1% vs previous month
3. On-Time Performance
   - 94.2%
   - +1.8% improvement
4. Avg Transit Time
   - 3.2 days
   - -0.4 day improvement

Design rules:
- simple and readable
- no sparkline
- label top left
- small icon top right
- large value below
- small delta text below value

SECTION 3 — MAIN ANALYTICS ROW
Position:
- x=272, y=440, width=1296, height=320

Layout:
- left large chart card: width 792, height 320
- right side breakdown card: width 488, height 320
- gap 16 px

Left card:
- title: Shipment Volume Trend
- top-right helper label: Mar 2026 vs previous periods
- use a clean line chart
- x-axis: Week 1, Week 2, Week 3, Week 4
- y-axis with realistic shipment scale
- only 1 or 2 clean data series maximum

Right card:
- title: Route / Commodity Breakdown
Choose one:
- donut chart for commodity mix
or
- horizontal bar chart for top routes
Use the one that feels clearest.
Recommended for this report: horizontal bar chart for top routes

Suggested route entries:
- HKG → SIN
- HKG → LAX
- HKG → NRT
- HKG → CGK
- HKG → DXB

SECTION 4 — DETAIL TABLE CARD
Position:
- x=272, y=780, width=1296, height=360

Card title:
- Report Details

Use a full-width table with the following columns:
- Route / Station
- Shipments
- Weight
- On-Time %
- Avg Transit Time
- Exceptions
- Remarks

Create 6 realistic rows.
Example rows:
1.
- HKG → SIN
- 520
- 12.4 t
- 96.1%
- 2.1 days
- 8
- Stable performance

2.
- HKG → LAX
- 410
- 14.7 t
- 91.8%
- 4.8 days
- 16
- Minor customs delay

3.
- HKG → NRT
- 390
- 10.5 t
- 95.0%
- 2.7 days
- 7
- Within SLA

4.
- HKG → CGK
- 360
- 9.2 t
- 93.2%
- 3.0 days
- 10
- Slight warehouse delay

5.
- HKG → DXB
- 340
- 11.0 t
- 92.4%
- 3.9 days
- 12
- Documentation checks

6.
- HKG Domestic Transfer
- 430
- 10.0 t
- 97.3%
- 1.4 days
- 4
- Strong local throughput

SECTION 5 — INSIGHT / SUMMARY CARD
Place a compact summary card below the detail table or as a footer section inside the same lower area if visually cleaner.

Title:
- Key Findings

Content:
Use 4 short bullet insights:
- Highest shipment concentration was on HKG → SIN and HKG → LAX
- On-time performance remained above 94% overall
- LAX routes showed the highest exception count due to customs-related checks
- Domestic transfer throughput performed best with lowest average transit time

STYLE RULES
- This page must feel like a professional read-only report view
- Keep it highly scannable
- Keep it balanced
- Avoid empty large gaps
- Avoid unnecessary extra widgets
- Avoid settings-like forms
- Avoid dashboard-like duplicate sections
- Avoid too many charts

DO NOT INCLUDE
- edit form fields
- cargo intake forms
- dispatch boards
- audit logs
- profile settings
- irrelevant finance widgets
- random side towers

VISUAL GOAL
A polished, realistic, production-ready report detail page that opens from the "View" button in Reports and is perfect for screenshot reference into Stitch.