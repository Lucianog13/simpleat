# Implementation Plan: Comprehensive Argentine Culinary Intelligence

Transform SimpleEat into a definitive expert in Argentine gastronomy by hardcoding and documenting technical standards from IPCVA, INTA, and regional regional sources.

## User Review Required

> [!IMPORTANT]
> This update significantly expands the internal dictionary. If an ingredient is missing, the "Coping Master" fallback will now provide regional technical advice instead of generic tips.

## Proposed Changes

### Logic & Database Expansion

#### [MODIFY] [CopingChef.js](file:///c:/Users/Luchi$/Desktop/Habilidades%20de%20Agentes/simpleeat-app/src/logic/CopingChef.js)
- **Encyclopedia Mastery**: Added +20 Argentine beef cuts, river fish, and seasonal vegetables with technical cooking methods.
- **Substitution Logic**: Added regional fallbacks (e.g., Nalga ↔ Bola de Lomo).

### Prompt Engineering

#### [MODIFY] [n8n_master_chef_prompt.md](file:///C:/Users/Luchi$/.gemini/antigravity/brain/8ece1b1f-9b9f-43ac-9195-ea294bd8c204/n8n_master_chef_prompt.md)
- **Technical Injection**: Included a "Technical Cheat Sheet" inside the prompt to force the AI to respect IPCVA/INTA nomenclature.
- **Tone Adjustment**: Switched to a "Senior Federal Chef" tone.

### Assets & Documentation

#### [NEW] [argentine_gastronomy_master_source.md](file:///C:/Users/Luchi$/.gemini/antigravity/brain/8ece1b1f-9b9f-43ac-9195-ea294bd8c204/argentine_gastronomy_master_source.md)
- Consolidated reference for all regional technical data.

## Verification Plan

### Automated Tests
- Parse test: Verify that "Matambre con zapallito" correctly identifies the two ingredients and applies the "Tiernizar en leche" method.

### Manual Verification
- The user will test the prompt in n8n and verify it recognizes "Boga Despinada" correctly.
