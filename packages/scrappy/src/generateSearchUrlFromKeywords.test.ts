import generateSearchUrlFromKeywords from "./generateSearchUrlFromKeywords";
import getUrlData from "./getUrlData";

it("works when given an array of keywords", () => {
  expect(typeof generateSearchUrlFromKeywords(["uber", "IPO"])).toBe("string");
});

it("should produce a url that can be user by getUrlData()", async () => {
  const url = generateSearchUrlFromKeywords(["uber", "IPO"]);
  await expect(getUrlData(url)).resolves.toBeTruthy();
});
