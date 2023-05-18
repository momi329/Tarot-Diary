export function getRandomCards(n: number) {
  const indexes = Array.from({ length: 78 }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes.slice(0, n);
}
export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function getRandomBool(n: number) {
  const boolArray: boolean[] = [];
  for (let i = 0; i < n; i++) {
    boolArray.push(getRandom(1, 1000) % 2 === 0);
  }
  return boolArray;
}
export function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const diffInMs = now.getTime() - date.getTime();
  if (diffInMs >= 5 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString();
  }
  if (diffInMs >= 24 * 60 * 60 * 1000) {
    const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
  if (diffInMs >= 60 * 60 * 1000) {
    const diffInHours = Math.floor(diffInMs / (60 * 60 * 1000));
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
  if (diffInMs >= 60 * 1000) {
    const diffInMinutes = Math.floor(diffInMs / (60 * 1000));
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
export function convertToRomanNumeral(num) {
  const romanNumeralMap = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
    { value: 0, symbol: "N" },
  ];

  function convertToRomanNumeralHelper(number: number, index: number) {
    if (index >= romanNumeralMap.length || number <= 0) {
      return "";
    }
    const currentSymbol = romanNumeralMap[index].symbol;
    const currentValue = romanNumeralMap[index].value;
    const quotient = Math.floor(number / currentValue);
    const remainder = number % currentValue;
    const result = currentSymbol.repeat(quotient);
    return result + convertToRomanNumeralHelper(remainder, index + 1);
  }

  return convertToRomanNumeralHelper(num, 0);
}
