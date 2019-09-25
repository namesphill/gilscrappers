export default function findElementMatches(
  $: CheerioStatic,
  match: string | RegExp | string[],
  selector: string = ":button, a"
): { text: string; link: string }[] {
  const matches: { text: string; link: string }[] = [];
  const regexp: RegExp = new RegExp(
    (match as any)["map"]
      ? (match as string[]).join("|")
      : (match as string | RegExp)
  );
  $(selector).each((index, elem) => {
    const text = String($(elem).text() || "")
      .toLowerCase()
      .trim();
    if (!text.match(regexp)) return;
    const link = String($(elem).attr("href")) || "";
    matches.push({ text, link });
  });
  return matches;
}
