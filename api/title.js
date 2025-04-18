export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

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
            content: 'Sei un assistente che riassume conversazioni in titoli brevi, chiari e creativi.',
          },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await response.json();
    const title = data.choices?.[0]?.message?.content || 'Conversazione senza titolo';
    res.status(200).json({ text: title });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Errore nel generare il titolo.' });
  }
}
