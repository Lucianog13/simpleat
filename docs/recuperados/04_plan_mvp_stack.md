# SimpleEat MVP Technical Stack Implementation

Implement the Priority 1 MVP components to normalize Argentine ingredients using IPCVA/INTA ontologies.

## User Review Required

> [!IMPORTANT]
> - **Gemini API Key**: You need to provide a `GOOGLE_GENERATIVE_AI_API_KEY` in the `.env` file.
> - **n8n Instance**: This plan assumes you have or will have a self-hosted n8n instance. We will configure webhooks for it.
> - **Fastify vs Next.js**: The current project is Vite-based. I will implement the Fastify server in a `/server` directory and the Next.js/UI components in the `/src` directory (or migrate to Next.js if preferred). For now, I'll extend the existing React app.

## Proposed Changes

### 1. Database Layer (Supabase)
Create migrations for the core ontologies.

#### [NEW] [20260209_mvp_schema.sql](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/supabase/migrations/20260209_mvp_schema.sql)
- `terms`: Store IPCVA/INTA canonical terms.
- `mappings`: Alias to standard term mappings.
- `normalization_logs`: Track requests and costs.

### 2. Backend API (Fastify)
Initialize a Fastify server to handle logic that requires secret keys and complex validation.

#### [NEW] [server/index.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/server/index.js)
- Fastify entry point.
- JWT/HMAC security middleware.

#### [NEW] [server/plugins/terminology.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/server/plugins/terminology.js)
- Normalization rules and alias handling.

#### [NEW] [server/routes/normalize.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/server/routes/normalize.js)
- Endpoint for Gemini-powered normalization.

### 3. Logic & AI (Gemini + Zod)
Integration of Gemini 2.0 and Prompt Maestro.

#### [MODIFY] [src/logic/PromptMaestro.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/src/logic/PromptMaestro.js) [NEW]
- System prompts with IPCVA/INTA ontologies.
- Zod schema for output validation.

#### [MODIFY] [src/logic/CopingChef.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/src/logic/CopingChef.js)
- Refactor to use the new API/Supabase instead of hardcoded dictionary.

### 4. Orchestration (n8n)
Update webhook handlers.

#### [MODIFY] [src/api/n8n.js](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/src/api/n8n.js)
- Add HMAC signature to webhook calls.

### 5. Frontend (UI)
Update the interface to handle the new normalization results.

#### [MODIFY] [src/App.jsx](file:///c:/Users/Luchi$/Desktop/Habilidades de Agentes/simpleeat-app/src/App.jsx)
- Update Omnibar to call the `/normalize` endpoint.
- Implement result visualization (Chips/Tables).

## Verification Plan

### Automated Tests
- **API Tests**: Run `npm test` (adding Vitest) to verify Fastify endpoints.
- **Normalization Logic**: Verify Gemini output against a set of 50 top Argentine ingredients.
- **Schema Validation**: Ensure Zod correctly parses and fails on malformed LLM responses.

### Manual Verification
1. Start the Fastify server: `node server/index.js`.
2. Enter "Asado con papas" in the UI.
3. Verify that the app returns the canonical terms ("Costillar de Asado", "Papas Rústicas") and identifies the sources (IPCVA, INTA).
4. Check Supabase logs to ensure the request was persisted.
