import { useState, useEffect, useContext, createRef } from "react";
import { AuthContext } from "../context/authContext";
import cards from "../tarotcard/tarot-images";
import type { SpreadData } from "../pages/Spread";
import firebase from "../utils/firebase";
import type { DesignSpreadData } from "../pages/Spread";
import { useScreenshot } from "use-react-screenshot";
interface Props {
  spreadData: SpreadData;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | undefined>>;
  end: boolean;
  setEnd: React.Dispatch<React.SetStateAction<boolean>>;
  divinedData: any;
  setDivinedData: React.Dispatch<React.SetStateAction<DesignSpreadData>>;
  divining: number;
  dispatch: React.Dispatch<any>;
  image: any;
  imgRef: any;
  takeScreenshot: any;
}

function Divine({
  spreadData,
  setSpreadData,
  setEnd,
  divinedData,
  setDivinedData,
  divining,
  dispatch,
  image,
  imgRef,
  takeScreenshot,
}: Props) {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const number = spreadData.spread.reduce(
    (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
    0
  );
  const tarot = cards.cards;
  function getRandomCards(n: number) {
    const indexes = Array.from({ length: 78 }, (_, i) => i); // 創建包含 0 到 77 的陣列
    for (let i = indexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 生成 0 到 i 之間的隨機整數
      [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // 交換 indexes[i] 和 indexes[j] 的位置
    }
    return indexes.slice(0, n);
  }
  function getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function getRandomBool(n: number) {
    const boolArray: boolean[] = [];
    for (let i = 0; i < number; i++) {
      boolArray.push(getRandom(1, 1000) % 2 === 0);
    }
    return boolArray;
  }
  async function createDivinedData(newData, userUID) {
    const docId = await firebase.newDivinedData(newData, userUID);
    console.log(docId, "docId");
    if (docId) {
      setDivinedData({ ...newData, docId: docId });
    } else {
      console.log("error no docId");
    }
  }
  const getImage = () => takeScreenshot(imgRef.current);

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
    setEnd(true);
    dispatch({ type: "end" });
    createDivinedData(newData, userUID);
  };
  return (
    <>
      {/* <button onClick={handleClickStart}>占卜</button> */}
      {/* <button
        onClick={() => {
          getImage();
        }}
      >
        截圖
      </button> */}
      {divining === 1 && <button onClick={handleClickDivine}>占卜</button>}
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
