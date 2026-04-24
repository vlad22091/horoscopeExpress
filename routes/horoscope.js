import express from "express";
const router = express.Router();
import db from "../db/connector.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "Напиши короткий вірш про програмування";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  } catch (error) {
    console.error("Помилка:", error);
  }
}

run();

async function checkModels() {
  try {
    // Ця функція повертає список усіх доступних вам моделей
    const models = await genAI.listModels();
    
    console.log("Доступні моделі:");
    models.forEach((m) => {
      console.log(`Назва: ${m.name}, Методи: ${m.supportedGenerationMethods}`);
    });
  } catch (error) {
    console.error("Не вдалося отримати список моделей:", error);
  }
}

checkModels();
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
    const text = `Для знаку ${sign} сьогодні буде чудовий день!`;

    try {
        await db.query(
            'INSERT INTO horoscope (sign, month, text) VALUES ($1, $2, $3)',
            [sign, month, text]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(400).send("Помилка при додаванні гороскопу. Можливо, для цього місяця вже існує гороскоп.");
    }
});

export default router;
