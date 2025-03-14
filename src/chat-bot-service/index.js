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
      const systemData = [
        "Tôi tên là Phạm Mạnh Lợi",
        "Học trường Công nghệ thông tin",
        "Mã số sinh viên là 19521772",
      ];
      const systemContent =
        "You are an intelligent note-taking app. You answer the user's question based on their existing notes." +
        systemData.join("\n\n");
      const completionText = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemContent,
          },
          { role: "user", content: userInput },
        ],
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
