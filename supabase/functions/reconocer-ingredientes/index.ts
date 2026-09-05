// Reconocimiento de ingredientes por foto (producción).
//
// Supabase Edge Function: recibe una imagen en base64 y devuelve la lista
// de ingredientes detectados, usando Gemini (visión) como "ojo".
// La API key vive en un secret del proyecto (nunca en el frontend).
//
// Robusto ante la alta demanda del free tier: si un modelo responde 503/404,
// prueba con el siguiente de la lista.
//
// Desplegar:
//   supabase functions deploy reconocer-ingredientes --project-ref <ref>
//   supabase secrets set GEMINI_API_KEY=... --project-ref <ref>

// Modelos con visión, en orden de preferencia (free tier).
const MODELOS = [
  "gemini-2.5-flash-lite", // más quota, rápido
  "gemini-flash-latest",   // alias al último flash estable
  "gemini-2.5-flash",      // más capaz, a veces 503 por demanda
];

const PROMPT =
  "List the food ingredients visible in this photo, each one only once. " +
  "Answer with ONLY a comma-separated list of ingredient names in Spanish. " +
  "No sentences, no extra words.";

async function llamarGemini(modelo, imagen, mime, key) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${key}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mime, data: imagen } },
        ],
      }],
    }),
  });
  if (!resp.ok) {
    throw new Error(`${modelo} -> HTTP ${resp.status}`);
  }
  const data = await resp.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

Deno.serve(async (req) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  const key = Deno.env.get("GEMINI_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "Falta GEMINI_API_KEY en el servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    const body = await req.json();
    const imagen = body.imagen;
    const mime = body.mime || "image/jpeg";
    if (!imagen) {
      return new Response(JSON.stringify({ error: "Falta la imagen (base64)" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...cors },
      });
    }

    let ultimoError = "";
    for (const modelo of MODELOS) {
      try {
        const texto = await llamarGemini(modelo, imagen, mime, key);
        if (texto) {
          return new Response(JSON.stringify({ ingredientes: texto, modelo }), {
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        ultimoError = `${modelo} -> respuesta vacía`;
      } catch (e) {
        ultimoError = String(e && e.message ? e.message : e);
        // sigue con el siguiente modelo
      }
    }

    return new Response(JSON.stringify({ error: `Todos los modelos fallaron: ${ultimoError}` }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
