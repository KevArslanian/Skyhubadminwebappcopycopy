# SkyHub Ultimate Blueprint

## 1. Product Positioning

**SkyHub** is a premium enterprise web platform for **air-cargo operations, airport cargo terminal handling, ground handoff coordination, and operational reporting**.

### Primary product goals
- help teams move cargo correctly, visibly, and on time
- reduce handoff confusion across warehouse, documentation, ramp, and station teams
- reduce document, status, and transfer errors
- surface exceptions early
- support enterprise-scale operations without making the UI feel bloated or confusing

### Design principles
- simple at the top level
- deep in the workflow
- every menu must have one clear job
- no duplicate top-level menus
- no decorative modules without operational value
- no fake complexity
- enterprise-grade does **not** mean crowded

---

## 2. Final Top-Level Information Architecture

### Top-level navigation
1. Dashboard
2. Cargo
3. Logistics
4. Reports
5. Logs
6. Settings

### Do not use as top-level menus
- Fleet
- Inventory
- Flights
- Analytics
- Help Center
- Support
- Sign Out

### Reason
Those are better placed as:
- sub-features
- filters
- panels
- detail views
- admin/settings content
- profile dropdown actions

This keeps the product enterprise-grade but not confusing.

---

## 3. Functional Separation Rules

## Dashboard
**Purpose:** operational overview only.

### Use Dashboard for
- today’s KPIs
- urgent exceptions
- shipments at risk
- delayed milestones
- recent critical events
- quick situational awareness for supervisors

### Do not use Dashboard for
- shipment editing
- cargo intake
- logistics dispatch execution
- report generation setup
- settings management
- full audit history

---

## Cargo
**Purpose:** shipment record correctness and cargo readiness.

### Use Cargo for
- AWB records
- shipment intake
- cargo attributes
- origin / destination
- weight / volume
- special handling flags
- document completeness
- cargo status progression
- shipment-level actions
- customs/doc readiness indicators

### Do not use Cargo for
- dispatch board
- warehouse movement board
- route execution
- analytics-heavy reporting
- audit history as main content

---

## Logistics
**Purpose:** physical movement and handoff execution.

### Use Logistics for
- warehouse handoff
- ramp transfer
- pickup / delivery task flow
- transfer execution
- route / station movement visibility
- active operational tasks
- operational queues
- vehicle / transfer / dock / gate awareness if needed

### Do not use Logistics for
- detailed AWB master record editing
- compliance-heavy report review
- settings management
- generic dashboard KPI duplication

---

## Reports
**Purpose:** analysis, trends, exports, and management review.

### Use Reports for
- throughput
- total weight handled
- on-time performance
- exception analysis
- route performance
- station performance
- document quality trends
- exportable report library
- SLA review
- executive summary with drilldown

### Do not use Reports for
- live operations dispatch
- shipment intake forms
- audit trail tables as primary focus
- settings panels
- another dashboard clone

---

## Logs
**Purpose:** audit trail and accountability.

### Use Logs for
- who did what
- when it happened
- target object
- previous status and new status
- system event trail
- API and automation event trace
- traceability and investigation workflows

### Do not use Logs for
- generic notifications feed
- dashboard summary clone
- report visualization
- operational task board

---

## Settings
**Purpose:** rules, defaults, permissions, integrations, and enterprise configuration.

### Use Settings for
- station configuration
- roles and permissions
- cargo workflow rules
- document rules
- ULD / warehouse defaults
- special cargo rules
- SLA and alert thresholds
- reporting and integration setup
- master operational defaults

### Do not use Settings for
- day-to-day operations tables
- cargo ledger
- dispatch board
- analytics dashboards

---

## 4. Shared Design System Lock

Use this exact shell across all internal screens.

### App shell
- Desktop frame: **1600 x 1280 px**
- Sidebar width: **240 px**
- Header height: **72 px**
- Main content starts at **x=272 px, y=104 px**
- Main content width: **1296 px**
- Major section gap: **20 px**
- Card radius: **16 px**
- Card padding: **20 px**
- Input height: **40 px**
- Primary button height: **40 px**
- Secondary button height: **32 px**
- Table row height: **52 px**

### Sidebar
Order must stay fixed:
1. Dashboard
2. Cargo
3. Logistics
4. Reports
5. Logs
6. Settings

### Header
Keep identical on all internal screens:
- left: global search
- right: notification icon, utility icon, user name, role, avatar

