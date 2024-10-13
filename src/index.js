import bot from './bot/bot.js'; // Change 'require' to 'import'

import dotenv from "dotenv";

dotenv.config();


bot.launch().then(() => {
    console.log("Crypto bot is running...");
  });