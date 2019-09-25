import cheerio from "cheerio";
import axios from "axios";
export default async function getUrlData(url: string): Promise<CheerioStatic> {
  try {
    const response = await axios.get(url);
    if (response.data) {
      let $;
      try {
        $ = cheerio.load(response.data);
        return $;
      } catch (error) {
        throw new Error("Could not load data");
      }
    } else {
      throw new Error("Did not find any data on url");
    }
  } catch (error) {
    throw new Error(error);
  }
}