### Visual language
- premium dark enterprise style
- restrained modern look
- subtle borders
- quiet surface contrast
- cobalt blue active accents
- no random colorful consumer-app styling

### Consistency lock
Do not change:
- logo
- avatar style
- sidebar structure
- header structure
- typography scale
- spacing scale
- card system
- button system
- table system
- badge style
- icon family

---

## 5. Shared Core Entities

All menus should revolve around the same data backbone.

### Core entities
- Shipment
- AWB
- Station
- Route
- Cargo Type
- Special Handling Code
- Document Set
- Handoff Event
- Movement Task
- ULD / Container
- Alert / Exception
- Report
- Audit Event
- User
- Role
- SLA Rule
- Integration Endpoint

This makes the app feel like one product, not separate templates.

---

## 6. Enterprise-Grade Differentiators That Are Still Realistic

These are the features that make SkyHub feel premium and serious without becoming fake or overcomplicated.

### 1. Exception-first operations
Instead of showing only generic KPIs, prioritize:
- delayed handoff
- missing documents
- customs hold
- exception clusters
- shipment at risk
- SLA breach risk

### 2. Document completeness and readiness
Every shipment should clearly show:
- required docs present/missing
- readiness state
- compliance flags
- special handling requirement visibility

### 3. Station-scoped operations
Users should be able to work by:
- station
- route
- team
- shift
- time window

### 4. Handoff visibility
A serious cargo system should show:
- where the shipment is
- who last touched it
- what milestone is next
- whether the handoff is blocked

### 5. Rule-driven operations
Enterprise settings should drive:
- default workflow
- status transitions
- alert thresholds
- operational cutoffs
- escalation logic

### 6. Traceability
Every meaningful change should be auditable:
- who changed status
- who uploaded docs
- who acknowledged an exception
- when an automation fired
- what integration updated a shipment

### 7. Export-ready reporting
Reports should support:
- management review
- station review
- route review
- compliance review
- export and scheduled reporting

---

## 7. Blueprint Per Menu

# Dashboard Blueprint

## Role
Supervisor / ops lead overview screen.

## Main goal
Answer: **What needs attention right now?**

## Recommended modules
1. KPI row
   - Total Shipments Today
   - In Transit
   - Delivered
   - Exceptions Open

2. Priority exceptions card
   - shipments blocked
   - delayed milestones
   - customs/doc issues
   - urgent special cargo issues

3. At-risk shipments table
   - AWB
   - route
   - current status
   - exception reason
   - elapsed time
   - owner

4. Compact operational trend
   - shipment volume trend
   - or on-time trend
   - only one strong chart

5. Recent critical events
   - last important updates
   - severity-based

## Recommended sub-tabs
- Overview
- Exceptions
- Station View

## Must avoid
- cargo intake form
- logistics execution board
- giant report builder
- settings forms
- too many charts

---

# Cargo Blueprint

## Role
Documentation team, cargo admin, cargo acceptance, shipment readiness.

## Main goal
Answer: **Is this shipment correct and ready to move?**

## Recommended modules
1. Filter/action row
   - search AWB
   - status
   - origin
   - destination
   - date range
   - New Shipment

2. Cargo ledger table
   Columns:
   - AWB Number
   - Commodity
   - Origin
   - Destination
   - Weight
   - Volume
   - Special Handling
   - Document Status
   - Readiness
   - Shipment Status
   - Updated
   - Actions

3. Shipment detail panel
   - parties
   - pieces / weight / volume
   - commodity
   - handling codes
   - linked docs
   - milestone summary

4. Readiness / compliance panel
   - docs complete
   - special handling flags
   - customs/doc warning
   - acceptance state

5. Quick shipment actions
   - update status
   - attach docs
   - flag exception
   - assign owner

## Recommended sub-tabs
- Ledger
- Intake
- Documents
- Exceptions

## Must avoid
- dashboard KPI overload
- dispatch board
- logistics movement timeline as main focus
- random analytics modules

---

# Logistics Blueprint

## Role
Warehouse, transfer, ramp coordination, movement operations.

## Main goal
Answer: **What must be physically moved, handed off, or completed now?**

## Recommended modules
1. Filter/action row
   - task search
   - station
   - movement status
   - location
   - shift
   - Create Task / New Transfer

2. Operational summary row
   - Pending Pickup
   - In Warehouse
   - In Transfer
   - Out for Delivery

