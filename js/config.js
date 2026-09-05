/*
 * Configuración de producción (Supabase + reconocimiento de foto).
 * La ANON key es PÚBLICA (rol anon, respeta las políticas RLS).
 * La SERVICE_ROLE key NUNCA va en el frontend.
 */
window.CONFIG = {
  SUPABASE_URL: "https://ysirdodhsufsdvhztvmq.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzaXJkb2Roc3Vmc2R2aHp0dm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAzMzI4MDksImV4cCI6MjA4NTkwODgwOX0.SpYs3s_VXlVVfMpneUIGVrHFzESfFuSuvWc6PkzB-WY",
  VISION_FUNCTION: "reconocer-ingredientes"
};
