Use the approved SkyHub design system and keep the exact same shell as the other internal pages.

This is a strict layout-controlled page build.
Do not redesign the shell.
Do not change the sidebar, header, spacing system, typography scale, icon family, button style, input style, card radius, table style, or brand identity.

Create the Reports page for an air cargo and logistics operations platform.

PAGE PURPOSE
This page is for structured operational reporting, KPI review, trend analysis, exportable reports, exception monitoring, and compliance visibility.
It must feel analytical, operational, and export-ready.
It must not feel like another Dashboard clone.

CANVAS

* Desktop frame: 1600 x 1280 px

GLOBAL APP SHELL

* Left sidebar: x=0, y=0, width=240, height=1280
* Top header: x=240, y=0, width=1360, height=72
* Main content wrapper: x=272, y=104, width=1296, height=1144
* Outer content padding inside main area: 0
* Vertical spacing between major sections: 20 px
* Card radius: 16 px
* Card padding: 20 px
* Input height: 40 px
* Primary button height: 40 px
* Secondary button height: 32 px
* Table row height: 52 px
* Grid logic: 12-column feeling, but build using exact cards below

SIDEBAR
Keep identical to the approved shell:

* Logo: SkyHub
* Menu items in this order:

  1. Dashboard
  2. Cargo
  3. Logistics
  4. Reports
  5. Logs
  6. Settings
* Reports is the active item
* No Fleet
* No Inventory
* No Analytics as a separate top-level menu
* No Support as top-level
* No Sign Out as top-level

HEADER
Keep identical to the approved shell:

* Left: global search input
* Right: notification icon, help/settings shortcut if already in system, user name, role, avatar
* No extra widgets

REPORTS PAGE STRUCTURE

SECTION 1 — PAGE TITLE BLOCK
Position:

* x=272, y=104, width=1296, height=56

Content:

* Title: Reports
* Subtitle: Structured reporting, trend analysis, and data export

Typography:

* Title: 36 px semibold
* Subtitle: 14 px regular muted text

SECTION 2 — FILTER BAR CARD
Position:

* x=272, y=176, width=1296, height=72

Card style:

* clean surface
* subtle border
* 16 px radius
* 16 px horizontal internal gap between controls
* controls vertically centered

Inside layout from left to right:

* Start date input: width 136
* End date input: width 136
* Station filter: width 128
* Status filter: width 128
* Report type filter: width 152
* Flexible empty spacer
* Primary button: Export Report, width 152, height 40

Filter bar behavior:

* compact
* not crowded
* one horizontal row only
* no second row
* no giant filter chips

SECTION 3 — KPI ROW
Position:

* x=272, y=268, width=1296, height=108

Layout:

* 4 equal KPI cards in one row
* each card width 312
* gap 16 between cards
* card height 108

KPI cards:

1. Total Shipments

   * Main value example: 12,770
   * Delta: +8.4% vs previous period
2. Total Weight Handled

   * Main value example: 335.5 t
   * Delta: +6.1% vs previous period
3. On-Time Performance

   * Main value example: 94.2%
   * Delta: +1.8% improvement
4. Exceptions Rate

   * Main value example: 3.6%
   * Delta: -0.7% reduction

KPI design rules:

* label at top left
* small status/icon badge top right
* large number beneath
* green positive delta or muted red/orange negative delta
* no sparkline inside KPI cards
* keep cards simple and readable

SECTION 4 — ANALYTICS ROW
Position:

* x=272, y=396, width=1296, height=320

Layout:

* left card width 792, height 320
* right card width 488, height 320
* gap between cards: 16

Left analytics card:
Title: Shipment Volume Trend
Subtitle/top-right small text: Last 6 months
Chart type: smooth line chart
X-axis:

* Nov
* Dec
* Jan
* Feb
* Mar
* Apr
  Y-axis:
* realistic cargo volume scale
  Show one clear line only.
  Optional subtle filled area under line is allowed but keep minimal.

