import cheerio from "cheerio";
import request from "request";
export default async function getUrlData(
  url: string,
  callback: (data?: CheerioStatic, error?: string) => void
): Promise<void> {
  const _ = undefined;
  request(url, (err, __, html) => {
    if (err) callback(_, "Error getting url data");
    if (!err && html) callback(cheerio.load(html), _);
    callback(_, "Unexpected error performing request");
    return;
  });
}
