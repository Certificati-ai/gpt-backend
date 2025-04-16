export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Puoi sostituire * con il dominio Webflow se necessario
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gestione preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4', // Se hai problemi, prova anche con 'gpt-3.5-turbo'
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();

    // Log per debugging su Vercel
    console.log("✅ OPENAI raw response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content || 'No response from AI';
    res.status(200).json({ text });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Error processing request' });
  }
}
