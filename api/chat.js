// File: /api/chat.js

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: message }],
        stream: false, // Non streaming per ora, più compatibile su Vercel
      }),
    });

    const data = await response.json();

    // Logging debug in Vercel
    console.log('✅ OPENAI raw response:', JSON.stringify(data, null, 2));

    // Gestione errori OpenAI
    if (data.error) {
      console.error('❌ OpenAI Error:', data.error);
      return res.status(500).json({ error: 'OpenAI error: ' + data.error.message });
    }

    const text = data.choices?.[0]?.message?.content || 'No response from AI';
    res.status(200).json({ text });
  } catch (error) {
    console.error('❌ Catch Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
}
