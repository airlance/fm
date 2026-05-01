# 🤖 AGENTS.md — Context for AI Assistants

This file contains key information about the **Football Manager (FM)** project to help AI agents quickly get up to speed and follow established development standards.

## 📝 Project Overview
**Football Manager** is a web-based football management simulator. The user manages a club, tactics, and transfers, and participates in competitions. All game logic and data are stored on the client side.

## 🛠 Technology Stack
- **Core:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS 4, Radix UI (components), Lucide React (icons).
- **State Management:** Zustand (UI state, settings).
- **Database:** Dexie.js (IndexedDB) — the primary storage for game data (clubs, players, matches).
- **Routing:** React Router 7.
- **Data Validation:** Zod (data schemas in `src/schemas`).

## 📂 Project Structure
- `src/modules/` — core functional blocks of the game (tactics, transfers, squad, etc.). Each module is isolated.
- `src/schemas/` — Zod schemas defining the data structure of game objects.
- `db/` — Dexie database initialization and hooks for synchronization/access.
- `src/game_events/` — game event logic (draws, matches, event dispatcher).
- `src/state/` — global Zustand stores.
- `src/lib/` — utility functions and helpers.

## 🔑 Key Concepts
1. **Day Transition:** The entire game dynamic is tied to a calendar system. The logic for transitioning between days is located in `src/modules/day-transition`.
2. **Persistent State:** All critical game data must be saved in Dexie (`db/db.ts`). UI state (modals, filters) is stored in Zustand.
3. **Event-Driven:** Some processes (e.g., league draws) operate through an event system in `src/game_events`. The `DrawEvent` is responsible for generating match schedules for seasons.

---
*Update this file when there are significant changes to the architecture or stack.*
