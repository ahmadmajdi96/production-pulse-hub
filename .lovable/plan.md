

## EA1: Operator Floor Display — Full UI Build

Build the Operator Floor Display edge app with all 9 screens, matching Production Pulse's dark industrial design (dark background `220 20% 7%`, blue primary `210 100% 56%`, Inter/JetBrains Mono fonts, status color system).

### Design System Setup
- Port Production Pulse's CSS variables, status badge classes, fonts, and color tokens into this project
- Add status colors (running/idle/transition/down/normal/monitor/warning/critical)
- Add custom component classes: `data-card`, `metric-value`, `metric-label`, `pulse-dot`

### App Structure
- Bottom tab navigation (since this is a wall-mounted HMI, tabs stay persistent): **Run Status** | **CCP** | **SPC** | **Alerts** | **Shift**
- Full-screen layout optimized for 15"–24" landscape displays
- Andon call button always visible as a floating action button on every screen
- Mock data layer with realistic production values

### Screen 1: Active Run Status (Default/Home)
- **Run status header**: Product name (36pt+), SKU, run ID, status badge (RUNNING/PAUSED/TRANSITION/CIP), elapsed time, pause button
- **Inline quality gauges**: 4–6 circular gauges (Brix, pH, Temperature, Viscosity, Flow) with green/amber/red color bands, current values updating with simulated data
- **Throughput rate bar**: Horizontal bar showing actual vs target cases/hour with percentage variance
- **Active work instruction step panel**: Current step number, title, instruction text, green ACKNOWLEDGE button
- **Clocked-on operators list**: Bottom-right strip showing operator names, roles, clock-on times

### Screen 2: CCP Monitoring Display
- **CCP panel grid**: Grid of CCP panels with current value, critical limits, trend arrows, color-coded backgrounds
- **CCP deviation banner**: Full-width red flashing banner on breach
- **Manual CCP record entry**: Large numeric keypad overlay for manual temperature/reading entry

### Screen 3: SPC Live Control Chart
- **X-bar control chart**: Last 25 subgroups plotted with UCL/LCL/mean lines, Western Electric violations as red dots, Cpk display
- **Rule violation indicator**: Amber banner with plain-language rule description

### Screen 4: Alert Display
- **CRITICAL alert full-screen takeover**: Red background, 48pt alert message, acknowledge button
- **HIGH alert banner overlay**: Amber banner at top of run status screen
- **Alert history strip**: Last 3 alerts with timestamps and status

### Screen 5: Transition Monitor
- **Dual-spec gauge display**: Split view — outgoing (greyed) vs incoming product parameters
- **Switch recommendation banner**: Green "SWITCH RECOMMENDED" with confirm/override buttons
- **Transition loss counter**: Running volume in transition buffer

### Screen 6: CIP/SIP Live Monitor
- **CIP step progress bar**: Pre-rinse → Caustic → Intermediate → Acid → Final rinse with current step highlighted
- **TACT parameter gauges**: Temperature, Action/Flow, Chemical concentration, Contact time — required vs actual
- **Cycle outcome indicator**: VERIFIED (green) or FAILED (red) banner

### Screen 7: Idle / Line Ready Display
- **Line status panel**: Large status badge (IDLE/CIP-REQUIRED/READY-FOR-RUN/MAINTENANCE)
- **Last run summary**: Previous run product, duration, OEE, batch ID
- **Pending actions list**: Actions blocking next run start

### Screen 8: Shift Handover Display
- **Shift summary header**: Outgoing/incoming shift info
- **Open issues list**: Color-coded carry-over items (RED/AMBER)
- **Shift performance snapshot**: Units produced, OEE, downtime, waste, NCRs
- **Event chronology**: Scrollable timeline of all shift events
- **Handover acknowledgement**: ACKNOWLEDGE HANDOVER button with badge scan simulation

### Screen 9: Andon Operator Call Panel (Floating overlay)
- **Call type selector**: 4 large icon buttons — MATERIAL NEEDED, QUALITY ISSUE, EQUIPMENT FAULT, PROCESS HELP
- **Location and detail entry**: Auto-populated line/station/product, free-text field, RAISE CALL button
- **Call status display**: Active call card with SLA countdown timer
- **Active call history strip**: Last 3 resolved calls

### Mock Data
- Realistic production run data (beverage/dairy line producing "Premium Orange Juice 1L")
- Live-updating gauge values with simulated sensor fluctuations
- Sample alerts, CCP readings, SPC data points, operator roster, shift events

