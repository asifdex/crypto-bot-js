import axios from "axios";

export const getCryptoPriceHistory = async (symbol) => {
  const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=7`;
    console.log("url",url);
    
  try {
    const response = await axios.get(url);
    const prices = response.data.prices.map((price) => ({
      timestamp: price[0] / 1000, // Convert timestamp from milliseconds to seconds
      price: price[1], // Price in USD
    }));
    return prices;
  } catch (error) {
    console.error("Error fetching data from CoinGecko:", error);
    return [];
  }
};