Right analytics card:
Title: Report Breakdown
Use one of these chart types only:

* donut chart for Commodity Breakdown
  or
* bar chart for Route Performance
  Choose the one that best fits the page visually, but only one chart.
  Legend should be compact and readable.

Recommended donut categories:

* Electronics
* Perishables
* Machinery
* Pharma
* Textiles
* Other

SECTION 5 — GENERATED REPORTS TABLE CARD
Position:

* x=272, y=736, width=1296, height=376

Card header area:

* title left: Generated Reports
* optional small count badge next to title
* right side secondary action button: Export All

Main table layout:
Use one full-width operational table

Table columns and approximate widths:

* Report ID: 120
* Type: 150
* Period: 110
* Station / Route: 140
* Records: 90
* Status: 100
* Generated: 120
* Actions: 110

Table rows:
Use 6 visible rows minimum

Example rows:
1.

* Report ID: RPT-2026-0412
* Type: Monthly Volume
* Period: Mar 2026
* Station / Route: HKG
* Records: 2,450
* Status: Complete
* Generated: Apr 1, 08:00
* Actions: View / Download

2.

* Report ID: RPT-2026-0398
* Type: Exception Summary
* Period: Mar 2026
* Station / Route: All
* Records: 147
* Status: Complete
* Generated: Apr 1, 08:00
* Actions: View / Download

3.

* Report ID: RPT-2026-0384
* Type: Route Performance
* Period: Q1 2026
* Station / Route: HKG – LAX
* Records: 820
* Status: Complete
* Generated: Apr 1, 09:15
* Actions: View / Download

4.

* Report ID: RPT-2026-0371
* Type: Customs Compliance
* Period: Mar 2026
* Station / Route: All
* Records: 2,450
* Status: Complete
* Generated: Mar 31, 18:00
* Actions: View / Download

5.

* Report ID: RPT-2026-0359
* Type: SLA Adherence
* Period: Feb 2026
* Station / Route: SIN
* Records: 1,640
* Status: Complete
* Generated: Mar 1, 09:30
* Actions: View / Download

6.

* Report ID: RPT-2026-0342
* Type: e-AWB Adoption
* Period: Feb 2026
* Station / Route: Network
* Records: 2,180
* Status: Complete
* Generated: Mar 1, 11:20
* Actions: View / Download

Status styling:

* use compact green badge for Complete
* yellow badge for Processing if needed
* red badge for Failed if needed
  Keep most rows complete to look realistic.

REPORTING LOGIC TO VISUALLY REFLECT
The page should clearly support these real operational reporting needs:

* shipment throughput
* cargo weight handled
* on-time performance
* exception analysis
* route performance
* station performance
* compliance and documentation quality
* export-ready reporting

APPROVED REPORT TYPES
Use these as dropdown/report options and table content:

* Monthly Volume
* Exception Summary
* Route Performance
* Customs Compliance
* SLA Adherence
* e-AWB Adoption
* Station Throughput
* Delay Analysis
* Commodity Mix
* On-Time Performance

DO NOT INCLUDE

* cargo intake forms
* dispatch board
* warehouse operations board
* audit log records
* profile/settings fields
* too many charts
* random finance widgets
* dashboard-style right-side stacked summary tower
* redundant cards with repeated information

VISUAL BALANCE RULES

* The page must be left-to-right balanced
* The KPI row must feel even
* The analytics row must feel spacious and clean
* The table must be the main lower anchor
* Avoid awkward empty gaps
* Avoid tiny charts
* Avoid over-compression
* Keep the page highly scannable

CONSISTENCY LOCK

* same shell as all SkyHub pages
* same sidebar width
* same header height
* same logo placement
* same avatar treatment
* same typography scale
* same spacing rhythm
* same card system
* same button language
* same border treatment
* same visual hierarchy

Final result:
A polished, realistic, highly usable Reports page for SkyHub that looks production-ready, highly consistent, and clearly separated from Dashboard, Cargo, Logistics, Logs, and Settings.
