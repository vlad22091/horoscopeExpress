import express from "express";
const router = express.Router();
import db from "../db/connector.js";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

router.get('/', async function(req, res, next) {
    try {
        const result = await db.query('SELECT * FROM horoscope');
        res.render('horoscope', { horoscope: result.rows });
    } catch (err) {
        console.error(err);
        res.status(400).send("Помилка бази даних");
    }
});

router.get('/generate', (req, res) => {
  res.render('generate_form');
});

router.post('/generate', async (req, res) => {
  const { sign, month } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Ти професійний астролог. Пиши коротко українською мовою.",
          },
          {
            role: "user",
            content: `Напиши гороскоп для знака ${sign} на місяць ${month}.`,
          },
        ],
        max_tokens: 512,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || "Groq API error");
    }

    const data = await response.json();
    const text = data.choices[0].message.content;

    await db.query(
    `INSERT INTO horoscope (sign, month, text)
    VALUES ($1, $2, $3)
    `,
    [sign, month, text]
    );


    res.redirect('/');

  } catch (err) {
    console.error("Groq Error:", err.message);
    res.status(500).send(`Помилка генерації: ${err.message}`);
  }
});

export default router;
