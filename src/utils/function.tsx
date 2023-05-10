export function getRandomCards(n: number) {
  const indexes = Array.from({ length: 78 }, (_, i) => i); // 創建包含 0 到 77 的陣列
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之間的隨機整數
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // 交換 indexes[i] 和 indexes[j] 的位置
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
