import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const getCryptoPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `${process.env.COINMARKETCAP_BASE_URL}/quotes/latest`,
      {
        params: {
          symbol,
        },
        headers: {
          "X-CMC_PRO_API_KEY": process.env.COIN_API,
        },
      }
    );
    console.log(response, "response");

    const data = response.data.data[symbol.toUpperCase()];


     

    console.log("here we got data", data);
    return {
      name: data.name,
      symbol: data.symbol,
      slug:data.slug,
      price: data.quote.USD.price,
      marketCap: data.quote.USD.market_cap,
      volume24h: data.quote.USD.volume_24h,
    };
  } catch (error) {
    console.log(error);
  }
};
