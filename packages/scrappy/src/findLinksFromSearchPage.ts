export default function findLinksFromSearchPage($: CheerioStatic): string[] {
  const urls: string[] = [];
  $("a").each((index, elem) => {
    const href = $(elem).attr("href");
    const [url] = href.replace("/url?q=", "").split("&");
    if (url.charAt(0) === "/") return;
    if (url.includes("google.")) return;
    urls.push(url);
  });
  return urls;
}
