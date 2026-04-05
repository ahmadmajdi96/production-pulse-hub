# Project Memory

## Core
Dark industrial theme matching Production Pulse. Primary 210 100% 56%, bg 220 20% 7%.
Inter body, JetBrains Mono data. Status colors: running/idle/transition/down.
5 edge apps: EA1 Operator (8), EA2 Supervisor (9), EA3 Maintenance (6), EA4 Warehouse (7), EA5 Energy (2). Total 32 screens.
Edge app project — no backend yet, all mock data.

## Memories
- [Design tokens](mem://design/tokens) — Full Production Pulse color system ported, status badges, data-card, metric classes
- [EA1 screens](mem://features/ea1-screens) — All 9 screens for wall-mounted HMI with bottom tab nav and Andon FAB
- [EA2 screens](mem://features/ea2-screens) — 9 screens: Dashboard, Run Start, Run Detail, Transition, Schedule, NCR, Logbook, PTW, Downtime
- [EA3 screens](mem://features/ea3-screens) — 6 screens: WO Queue, WO Detail, Asset Health, CIP Monitor, LOTO, PM Checklist
- [EA4 screens](mem://features/ea4-screens) — 7 screens: Receiving Home, Lot Receive, Stage Material, WIP Movement, Pallets, Discrepancy, FEFO
- [EA5 screens](mem://features/ea5-screens) — 2 screens: Energy Dashboard, Scope 1 Emissions
- [Realtime simulation](mem://features/realtime-simulation) — useSimulation hook with jitter/countdown/advanceElapsed helpers
