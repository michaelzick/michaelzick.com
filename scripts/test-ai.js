const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return;

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-2.0-flash-exp"];

  for (const modelName of models) {
    console.log(`Testing model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("test");
      console.log(`Success with ${modelName}!`);
      process.exit(0);
    } catch (err) {
      console.log(`Failed with ${modelName}: ${err.message}`);
    }
  }
  console.log("All standard models failed.");
}

test();
