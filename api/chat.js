import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Sostituisci * con il tuo dominio Webflow se vuoi
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

  if (!message) {
    return res.status(400).json({ text: 'Messaggio mancante.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Sei un assistente utile e conciso.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    console.log("✅ OPENAI raw response:", JSON.stringify(completion, null, 2));

    const text = completion.choices?.[0]?.message?.content || 'Nessuna risposta ricevuta.';
    res.status(200).json({ text });

  } catch (error) {
    console.error('❌ Errore OpenAI:', error?.response?.data || error.message);
    res.status(500).json({ text: 'Errore nella richiesta all\'AI.' });
  }
}
