import { Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/Button";
import MyImages from "../../components/MyImages";
import { AuthContext } from "../../context/authContext";
import { db } from "../../utils/firebase";
import type {
  DesignSpreadData,
  SpreadData,
  SpreadItem,
} from "../../utils/type";
import Drag from "./Drag";
import NewSpreadDetails from "./NewSpreadDetails";

type DragInfoType = {
  pastIndex: number;
  target: number | SpreadItem;
  shine: boolean[];
};
type DesignProps = {
  edit?: boolean;
  setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  spreadData?: SpreadData;
};
function Design({ edit, setEdit, spreadData }: DesignProps) {
  const [onSave, setOnSave] = useState<DesignSpreadData>(() => ({
    spreadId: "",
    title: "",
    description: "",
    userUID: "",
    image: "",
    spread: Array.from({ length: 35 }, (_, index) =>
      index === 0 ? { name: uuidv4(), value: "", disabled: true, order: 1 } : 0
    ),
  }));

  const { userUID } = useContext(AuthContext);
  const navigate = useNavigate();
  const shineArr = () => new Array(onSave.spread.length).fill(false);
  const [dragInfo, setDragInfo] = useState<DragInfoType>({
    pastIndex: 0,
    target: 0,
    shine: shineArr(),
  });

  useEffect(() => {
    if (edit && spreadData) {
      setOnSave(spreadData);
      return;
    }
    if (userUID) {
      const spreadId = uuidv4();
      setOnSave({ ...onSave, userUID, spreadId });
    } else {
      navigate("/signin");
    }
  }, []);

  const createNewCard = () => {
    const cards = onSave.spread.filter((curr) => curr !== 0).length;
    if (cards > 15) return;
    const zeroIndex = onSave.spread.findIndex((item) => item === 0);
    const newSpread = { ...onSave }.spread;
    newSpread[zeroIndex] = {
      name: uuidv4(),
      value: "",
      disabled: true,
      order: cards + 1,
    };
    setOnSave({ ...onSave, spread: newSpread });
  };

  const saveIt = async () => {
    if (edit && spreadData && setEdit) {
      const NewSpread = { ...onSave, time: Timestamp.fromDate(new Date()) };
      const spreadRef = doc(db, "spreads", spreadData.spreadId);
      await updateDoc(spreadRef, NewSpread);
      setEdit(false);
    } else {
      let newData = { ...onSave, time: Timestamp.fromDate(new Date()) };
      if (onSave.spreadId === "") {
        const id = uuidv4();
        newData = {
          ...onSave,
          spreadId: id,
          time: Timestamp.fromDate(new Date()),
        };
      }
      if (onSave.userUID === "") {
        newData = {
          ...onSave,
          userUID,
          time: Timestamp.fromDate(new Date()),
        };
      }
      await setDoc(doc(db, "spreads", newData.spreadId), newData);
      navigate(`/spread/${newData.spreadId}`);
    }
    setOnSave({
      spreadId: "",
      title: "",
      description: "",
      userUID: "",
      image: "",
      spread: [
        { name: uuidv4(), value: "", disabled: true, order: 1 },
        ...Array(99).fill(0),
      ],
    });
  };
  function checkUniqueOrder(arr: SpreadItem[]) {
    const orders: number[] = [];
    for (let i = 0; i < arr.length; i++) {
      const order = Number(arr[i].order);
      if (orders.includes(order)) {
        return false;
      }
      orders.push(order);
    }
    return true;
  }

  const validationWarn = () => {
    switch (true) {
      case onSave.title === "":
        return "!請填寫標題";
      case onSave.description === "":
        return "!請填寫說明";
      case onSave.image === "":
        return "!請選擇主要圖片";
      case onSave.spread.filter((curr) => curr !== 0).length === 0:
        return "!至少需要一張卡片";
      case !checkUniqueOrder(
        onSave.spread.filter((item) => typeof item !== "number") as SpreadItem[]
      ):
        return "!抽排順序不能重複";
      default:
        return "";
    }
  };
  const validation = () => {
    return (
      onSave.title === "" ||
      onSave.description === "" ||
      onSave.image === "" ||
      onSave.spread.filter((item) => item !== 0).length === 0 ||
      !checkUniqueOrder(
        onSave.spread.filter((item) => item !== 0) as SpreadItem[]
      )
    );
  };
  return (
    <>
      <div className="w-screen h-[80px]" />
      <div className="w-ml max-w-screen-md mx-auto mt-16 mb-8">
        <h1 className="font-NT text-8xl text-yellow  tracking-wide mb-6">
          Design Your Spread!
        </h1>
        <p className="font-base tracking-wider mb-10 text-yellow">
          設計你自己的牌陣，問自己想問的問題！
        </p>
        <div className="flex flex-row gap-9 mb-14">
          <NewSpreadDetails setOnSave={setOnSave} onSave={onSave} />
          <div className="order-2 w-3/5">
            <MyImages onSave={onSave} setOnSave={setOnSave} />
          </div>
        </div>
        <div className="flex gap-9 ">
          <div className="group relative">
            <div
              className="group-hover:opacity-100 duration-200 opacity-0 bg-pink/30 text-yellow text-sm p-1 w-[100px]
         font-notoSansJP text-center rounded-lg m-1 tracking-widest absolute top-[-35px] left-9 z-1"
            >
              !上限16張
            </div>
            <Button
              action={() => createNewCard()}
              type={"small"}
              value={"NEW CARD"}
            />
          </div>
          <div className="group relative">
            <div
              className={`${
                validationWarn() === ""
                  ? "group-hover:opacity-0 bg-none"
                  : "group-hover:opacity-100 bg-pink/30"
              }
               duration-200 opacity-0  text-yellow text-sm p-1 
         font-notoSansJP text-center rounded-lg m-1 tracking-widest absolute top-[-35px] left-9 z-1 `}
            >
              {validationWarn()}
            </div>
            <Button
              action={() => saveIt()}
              type={"small"}
              value={"SAVE"}
              disabled={validation()}
            />
          </div>
        </div>
      </div>
      <Drag
        dragInfo={dragInfo}
        shineArr={shineArr}
        setDragInfo={setDragInfo}
        onSave={onSave}
        setOnSave={setOnSave}
      />
    </>
  );
}

export default Design;
