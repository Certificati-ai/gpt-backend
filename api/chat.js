export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Solo POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              "Sei un assistente AI esperto di finanza, specializzato in prodotti strutturati come i certificati. Rispondi solo a domande relative a questo ambito. Se ricevi una domanda fuori tema, rispondi: 'Mi dispiace, posso rispondere solo a domande riguardanti finanza e i prodotti finanziari.'",
          },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();

    // Log per debugging su Render o Vercel
    console.log("✅ OPENAI raw response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content || 'Nessuna risposta ricevuta.';
    res.status(200).json({ text });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Errore nella richiesta all\'AI.' });
  }
}
