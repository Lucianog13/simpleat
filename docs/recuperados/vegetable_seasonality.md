# Horticultural Intelligence & Seasonality

Integration of local agronomic data to identify varieties and provide economic feedback.

## INTA / Mercado Central Varieties
The system recognizes specific Argentine varieties:
- **Zapallito de Tronco:** Focused on tortillas and fillings.
- **Zapallo Plomo:** Designated for stews (locro) and sweets.
- **Zapallo Anco / Cabutiá:** Specific roasting and purée techniques.
- **Tomate Platense:** Recognition of the local "criollo" favorite.
- **Cebolla de Verdeo / Morada:** Differentiation in technique (rehogado rápido vs caramelización).

## Seasonality Nudges (Entre Ríos)
The system applies a "Saving Pick" (🌟 AHORRO) indicator based on the current month:
- **Summer (Feb):** Choclo, Tomate, Zapallito de Tronco, Berenjena.
- **Winter:** Acelga, Zapallo Plomo.
- **Trigger:** If the ingredient is seasonal, the UI displays an economy badge to nudge the user toward cost-effective choices.

## Technical Commands for Veggies
- **Aromatics Activation:** Garlic and spices must be "picados", "rehogados", or "emulsionados" to activate flavor, never thrown in whole.
- **Attribute Strictness:** Adjectives like "Morada" or "Verde" are preserved and used to select the correct cooking technicality.
