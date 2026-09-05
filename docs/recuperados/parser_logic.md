# Advanced NLP Ingredient Parser

The core engine for interpreting user intent in the SimpleEat Omnibar.

## No-Truncation Policy
- The parser processes the entire input string (supporting 20+ ingredients).
- Unknown ingredients are preserved as "Ingrediente Genérico" rather than being dropped, maintaining user context.

## Greedy Multi-Term Matching
- The system checks dictionary keys sorted by length (descending).
- This ensures "Zapallito de Tronco" is matched before "Zapallito", and "Pata Muslo" before "Pollo".
- Once matched, the term is removed from the search string to avoid overlapping matches.

## Quantity Extraction (Regex)
- **Regex:** `(\d+(\/\d+)?|un kilo|una|un|dos|tres|cuatros|cinco|seis|diez)`
- Extracts numerical and textual weights/counts.
- **Strict Rule:** Every step in the resulting recipe must prepend its detected quantity (e.g., "3 HUEVOS: ...").

## Segment Splitting
- The input is split by common separators (`,`, `y`, `con`) into semantic segments before individual parsing.
