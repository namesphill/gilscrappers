import generateSearchUrlFromKeywords from "./generateSearchUrlFromKeywords";

it("works when given an array of keywords", () => {
  expect(typeof generateSearchUrlFromKeywords(["uber", "IPO"])).toBe("string");
});
