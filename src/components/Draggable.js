import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiEdit } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import MyImages from "./MyImages";
import firebase, { db } from "../utils/firebase";
import { doc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import Button from "./Button";
import lightCard from "../images/card-light.png";
function Draggable({ edit, setEdit, spreadData, id }) {
  const [onSave, setOnSave] = useState({
    spreadId: "",
    title: "",
    discription: "",
    userUID: "",
    image: "",
    spread: [
      { name: uuidv4(), value: "", disabled: true, order: 1 },
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
    ],
  });
  const { userUID } = useContext(AuthContext);

  const [cardNumber, setCardNumber] = useState(() =>
    onSave.spread.reduce((acc, curr) => {
      return curr !== 0 ? acc + 1 : acc;
    }, 0)
  );
  const [pastIndex, setPastIndex] = useState(null);
  const [target, setTarget] = useState(0);
  const [shine, setShine] = useState(
    new Array(onSave.spread.length).fill(false)
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userUID = localStorage.getItem("userUID");
    if (edit) {
      setOnSave(spreadData);
      return;
    }
    if (userUID) {
      const spreadId = uuidv4();
      setOnSave({ ...onSave, userUID: userUID, spreadId: spreadId });
    } else {
      alert("請先登入");
    }
  }, []);

  const onDragging = (e) => {
    const newShine = [...shine].fill(false);
    setShine(newShine);
  };
  const onDragged = (e, i) => {
    e.preventDefault();
    const newShine = [...shine].fill(false);
    newShine[i] = true;
    setShine(newShine);
  };
  const drop = (e, i) => {
    let newState = { ...onSave }.spread;
    if (newState[i] !== 0) {
      setOnSave({ ...onSave, spread: newState });
    } else {
      newState[pastIndex] = 0;
      newState[i] = target;
      setOnSave({ ...onSave, spread: newState });
    }
    const newShine = [...shine].fill(false);
    setShine(newShine);
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
    const zeroIndex = onSave.spread.findIndex((item) => item === 0);
    let newState = { ...onSave }.spread;
    newState[zeroIndex] = {
      name: uuidv4(),
      value: "",
      disabled: true,
      order: cardNumber + 1,
    };
    setOnSave({ ...onSave, spread: newState });
    setCardNumber((prev) => prev + 1);
    return;
  };
  const deleteCard = (item) => {
    const deletedCardIndex = onSave.spread.findIndex((i) => i === item);
    let newState = { ...onSave }.spread;
    newState[deletedCardIndex] = 0;
    setOnSave({ ...onSave, spread: newState });
    setCardNumber((prev) => prev - 1);
    return;
  };
  const editCard = (item, i) => {
    item.disabled = false;
    let newState = { ...onSave }.spread;
    newState[i] = item;
    setOnSave({ ...onSave, spread: newState });
  };
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
      }
      if (onSave.userUID === "") {
        newData = {
          ...onSave,
          userUID: userUID,
          time: Timestamp.fromDate(new Date()),
        };
      }
      await setDoc(doc(db, "spreads", newData.spreadId), newData);
    }
    alert("Success");
    setOnSave({
      spreadId: "",
      title: "",
      discription: "",
      userUID: "",
      image: "",
      spread: [
        { name: uuidv4(), value: "", disabled: true, order: 1 },
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ],
    });
    setEdit(false);
  };
  return (
    <>
      <div className='w-screen h-[80px]' />
      <div className='w-ml max-w-screen-md mx-auto mt-16 mb-8'>
        <h1 className='font-sygma font-bold text-8xl text-yellow leading-4xl tracking-wider uppercase mb-4'>
          Design Your Spread!
        </h1>
        <p className='font-base tracking-wider mb-10 text-yellow'>
          設計你自己的牌陣，問自己想問的問題！
        </p>
        <div className='flex flex-row gap-9 mb-14'>
          <form className='flex flex-col gap-2 w-2/5 justify-between'>
            <h1 className='font-sygma text-yellow text-4xl mt-10 mb-10 tracking-wider'>
              Pick {cardNumber} {cardNumber === 1 ? "Card" : "Cards"}
            </h1>
            <input
              className='w-[100%] pl-2 pb-4 border-b-[1px] border-yellow  text-yellow
              tracking-wider placeholder:text-gray placeholder:opacity-75'
              type='text'
              name='title'
              placeholder='請輸入你的標題'
              value={onSave.title}
              onChange={(e) => inputChange(e, "title")}
              disabled={saved}
            />
            <input
              className='w-[100%] h-[130px] pl-2 pb-16 border-b-[1px] text-yellow
               border-yellow  tracking-wider placeholder:text-gray placeholder:opacity-75'
              type='text'
              name='discription'
              placeholder='請描述一下此牌陣的用法'
              value={onSave.discription}
              onChange={(e) => inputChange(e, "discription")}
              disabled={saved}
            />
          </form>
          <MyImages
            className='order-2 w-3/5'
            onSave={onSave}
            setOnSave={setOnSave}
          />
        </div>
        <div className='flex gap-9'>
          <Button
            action={() => createNewCard()}
            type={"small"}
            value={"NEW CARD"}
          />
          <Button action={() => saveIt()} type={"small"} value={"SAVE"} />
        </div>
      </div>

      <div
        className='flex flex-wrap justify-center max-w-screen-md border border-yellow z-1 
      mx-auto  border-opacity-50 mb-44'
      >
        {onSave.spread.map((item, i) => {
          return (
            <div
              className={`flex justify-center box-border w-[119px] h-[93px] ${
                shine[i] ? "bg-pink opacity-60" : ""
              }`}
              key={i}
              onDragEnter={(e) => onDragging(e)}
              onDragLeave={(e) => onDragging(e)}
              onDragOver={(e) => onDragged(e, i)}
              onDrop={(e) => drop(e, i)}
            >
              {item !== 0 && (
                <div
                  style={{ background: `center/contain url(${lightCard})` }}
                  className={` rounded-xl w-[117px] h-[186px] cursor-pointer relative box-border 
                  flex items-center justify-center flex-col bg-slate-800 text-yellow z-10 gap-2 bg-opacity-80`}
                  draggable={true} //TODO
                  onDragStart={(e) => {
                    e.target.style.opacity = "0.01";
                    setTarget(item);
                    setPastIndex(i);
                    const newShine = [...shine].fill(false);
                    setShine(newShine);
                  }}
                  onDragEnd={(e) => {
                    e.target.style.opacity = "1";
                  }}
                >
                  {saved ? (
                    <div>
                      <p>{item.value}</p>
                      <p>{item.order}</p>
                    </div>
                  ) : (
                    <>
                      <textarea
                        className={`p-2 outline-none opacity-80 absolute top-8 text-green rounded-lg text-center 
                    w-[95px] h-[110px] resize-none  z-20 text-base text-slate-700 font-normal font-notoSansJP tracking-widest
                    ${
                      item.disabled ? " text-green opacity-0 bg-slate-300 " : ""
                    }`}
                        type='text'
                        disabled={item.disabled}
                        onKeyDown={(e) => change(e, item, i)}
                        onChange={(e) => change(e, item, i)}
                        value={item.value}
                        readOnly={item.disabled}
                      />
                      <RxCross1
                        className='material-symbols-outlined text-green order-2 top-[6px]
                        left-2 absolute w-[17px] h-[25px] m-1 z-40'
                        onClick={() => {
                          deleteCard(item);
                        }}
                      />

                      <div
                        className={`material-symbols-outlined  text-green  m-1  text-base font-sygma shadowGreen
                    absolute z-40 top-[8px] right-2 tracking-wider ${
                      item.disabled ? "" : "opacity-0"
                    }`}
                        onClick={() => {
                          editCard(item, i);
                        }}
                      >
                        EDIT
                      </div>
                      <select
                        defaultValue={item.order}
                        onChange={(e) => handleOptionChange(e, item, i)}
                        className='text-green border-b-green bg-white outline-none bottom-2 shadowBlack
                        rignt-[10px] pl-7 pr-6 pt-[5px] pb-[4px] rounded-sm bg-opacity-30 absolute font-sygma text-base'
                      >
                        {onSave.spread
                          .filter((item) => item !== 0)
                          .map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                      </select>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Draggable;
