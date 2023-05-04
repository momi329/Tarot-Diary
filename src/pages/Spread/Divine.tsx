import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import cards from "../../tarotcard/tarot-images";
import type { SpreadData } from "../../utils/type";
import type { DesignSpreadData } from "../../utils/type";
import Button from "../../components/Button";
interface Props {
  spreadData: SpreadData;
  setSpreadData?: React.Dispatch<React.SetStateAction<SpreadData | undefined>>;
  divinedData: any;
  setDivinedData: React.Dispatch<React.SetStateAction<DesignSpreadData>>;
  divining: number;
  dispatch: React.Dispatch<any>;
  pickCard: Number[];
}

function Divine({
  spreadData,
  divinedData,
  setDivinedData,
  divining,
  dispatch,
  pickCard,
}: Props) {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const number = spreadData.spread.reduce(
    (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
    0
  );
  const tarot = cards.cards;

  useEffect(() => {
    if (divining !== 3) return;
    // async function screenShot() {
    //   imgRef.current && (await getImage());
    //   console.log(image);
    // const url = await firebase.uploadBlob(userUID, image);
    // const addShotData = { ...divinedData, screenShot: url };
    // console.log(addShotData, "addShotData", url, "url");
    // const docId = firebase.newDivinedData(addShotData, userUID);
    // if (docId) {
    //   setDivinedData({ ...addShotData, docId: docId });
    // } else {
    //   console.log("error no docId");
    // }
    // }
    // setTimeout(() => screenShot(), 5000);
  }, [divining]);

  const handleClickDivine = async () => {
    const randomCard = await getRandomCards(number);
    const randomReverse = await getRandomBool(number);
    const modifiedData = spreadData.spread.reduce(
      (
        acc: any,
        item:
          | number
          | { name: string; order: number; card: number; reverse: boolean },
        i: number
      ) => {
        if (typeof item === "number") {
          acc.push(0);
        } else {
          const card = randomCard[item.order - 1];
          const reverse = randomReverse[item.order - 1];
          const newItem = { ...item, card, reverse };
          acc.push(newItem);
        }
        return acc;
      },
      []
    );
    const newData = { ...divinedData, spread: modifiedData };
    setDivinedData(newData);
    dispatch({ type: "end" });
  };

  return (
    <>
      {divining === 1 && (
        <Button
          action={handleClickDivine}
          disabled={pickCard[0] !== pickCard[1] || divinedData.question === ""}
          type={"big"}
          value={"Divine"}
        />
      )}
    </>
  );
}
export default Divine;

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
