//file needed to generate the API call to OpenAI

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const OpenAI = require("openai");

require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
  })
);

const PORT = process.env.PORT || 3000;

const API_KEY = process.env.API_KEY;

const openai = new OpenAI({
  apiKey: API_KEY,
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  next();
});

app.get("/api/call_chat_gpt", async (req, res) => {
  const userMessage = req.query.message || "Hello!";
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userMessage }],
      model: "gpt-3.5-turbo-0125",
    });
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    res.json(completion.choices[0].message);
  } catch (error) {
    console.error(
      "Errore durante la richiesta di informazioni sensibili:",
      error
    );
    res.status(500).json({
      error: "Errore durante il recupero delle informazioni sensibili",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Il server è in esecuzione sulla porta ${PORT}`);
});
