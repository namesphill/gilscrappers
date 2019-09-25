import getUrlData from "./getUrlData";

it("should throw error with invalid urls", async () => {
  await expect(getUrlData("random text")).rejects.toThrow();
});

it("should work with valid urls", async () => {
  await expect(
    getUrlData("https://example.com").then(XXX => {
      console.warn({ XXX });
      return XXX;
    })
  ).resolves.toBeTruthy();
});

it("should throw with empty sites", async () => {
  const fakeUrl = "https://this-page-does-not-exist-at-all.gov";
  await expect(getUrlData(fakeUrl)).rejects.toThrow();
});