3. Logistics execution table
   Columns:
   - Task ID
   - Shipment / AWB
   - Type
   - Current Location
   - Next Handoff
   - Priority
   - Assigned Team
   - ETA / Deadline
   - Status
   - Actions

4. Active transfer / handoff panel
   - gate/dock/zone context
   - bottleneck visibility
   - blocked tasks

5. Optional compact operational units section
   - vehicles
   - transfer runs
   - active docks
   - warehouse zones

## Recommended sub-tabs
- Tasks
- Transfers
- Handoffs
- Active Units

## Must avoid
- AWB master-data heavy page
- dashboard clone
- reporting charts overload
- settings/admin forms

---

# Reports Blueprint

## Role
Management review, operational analytics, exported reporting.

## Main goal
Answer: **How are operations performing over time, and what should be exported or reviewed?**

## Recommended modules
1. Filter/export bar
   - date range
   - station
   - route
   - report type
   - status
   - Export Report

2. KPI row
   - Total Shipments
   - Total Weight Handled
   - On-Time Performance
   - Exceptions Rate

3. Analytics row
   - Shipment Volume Trend
   - Route / Commodity Breakdown

4. Generated reports table
   Columns:
   - Report ID
   - Type
   - Period
   - Station / Route
   - Records
   - Status
   - Generated At
   - Actions

5. Report detail view (from View button)
   - summary meta
   - KPI summary
   - chart
   - detail table
   - key findings

## Recommended sub-tabs
- Overview
- Generated Reports
- Scheduled Reports
- Compliance Reports

## Must avoid
- cargo intake
- dispatch board
- audit logs as main page
- too many decorative charts

---

# Logs Blueprint

## Role
Audit, investigation, accountability, support escalation.

## Main goal
Answer: **Who changed what, when, and why?**

## Recommended modules
1. Filter row
   - date range
   - user
   - role
   - action
   - target type
   - severity
   - search

2. Full-width audit log table
   Columns:
   - Time
   - User
   - Role
   - Action
   - Target
   - Previous Value
   - New Value
   - Station
   - Source
   - Severity
   - Details

3. Optional compact system events card
   - only if it does not reduce table readability

4. Drilldown detail drawer / detail view
   - event payload
   - linked entity
   - IP / automation / integration source
   - related shipment or task

## Recommended sub-tabs
- Audit Trail
- System Events
- Integration Events

## Must avoid
- KPI dashboard clone
- big charts
- cargo tables
- dispatch boards

---

# Settings Blueprint

## Role
Admin and operational configuration.

## Main goal
Answer: **How should the system behave, and who can do what?**

## Recommended secondary navigation
1. Organization & Station
2. Users & Roles
3. Cargo Operations
4. Documents & e-AWB
5. ULD & Warehouse
6. Special Cargo & Compliance
7. Alerts & SLA
8. Reporting & Integrations

## Recommended content pattern
- left secondary settings nav
- right active settings content
- stacked cards
- grouped fields
- preview tiles for other sections

## High-value settings content
### Organization & Station
- company name
- business unit
- station code
- timezone
- operating calendar
- cut-off times
- shift defaults

### Users & Roles
- role templates
- permission groups
- station-scoped access
- supervisor rights
- audit visibility scope

### Cargo Operations
- default workflow
- shipment statuses
- readiness rules
- priority rules
- exception categories

### Documents & e-AWB
- required document rules
- digital doc defaults
- completeness checks
- route-based doc rules
- integration flags

### ULD & Warehouse
- ULD types
- warehouse zones
- handoff checkpoints
- transfer scan requirements
- build-up rules

### Special Cargo & Compliance
- dangerous goods flags
- perishables / cold-chain defaults
- pharma workflow
- inspection routing
- customs hold behavior

### Alerts & SLA
- late handoff alert
- missing doc alert
- dwell threshold
- SLA thresholds
- escalation rules

### Reporting & Integrations
- scheduled exports
- retention defaults
- API endpoints
- webhook targets
- ERP / airline / customs connectors

## Must avoid
- consumer-app style settings
- billing clutter
- marketing preferences
- one giant unstructured form
- excessive toggles with no grouping

---

## 8. Global UX Rules

### Rule 1: Exception-first
Important problems should rise above normal throughput.

### Rule 2: One task, one home
Every major feature should clearly belong to one menu.

### Rule 3: Table-first where appropriate
Enterprise cargo systems often rely on dense, readable tables.

