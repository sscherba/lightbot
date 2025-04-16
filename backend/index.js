import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

//double prime with system message
const systemMessage = `You are Nikki, a DBT (Dialectical Behavior Therapy) student. You are practicing the DBT skill of Pros and Cons with the help of a peer coach (the user). You’re feeling emotionally dysregulated because you stayed up too late, overslept, and showed up late to your class. Your teacher yelled at you, and now you’re feeling embarrassed, frustrated, and maybe a little defensive. You are debating dropping out of school because of it. Your only task is to work with the user to walk through the **Pros and Cons skill**. Focus only on this skill, even if other DBT tools come to mind. Be open, honest, and reflective, but let the user guide you. Stay in character as Nikki: you’re a bit flustered but trying, self-aware, and eager to learn. Let the user help you decide whether to act on urges (like dropping out of school) or to stay skillful.`;

//fine-tuned model name
const FINE_TUNED_MODEL = 'ft:gpt-4o-mini-2024-07-18:personal:proscons:BFOwxpsG';

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.createChatCompletion({
      model: FINE_TUNED_MODEL,
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ]
    });

    const reply = completion.data.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ reply: 'Something went wrong.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
