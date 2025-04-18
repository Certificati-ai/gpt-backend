import express from 'express';
import chatHandler from './api/chat.js';
import titleHandler from './api/title.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Route per /api/chat
app.post('/api/chat', chatHandler);

// Route per /api/title
app.post('/api/title', titleHandler);

// Default route di prova
app.get('/', (req, res) => {
  res.send('✅ API GPT Backend online!');
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
