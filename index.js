const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const genAI = new GoogleGenerativeAI(process.env.TOKEN);

app.use(cors());
app.use(express.json());

// Hardcoded founder authentication
const founder = {
  id: "1410",
  name: "Kartik Jain",
  startup: "I am trying to build a social network for founders and investors to solve problems together to build and encourage startups while leveraging artificial intelligence. To solve problems of solo founders. Also helps find co founders and investors. Give roadmap and validation for startups etc too using ai chatbot available for free on the platform.",
  bio: "As a first-year B.Tech IT student at NMIMS MPSTME, I am driven by a passion for technology, programming, and cybersecurity. Proficient in Python and Java, I am currently advancing my skills in Spring Boot. My notable projects include a live Hindi audio transcription tool and a political party website that managed 16k+ responses using Flask and MongoDB. I actively participate in competitive programming on LeetCode, continually honing my problem-solving abilities. Additionally, I have achieved significant milestones in ethical hacking, such as earning a $1500 bounty from WhatsApp and reporting a XSS vulnerability on the Mumbai Police Website."
};

// Get founder profile (Hardcoded)
app.get("/api/founder", (req, res) => {
  res.json(founder);
});

app.patch("/api/founder", (req, res) => {
  const { name, startup, bio } = req.body;
  if (name){
    founder.name = name;
  }
  if (startup){
    founder.startup = startup;
  }
  if (bio){
    founder.bio = bio;
  }
  res.json(founder);
}); 

// AI Validation & Roadmap Generation
app.post("/api/ai/validate", async (req, res) => {
  console.log("Validation request received");
  var { startup, bio } = req.body;

  if (!startup) {
    var startup = founder.startup;
  }
  if (!bio) {
    var bio = founder.bio;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this startup idea: *${startup}*. Try to validate the idea, give constructive criticism and opinions on the startup idea, what changes do you think can me made in the ideas to actually achieve the startup idea, is it viable given the current market etc. Give your best and honest opinion. Please keep it short, do not exceed 200 words. Do not forget to keep it relevant to the Indian market. Do not use text formatting, give it as plain text.`;

    const response = await model.generateContent(prompt);
    const aiResponse = response.response.text();
    console.log(aiResponse);
    res.json({ validation: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.post("/api/ai/roadmap", async (req, res) => {
  console.log("Roadmap request received");
  var { startup } = req.body;

  if (!startup) {
    startup = founder.startup;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a roadmap for this startup idea: *${startup}* and don't forget to include the steps to achieve the startup idea, the milestones, the marketing strategies, the target audience, the revenue model, the team required, the technology stack, the funding required, the timeline, the risks involved, the competitors, the market analysis, the exit strategy etc. But, keep it short, not over 150 words! Also, give it without any text formatting just like normal text. (Keep it relevant to Indian mareket)`;

    const response = await model.generateContent(prompt);
    const aiResponse = response.response.text();
    console.log(aiResponse);
    res.json({ roadmap: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  console.log("Chat request received");
  var { startup, bio, question } = req.body;
  if (!startup) {
    startup = founder.startup;
  }
  if (!bio) {
    bio = founder.bio;
  }
  if (!question) {
    question = "What should I do?";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a expert startup bot, You are consulting someone who describes themselves as *${bio}* and has this startup idea: *${startup}*, now, their question is: *${question}* reply appropirately. Keep it short and simple, do not exceed 200 words. Keep it relevant to the Indian market. Do not respond with any text formatting. i.e. eep it plain text.`;

    const response = await model.generateContent(prompt);
    const aiResponse = response.response.text();
    console.log(aiResponse);
    res.json({ answer: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/me", (req, res) => {
  res.sendFile(__dirname + "/me.html");
});

app.get("/ai", (req, res) => {
  res.sendFile(__dirname + "/catalouge.html");
});

app.get("/favicon.ico", (req, res) => {
  res.sendFile(__dirname + "/favicon.ico");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});