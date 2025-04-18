import express from 'express';
import cors from 'cors'; // ✅ aggiunto
import chatHandler from './chat.js';
import titleHandler from './title.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // ✅ aggiunto
app.use(express.json());

app.post('/api/chat', chatHandler);
app.post('/api/title', titleHandler);

app.get('/', (req, res) => {
  res.send('✅ API GPT Backend online!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
