import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: message }]
      }),
    });

    const data = await response.json();
    console.log("✅ OPENAI raw response:", JSON.stringify(data, null, 2));

    const text = data.choices?.[0]?.message?.content || 'No response from AI';
    res.status(200).json({ text });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: 'Error processing request' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

