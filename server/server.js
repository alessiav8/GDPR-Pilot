const express = require('express');
const cors = require('cors'); 
const app = express();
const axios = require('axios');
const OpenAI = require('openai');

app.use(cors({
    origin: 'http://localhost:8080',

}));

const PORT = process.env.PORT || 3000; 

const API_KEY = process.env.OPENAI_API_KEY

const openai = new OpenAI({
    apiKey: API_KEY,
});

app.get('/api/sensitive-data', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "You are a helpful assistant." }],
        model: "gpt-3.5-turbo",
      });

    res.json(completion.choices[0]);
  } catch (error) {
    console.error('Errore durante la richiesta di informazioni sensibili:', error);
    res.status(500).json({ error: 'Errore durante il recupero delle informazioni sensibili' });
  }
});

app.listen(PORT, () => {
  console.log(`Il server è in esecuzione sulla porta ${PORT}`);
});
