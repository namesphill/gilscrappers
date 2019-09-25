import findLinksFromSearchPage from "./findLinksFromSearchPage";
import generateSearchUrlFromKeywords from "./generateSearchUrlFromKeywords";
import getUrlData from "./getUrlData";

it("finds matches for a search", async () => {
  const searchUrl = generateSearchUrlFromKeywords(["uber", "IPO"]);
  try {
    const data = await getUrlData(searchUrl);
    console.warn({ DATA: data });
    const links = findLinksFromSearchPage(data);
    console.warn({ links });
    expect(links).toBeTruthy();
    expect(links.length).toBeTruthy();
  } catch (error) {
    fail();
  }
});
