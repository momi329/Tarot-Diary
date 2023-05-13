import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Drag from "./Drag";

import { Timestamp, doc, setDoc, updateDoc } from "firebase/firestore";
import Button from "../../components/Button";
import MyImages from "../../components/MyImages";
import { AuthContext } from "../../context/authContext";
import lightCard from "../../images/card-light.png";
import { db } from "../../utils/firebase";
import type { SpreadData, SpreadItem } from "../../utils/type";
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
  const [onSave, setOnSave] = useState(() => ({
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
    //todo 記得刪掉
    const userUID = localStorage.getItem("userUID");
    if (edit) {
      //todo 可以在onsave裡判斷即可
      setOnSave(spreadData);
      return;
    }
    if (userUID) {
      console.log("???");
      const spreadId = uuidv4();
      setOnSave({ ...onSave, userUID: userUID, spreadId: spreadId });
    } else {
      //改成無訪問權限
      alert("請先登入");
    }
  }, []);

  const onDragging = () => {
    const newDragInfo = { ...dragInfo };
    newDragInfo.shine = shineArr();
    setDragInfo(newDragInfo);
  };
  const onDragged = () => {
    e.preventDefault();
    const newDragInfo = { ...dragInfo };
    newDragInfo.shine = shineArr();
    newDragInfo.shine[i] = true;
    setDragInfo(newDragInfo);
  };
  const drop = (i) => {
    const newDragInfo = { ...dragInfo };
    const { pastIndex } = newDragInfo;
    let newState = { ...onSave }.spread;
    if (newState[i] !== 0) {
      setOnSave({ ...onSave, spread: newState });
    } else {
      newState[pastIndex] = 0;
      newState[i] = newDragInfo.target as SpreadItem;
      setOnSave({ ...onSave, spread: newState });
      newDragInfo.shine = shineArr();
      setDragInfo(newDragInfo);
    }
  };
  const change = (e, item, i) => {
    item.value = e.target.value;
    let newState = { ...onSave }.spread;
    newState[i] = item;
    if (e.key === "Enter") {
      item.disabled = true;
    }
    setOnSave({ ...onSave, spread: newState });
    return;
  };
  const createNewCard = () => {
    const cards = onSave.spread.filter((curr) => curr !== 0).length;
    if (cards > 15) return;
    const zeroIndex = onSave.spread.findIndex((item) => item === 0);
    let newState = { ...onSave }.spread;
    newState[zeroIndex] = {
      name: uuidv4(),
      value: "",
      disabled: true,
      order: cards + 1,
    };
    setOnSave({ ...onSave, spread: newState });
    return;
  };
  const deleteCard = (item) => {
    const deletedCardIndex = onSave.spread.findIndex((i) => i === item);
    let newState = { ...onSave }.spread;
    newState[deletedCardIndex] = 0;
    setOnSave({ ...onSave, spread: newState });
    return;
  };
  const editCard = (item, i) =>
    setOnSave({
      ...onSave,
      spread: [
        ...onSave.spread.slice(0, i),
        { ...item, disabled: false },
        ...onSave.spread.slice(i + 1),
      ],
    });

  const handleOptionChange = (e, item, i) => {
    item.order = e.target.value;
    let newState = { ...onSave }.spread;
    newState[i] = item;
    setOnSave({ ...onSave, spread: newState });
    return;
  };
  const inputChange = (e, name) => {
    setOnSave((prev) => ({ ...prev, [name]: e.target.value }));
    return;
  };
  const saveIt = async () => {
    if (edit) {
      const NewSpread = { ...onSave, time: Timestamp.fromDate(new Date()) };
      const spreadRef = doc(db, "spreads", spreadData.spreadId);
      await updateDoc(spreadRef, NewSpread);
    } else {
      let newData = { ...onSave, time: Timestamp.fromDate(new Date()) };
      if (onSave.spreadId === "") {
        const id = uuidv4();
        newData = {
          ...onSave,
          spreadId: id,
          time: Timestamp.fromDate(new Date()),
        };
        // navigate(`/spread/${id}`);
      }
      if (onSave.userUID === "") {
        newData = {
          ...onSave,
          userUID: userUID,
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
    setEdit(false);
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
          <NewSpreadDetails
            inputChange={inputChange}
            onSave={onSave}
            setOnSave={setOnSave}
          />
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
        drop={drop}
        lightCard={lightCard}
        change={change}
        deleteCard={deleteCard}
        editCard={editCard}
        handleOptionChange={handleOptionChange}
        onSave={onSave}
        setOnSave={setOnSave}
      />
    </>
  );
}

export default Design;
