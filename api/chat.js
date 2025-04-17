export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message in request body" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // puoi cambiare anche con 'gpt-3.5-turbo' se necessario
        messages: [
          {
            role: "system",
            content:
              "Rispondi in modo preciso, organizzato e con un tono professionale. Sei un esperto di finanza, specializzato in prodotti strutturati (certificati). Rimani sempre in tema e non parlare d'altro. Usa uno stile chiaro e paragrafato. Usa anche emoji se utili.",
          },
          {
            role: "user",
            content: message,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Debug
    console.log("✅ OPENAI raw response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content || "Nessuna risposta ricevuta.";
    res.status(200).json({ text });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "Errore nella richiesta all'AI." });
  }
}
