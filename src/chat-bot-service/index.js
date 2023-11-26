const colors = require("colors");
const OpenAI = require("openai");
const readlineSync = require("readline-sync");
const dotenv = require("dotenv");

const main = async () => {
  try {
    dotenv.config();
    const openai = new OpenAI({
      apiKey: process.env.GPT_API_KEY,
    });

    while (true) {
      const userInput = readlineSync.question(colors.yellow("You: "));
      console.info(colors.blue("finished question") + "\n");
      const completionText = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userInput }],
        stream: true,
      });
      process.stdout.write(colors.red("Bot: "));
      for await (const chunk of completionText) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
      }
      console.info("\n ");
    }
  } catch (e) {
    console.info("LOGGER:: e", e);
  }
};

main().catch();
