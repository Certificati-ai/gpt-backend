import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

import chatHandler from './chat.js';
import titleHandler from './title.js';

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Rotte API
app.post('/api/chat', chatHandler);
app.post('/api/title', titleHandler);

app.get('/', (req, res) => {
  res.send('✅ Server attivo e funzionante!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
