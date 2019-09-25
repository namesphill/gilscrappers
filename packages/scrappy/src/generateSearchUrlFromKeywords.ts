export default function generateSearchUrlFromKeywords(
  keywords: string[]
): string {
  const query = keywords
    .map(word => word.replace(" ", "%20"))
    .map(word => "%22" + word + "%22")
    .join("+");
  return "https://google.com/search?q=" + query + "&ie=UTF-8&oe=UTF-8";
}
