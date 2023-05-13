import {
  convertToRomanNumeral,
  getRandomBool,
  getRandomCards,
} from "./function";

describe("getRandomCards", () => {
  it("returns an array of random card indexes", () => {
    const result = getRandomCards(5);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5);
    const validIndexes = Array.from({ length: 78 }, (_, i) => i);
    result.forEach((index) => {
      expect(validIndexes.includes(index)).toBe(true);
    });
    const result2 = getRandomCards(5);
    expect(result).not.toEqual(result2);
  });
});
describe("getRandomBool", () => {
  it("returns an array of random booleans with the specified length", () => {
    const length = 10;
    const result = getRandomBool(length);

    expect(result).toHaveLength(length);
    expect(result.every((value) => typeof value === "boolean")).toBe(true);
  });
});
describe("convertToRomanNumeral", () => {
  it("converts numbers to Roman numerals correctly", () => {
    const testCases = [
      { number: 1, expected: "I" },
      { number: 4, expected: "IV" },
      { number: 9, expected: "IX" },
      { number: 49, expected: "XLIX" },
      { number: 3999, expected: "MMMCMXCIX" },
    ];

    testCases.forEach(({ number, expected }) => {
      const result = convertToRomanNumeral(number);
      expect(result).toBe(expected);
    });
  });
});
