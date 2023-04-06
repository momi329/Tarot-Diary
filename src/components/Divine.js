import { useEffect, useState } from "react";
import cards from "../tarotcard/tarot-images";

function Divine({ spreadData, setSpreadData, setEnd }) {
  const number = spreadData.spread.reduce(
    (acc, crr) => (crr !== 0 ? acc + 1 : acc),
    0
  );
  const tarot = cards.cards;
  function getRandomCards(n) {
    const indexes = Array.from({ length: 78 }, (_, i) => i); // 創建包含 0 到 77 的陣列
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之間的隨機整數
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // 交換 indexes[i] 和 indexes[j] 的位置
    }
    return indexes.slice(0, n);
  }
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getRandomBool(n) {
    const boolArray = [];
    for (let i = 0; i < number; i++) {
      boolArray.push(getRandom(1, 1000) % 2 === 0);
    }
    return boolArray;
  }
  const handleClick = async () => {
    const randomCard = await getRandomCards(number);
    const randomReverse = await getRandomBool(number);
    const modifiedData = spreadData.spread.reduce((acc, item, i) => {
      if (item === 0) {
        acc.push(0);
      } else {
        const card = randomCard[item.order - 1];
        const reverse = randomReverse[item.order - 1];
        const newItem = { ...item, card, reverse };
        acc.push(newItem);
      }
      return acc;
    }, []);
    await setSpreadData({ ...spreadData, spread: modifiedData });
    setEnd(true);
  };
  return (
    <>
      <button onClick={handleClick}>Click Me</button>
      {/* {divined && (
        <div className='flex flex-row'>
          {divined.map((i, index) => (
            <img
              src={tarot[i].img}
              alt={tarot[i].name}
              key={i}
              className={`w-[250px] ${bool[index] ? "" : "rotate-180"}`}
            />
          ))}
        </div>
      )} */}
    </>
  );
}
export default Divine;
