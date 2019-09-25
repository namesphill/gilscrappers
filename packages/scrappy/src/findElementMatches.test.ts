import findElementMatches from "./findElementMatches";
import getUrlData from "./getUrlData";

it("finds matches when matches exist", async () => {
  try {
    const data = await getUrlData("https://example.com");
    const matches = findElementMatches(data, "domain", "p, h1");
    expect(matches.length).toEqual(2);
  } catch (error) {
    fail();
  }
});
