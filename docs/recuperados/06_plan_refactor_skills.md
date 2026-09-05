# Fundamental Skills Upgrade: Logic, Design & Structure

This plan introduces four core "Fundamental Skills" to the SimpleEat project to improve its scalability, maintainability, and aesthetic depth.

## User Review Required

> [!IMPORTANT]
> This refactor will move logic out of `App.jsx` into dedicated services and introduce a formal state machine for UI transitions.

## Proposed Changes

### Logic: Domain-Driven Logic (DDL)
Standardize how ingredients and cooking rules are defined to allow for easier expansion and validation.

#### [MODIFY] [CopingChef.js](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/logic/CopingChef.js)
- Refactor `MASTER_ENCYCLOPEDIA` into a separate domain file or clean structure.
- Implement a pipeline pattern for parsing: `Normalize -> Extract -> Validate -> Calculate`.

#### [NEW] [KitchenDomain.js](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/logic/KitchenDomain.js)
- Define types and interfaces for ingredients, categories, and cocción rules.

---

### Design: Design Tokens & Semantic UI
Transition from ad-hoc Tailwind classes to a structured design system.

#### [MODIFY] [tailwind.config.js](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/tailwind.config.js)
- Define a semantic color palette (e.g., `brand-primary`, `status-clavo`, `ui-background`).
- Standardize spacing and radius tokens.

#### [MODIFY] [index.css](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/index.css)
- Implement CSS variables derived from tokens for dynamic themes.

---

### Structure: State Machine (FSM) & Service Layer
Organize the app's flow and data management.

#### [MODIFY] [App.jsx](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/App.jsx)
- Replace simple `useState` for flow control with a clear state transition logic.
- Move business logic to `RecipeService`.

#### [NEW] [RecipeService.js](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/logic/RecipeService.js)
- Orchestrate parsing, timing calculation, and asset matching (Antidote logic).

## Verification Plan

### Automated Tests
- Since there are no existing tests, I will add a simple logic test suite if possible, or perform manual verification via the browser.

### Manual Verification
1. **Logic Validation**: Enter "2 alitas de pollo con 1 cebolla" in the Omnibar and verify the "Protocolo Maestro" and timing are correct.
2. **State Transitions**: Verify the `loading` -> `result` flow feels smooth and handles errors (e.g., no quantities).
3. **Visual Regression**: Ensure the "Screen-Free" Japandi aesthetic is preserved and enhanced by the new tokens.
