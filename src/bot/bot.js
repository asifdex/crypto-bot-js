import { Telegraf } from "telegraf";
import dotenv from "dotenv";
import { getCryptoPrice } from "../services/getPrice.js";
import { getCryptoPriceHistory } from "../services/PriceHistory.js";
import { createChart } from "../services/generatePriceChart.js";
import { formatNumber } from "../../utils/index.js";

dotenv.config();

const token = process.env.TG_API;
if (!token) {
  console.error("Telegram bot token is missing!");
  process.exit(1);
}
const bot = new Telegraf(token);

bot.command("p", async (ctx) => {
  // ctx.reply("yo")

  const message = ctx.message.text;
  const symbol = message.split(" ")[1];
  console.log("symbol:", symbol);

  try {
    const cryptoData = await getCryptoPrice(symbol);
    // const cryptoSlug ="bitcoin";
    let cryptoSlug = cryptoData.slug;

    const slugCorrection = [
      { symbol: "xrp", slug: "ripple" },
      // { symbol: "", slug: "" },
    ];
    const correction = slugCorrection.find(
      (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
    );
    if (correction) {
      console.log(`Corrected slug for ${symbol}:`, correction.slug);
      cryptoSlug = correction.slug;
    }


    const priceHistory = await getCryptoPriceHistory(cryptoSlug);

    if (!priceHistory.length) {
      return ctx.reply(`Could not retrieve historical data for ${symbol}`);
    }

    //     // Generate the chart image
    const chartImage = await createChart(priceHistory);

    const replyMessage = `
        *${cryptoData.name} (${cryptoData.symbol})*
*Price:* $${formatNumber(cryptoData.price)} 
*24h Vol:* $${formatNumber(cryptoData.volume24h)}
*Market Cap:* $${formatNumber(cryptoData.marketCap)}  `;

    // await ctx.reply(replyMessage)
    // Send the chart image to the user first
    await ctx.replyWithPhoto(
      { source: chartImage },
      { caption: replyMessage, parse_mode: "HTML" }
    );
  } catch (error) {
    ctx.reply(
      `Sorry, I couldn't retrieve data for that ${symbol}. Please try again.`
    );
  }
});

bot.on("new_chat_members", async (ctx) => {
  const newMembers = ctx.message.new_chat_members;

  newMembers.forEach(async (member) => {
    const name = member.first_name || "there"; // Use first name or a default greeting
    const welcomeMessage = `
        👋 Welcome ${name} to our group!
        We hope you enjoy your time here. If you have any questions, feel free to ask.
        Please read the rules and stay respectful!
      `;

    // Send the welcome message to the group
    await ctx.reply(welcomeMessage);
  });
});

export default bot;
