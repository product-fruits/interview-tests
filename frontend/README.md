# Juicy Test Tour Starter Kit

This is the frontend demo application for the Juicy Test two-step product tour.

## Setup

```bash
cd frontend
npm install
npm run dev
```

This will start the development server on http://localhost:3000.

The tour definition is in `tour.json`.

## Requirements

The goal of this exercise is to build a self-contained, React-powered product tour engine that can be injected into any host page as a third-party script. Your solution should demonstrate key concepts such as dynamic element targeting, and a simple public API.

### Functional Requirements

- **Mounting:** the `TourEngine` component is already mounted in the root of the DOM, use it and extend it with all required funcionality
- **Tour Definition:** Load `tour.json` at runtime. Each step may include:
  - `url` (string): only run this step if `window.location.href` matches.
  - `selector` (CSS selector): the target element to highlight. If no selector is present, render a centered dialog.
  - `title` & `text` (strings): step content.
  - `continueByTargetClick` (boolean): if true, advance the tour when the target element is clicked; otherwise show Next/Done buttons in a tooltip.
- **Step Behavior:**
  - If the current page URL does not match `url`, suspend the tour.
  - If the target element is not present on the page, you must wait for it and show the step once it becomes visible.
  - Render a translucent overlay mask with a cut-out around the target.
- **BONUS: Animations:** Add fade-in / fade-out transitions for mask and tooltip, and animate position changes between steps.

### Public API

Expose an object on `window.PF` with:

- `start()`: launch the tour at step 0.
- `destroy()`: unmount React, remove listeners and perform cleanup.

### BONUS: Non-Functional Constraints

- **Isolation:** No global CSS leakage; the main application CSS should not modify the design of tour cards.

### Simulated Host App

The demo app under `src/` simulates:

- A menu to navigate between Home and Items pages.
- An Items page that loads its list from a fake API call (2 s delay).
- An Add New Item button to simulate dynamic interactions.

### Deliverables

- All source code under `src/tour-engine` (TypeScript).

Treat this as a real, small pull request you'd ship today. Focus on a minimal viable slice that cleanly satisfies the requirements, with a clear note on any trade-offs made.

