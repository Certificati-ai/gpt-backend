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
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: message }]
      })
    });

    const data = await response.json();
    console.log("✅ OPENAI raw response:", JSON.stringify(data, null, 2));
    const text = data.choices?.[0]?.message?.content || 'No response from AI';
    res.status(200).json({ text });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: 'Error processing request' });
  }
}
