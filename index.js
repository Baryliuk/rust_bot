const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require('./options')
const token = "7162906110:AAHzzbOeasJs9A5my-raYbmgHGAKPA97CWU";
const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Guees number 0 to 9");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "GUEEES", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начало" },
    { command: "/info", description: "Получить информацию" },
    { command: "/game", description: "Игра угадай число" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`);
    }

    if (text === "/info") {
      return bot.sendMessage(chatId, "info");
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "я тебя не понимаю(");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Ти угадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ти не угадал цифру ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
