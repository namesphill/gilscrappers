import findLinksFromSearchPage from "./findLinksFromSearchPage";
import generateSearchUrlFromKeywords from "./generateSearchUrlFromKeywords";
import getUrlData from "./getUrlData";

it("finds matches for a search", async () => {
  const searchUrl = generateSearchUrlFromKeywords(["uber", "IPO"]);
  const data = await getUrlData(searchUrl);
  const links = findLinksFromSearchPage(data);
  expect(links).toBeTruthy();
  expect(links.length).toBeTruthy();
});
