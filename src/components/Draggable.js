import React, { useState, useEffect, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import MyImages from "./MyImages";
import firebase, { db } from "../utils/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
} from "firebase/firestore";
import { collection, addDoc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/authContext";

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
    ],
  });
  const { isLogin, user, userUID } = useContext(AuthContext);

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
      <div className='flex flex-row gap-[20px] mx-auto'>
        <form className='flex flex-col gap-2'>
          <h1>Design Your Spread!</h1>
          <p>設計你自己的牌陣，問自己想問的問題！</p>
          <h1>Pick{cardNumber}Cards</h1>
          <input
            className='w-[300px] border-b-2 border-slate-300 placeholder:text-slate-400 p-2 m-1 outline-none'
            type='text'
            name='title'
            placeholder='請輸入你的標題'
            value={onSave.title}
            onChange={(e) => inputChange(e, "title")}
            disabled={saved}
          />
          <input
            className='w-[300px] h-[60px] border-b-2 border-slate-300 placeholder:text-slate-400 p-2 m-1 outline-none'
            type='text'
            name='discription'
            placeholder='請描述一下此牌陣的用法'
            value={onSave.discription}
            onChange={(e) => inputChange(e, "discription")}
            disabled={saved}
          />
        </form>
        <MyImages className='order-2' onSave={onSave} setOnSave={setOnSave} />
      </div>
      <button onClick={createNewCard} className='bg-slate-400 p-1 m-1'>
        New Card
      </button>
      <button onClick={saveIt} className='bg-slate-500 p-1 m-1'>
        Save
      </button>

      <div className='flex flex-wrap w-[1010px] border border-gray-50 z-1 mx-auto'>
        {onSave.spread.map((item, i) => {
          return (
            <div
              className={`flex justify-center  w-[100px] h-[80px] border border-slate-300 ${
                shine[i] ? "bg-gray-100" : ""
              }`}
              key={i}
              onDragEnter={(e) => onDragging(e)}
              onDragLeave={(e) => onDragging(e)}
              onDragOver={(e) => onDragged(e, i)}
              onDrop={(e) => drop(e, i)}
            >
              {item !== 0 && (
                <div
                  className={`border rounded-lg w-[90px] h-[150px] cursor-pointer relative
                  flex items-center justify-center flex-col bg-slate-800 text-white z-10 gap-2`}
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
                        className={`p-2 outline-none   opacity-80
                    w-[75px] h-[70px] resize-none  z-20 text-sm text-slate-700
                    ${
                      item.disabled ? " text-white opacity-60 bg-slate-300" : ""
                    }`}
                        type='text'
                        disabled={item.disabled}
                        onKeyDown={(e) => change(e, item, i)}
                        onChange={(e) => change(e, item, i)}
                        value={item.value}
                        readOnly={item.disabled}
                      />
                      <RiDeleteBin6Line
                        className='material-symbols-outlined slate-500 order-2'
                        onClick={() => {
                          deleteCard(item);
                        }}
                      />

                      <FiEdit
                        className={`material-symbols-outlined  slate-500 w-[13px] 
                    h-[13px] absolute z-40 top-5 right-3 ${
                      item.disabled ? "" : "opacity-0"
                    }`}
                        onClick={() => {
                          editCard(item, i);
                        }}
                      />
                      <select
                        defaultValue={item.order}
                        onChange={(e) => handleOptionChange(e, item, i)}
                        className='text-white bg-slate-800'
                      >
                        {onSave.spread
                          .filter((item) => item !== 0)
                          .map((_, i) => (
                            <option
                              key={i + 1}
                              value={i + 1}
                              className='text-slate-800'
                            >
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
