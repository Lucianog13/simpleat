# Master Chef Protocol & Cooking Math

The logic layer that transforms raw ingredients into a professional, safe, and fast recipe.

## Cooking Mathematics (Time Calculation)
- **Formula:** `Time (T) = Base + (Qty * Factor)`
- **Safety Standard (Pork):** If pork is detected, base time starts at a higher safety threshold (18m).
- **Economy of Scale:** Quantities > 1 apply a factor reduction (0.8) to account for parallel processing.

## Acceleration Hacks (Filtro Rápido)
If the total calculated time exceeds 20 minutes, the system automatically applies an acceleration modifier (T * 0.7) and appends a technical note:
- **Corte Fino:** Slicing thinner to reduce heat penetration time.
- **Uso de Tapa:** Using a lid to trap steam and accelerate internal cooking.

## Healthy Mandate
- **Allowed Techniques:** Horno, Plancha (no grease), Vapor, Salteado.
- **Validation:** The "Entendido" button is disabled unless the recipe meets the "Fast + Healthy" standard (Time < 30m and high Health Score avg).

## Synergy Module
Detects combinations of ingredients and suggests advanced techniques:
- **Ajo + Albahaca:** Triggers "Emulsión Aromática" instruction.
- **Protein + Veggie:** Consolidates into a "Pollo Dorado con Vegetales" style title.