### Rule 4: Details via drawer or detail page
Do not overload list screens with every field.

### Rule 5: Filters must be practical
Do not place 12 filters by default.
Use only the ones that affect work.

### Rule 6: Charts must justify their existence
If a chart does not help decision-making, remove it.

### Rule 7: Role-sensitive depth
The surface stays simple.
Depth appears through detail views, tabs, drawers, and settings.

---

## 9. Universal Figma Make Prompt

Use this as the base prompt before screen-specific prompts.

```text
Create a high-consistency desktop web admin product called "SkyHub" for air cargo and airport cargo operations.

Critical consistency rules:
- all screens must look like the same exact product
- do not redesign each page separately
- use one identical shell for all internal pages
- use one identical logo only: SkyHub
- never rename the product
- use one identical avatar style only
- use one identical icon family only
- use one identical typography scale only
- use one identical spacing scale only
- use one identical button system only
- use one identical input system only
- use one identical table style only
- use one identical card style only
- use one identical badge style only

Desktop canvas:
- 1600 x 1280 px

Internal app shell:
- sidebar width 240 px
- header height 72 px
- main content starts at x=272 px and y=104 px
- content width 1296 px
- card radius 16 px
- card padding 20 px
- input height 40 px
- primary button height 40 px
- secondary button height 32 px
- table row height 52 px

Top-level navigation order:
1. Dashboard
2. Cargo
3. Logistics
4. Reports
5. Logs
6. Settings

Functional separation:
- Dashboard = operational overview only
- Cargo = shipment correctness and readiness
- Logistics = physical movement and handoff execution
- Reports = trends, exports, management review
- Logs = audit and event traceability
- Settings = rules, permissions, integrations, enterprise configuration

Do not include top-level:
- Fleet
- Inventory
- Flights
- Analytics
- Help Center
- Support
- Sign Out

Visual language:
- premium dark enterprise interface
- restrained modern aesthetic
- operational, clean, realistic
- subtle borders
- quiet surfaces
- cobalt blue active accents
- no playful consumer styling
```

---

## 10. Screen-Specific Prompt Anchors

### Dashboard anchor
```text
Create Dashboard as an operational overview page only.
Focus on today’s KPIs, urgent exceptions, at-risk shipments, one compact operational trend, and recent critical events.
Do not place shipment intake, dispatch board, report builder, or settings modules here.
```

### Cargo anchor
```text
Create Cargo as the shipment correctness and readiness workspace.
Focus on AWB ledger, shipment data, document completeness, special handling flags, readiness, and shipment-level actions.
Do not make Cargo look like Dashboard.
Do not make Cargo into a logistics movement board.
```

### Logistics anchor
```text
Create Logistics as the physical movement and handoff execution workspace.
Focus on tasks, transfers, handoffs, current locations, deadlines, priorities, and active operational units.
Do not duplicate Cargo master-record functions.
```

### Reports anchor
```text
Create Reports as the analysis and export workspace.
Focus on throughput, total weight, on-time performance, exceptions, trends, generated reports, and export-ready outputs.
Do not make Reports another dashboard clone.
```

### Logs anchor
```text
Create Logs as the audit trail workspace.
Focus on event traceability, actor visibility, target objects, previous/new values, source, severity, and details.
Keep it dense, clean, and table-first.
```

### Settings anchor
```text
Create Settings as an enterprise configuration workspace with secondary navigation.
Include Organization & Station, Users & Roles, Cargo Operations, Documents & e-AWB, ULD & Warehouse, Special Cargo & Compliance, Alerts & SLA, and Reporting & Integrations.
Keep it structured, serious, and not bloated.
```

---

## 11. Final Decision Rules for Ambiguous Features

Use these rules whenever a feature could fit in more than one menu.

- If it is about **shipment correctness or readiness**, place it in **Cargo**
- If it is about **physical movement or handoff**, place it in **Logistics**
- If it is about **summary, trend, export, or review**, place it in **Reports**
- If it is about **who changed what**, place it in **Logs**
- If it is about **rules, defaults, permissions, or connectors**, place it in **Settings**
- If it is about **urgent cross-workspace awareness**, place it in **Dashboard**

---

## 12. Final Outcome

A mature SkyHub product should feel:
- consistent
- operational
- premium
- enterprise-grade
- realistic
- not crowded
- not fake-complex
- easy to learn at the top level
- deep enough for real cargo operations underneath
