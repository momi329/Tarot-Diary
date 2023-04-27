import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { RxCross1 } from "react-icons/rx";
import { VscAdd } from "react-icons/vsc";
import { AiOutlineMinus } from "react-icons/ai";

import MyImages from "./MyImages";
import { db } from "../utils/firebase";
import { doc, updateDoc, Timestamp, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext";
import Button from "./Button";
import lightCard from "../images/card-light.png";
function Draggable({ edit, setEdit, spreadData, id }) {
  const [onSave, setOnSave] = useState({
    spreadId: "",
    title: "",
    description: "",
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
    ],
  });
  const { userUID } = useContext(AuthContext);
  const navigate = useNavigate();
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
        <h1 className='font-NT text-8xl text-yellow  tracking-wide mb-6'>
          Design Your Spread!
        </h1>
        <p className='font-base tracking-wider mb-10 text-yellow'>
          設計你自己的牌陣，問自己想問的問題！
        </p>
        <div className='flex flex-row gap-9 mb-14'>
          <form className='flex flex-col gap-2 w-2/5 justify-between'>
            <h1 className='font-NTalt text-yellow text-4xl mt-10 mb-10 tracking-wide font-medium'>
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
              name='description'
              placeholder='請描述一下此牌陣的用法'
              value={onSave.description}
              onChange={(e) => inputChange(e, "description")}
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
      mx-auto  border-opacity-50 mb-14 p-[30px] pb-[133px] backdrop-blur-sm bg-white/10 '
      >
        {onSave.spread.map((item, i) => {
          return (
            <div
              className={`flex justify-center box-border w-[144px] h-[113px] ${
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
                  className={` rounded-xl w-[138px] h-[220px] cursor-pointer relative box-border 
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
                        className={`p-2 outline-none opacity-100 absolute top-9 text-green rounded-lg text-center 
                    w-[100px] h-[130px] resize-none  z-20 text-base text-slate-700 font-normal font-notoSansJP tracking-widest
                    ${
                      item.disabled ? " text-green bg-opacity-40 bg-white " : ""
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
                        className={`material-symbols-outlined  text-green  m-1  text-base font-NT shadowGreen
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
                        rignt-[10px] pl-7 pr-6 pt-[5px] pb-[4px] rounded-sm bg-opacity-30 absolute font-NT text-base'
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
      <div className='flex flex-row gap-5 w-[300px] mx-auto mb-40'>
        <div
          className='w-20 h-20 rounded-full  border-[2px] border-pink mx-auto justify-center items-center flex 
         hover:bg-pink hover:bg-opacity-60 hover:text-yellow hover:border-yellow hover:shadowYellow
        font-NT shadowPink text-8xl text-pink leading-4 text-center opacity-90 z-[2]'
          onClick={() => {
            const newOnsave = { ...onSave };
            const newLine = [0, 0, 0, 0, 0, 0, 0];
            newOnsave.spread.push(...newLine);
            // console.log(newOnsave);
            console.log(newOnsave);
            setOnSave(newOnsave);
          }}
        >
          <VscAdd className='w-10 h-10 self-center' />
          <div></div>
        </div>

        <div
          className='w-20 h-20 rounded-full  border-[2px] border-pink mx-auto justify-center items-center flex 
         hover:bg-pink hover:bg-opacity-60 hover:text-yellow hover:border-yellow hover:shadowYellow
        font-NT shadowPink text-8xl text-pink leading-4 text-center opacity-90 z-[2]'
          onClick={() => {
            const newOnsave = { ...onSave };
            if (newOnsave.spread.length > 28) {
              const newArray = newOnsave.spread.slice(
                0,
                newOnsave.spread.length - 7
              );
              setOnSave({ ...newOnsave, spread: newArray });
            }
          }}
        >
          <AiOutlineMinus className='w-10 h-10 self-center' />
        </div>
      </div>
    </>
  );
}

export default Draggable;
