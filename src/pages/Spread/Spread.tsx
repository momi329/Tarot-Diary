import { useState, useEffect, useContext, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

import AskAndNote from "../../components/AskAndNote";
import ChooseCard from "./ChooseCard";
import useGetDesign from "./hooks/useGetDesign";
import SpreadInfo from "./SpreadInfo";
import { SpreadPlace } from "./SpreadPlace";

import Draggable from "../Draggable";
import Button from "../../components/Button";
import UnderlineInput from "../../components/UnderlineInput";

import cards from "../../tarotcard/tarot-images";
import { getRandomCards, getRandomBool } from "../../utils/function";

export enum ActionType {
  Preview = "preview",
  Start = "start",
  End = "end",
}

function reducer(_, action: { type: ActionType }): ActionType {
  switch (action.type) {
    case ActionType.Preview: {
      return ActionType.Preview;
    }
    case ActionType.Start: {
      return ActionType.Start;
    }
    case ActionType.End: {
      return ActionType.End;
    }
  }
  throw Error("Unknown action: " + action.type);
}

function Spread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLogin, userUID } = useContext(AuthContext);
  const [divining, dispatch] = useReducer(reducer, ActionType.Preview);
  const [askAI, setAskAI] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const {
    spreadData,
    setSpreadData,
    divinedData,
    setDivinedData,
    getDesign,
    pickCard,
    setPickCard,
  } = useGetDesign();

  const tarot = cards.cards;

  useEffect(() => {
    const divine = localStorage.getItem("myResult");
    if (divine) {
      const data = JSON.parse(divine);
      setSpreadData(data);
      setDivinedData(data);
      dispatch({ type: ActionType.End });
      localStorage.removeItem("myResult");
    } else {
      id && getDesign();
    }
  }, [id, edit]);

  const handleClickDivine = async () => {
    const number = spreadData?.spread.reduce(
      (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
      0
    );
    const randomCard = getRandomCards(number);
    const randomReverse = getRandomBool(number);
    const modifiedData = spreadData?.spread.reduce(
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
    dispatch({ type: ActionType.End });
  };

  if (!spreadData) {
    return <></>;
  }
  return (
    <>
      <div className="w-screen h-[100%] bg-cover flex justify-center  bg-center">
        <div className="bg-black bg-opacity-50 fixed w-full h-full" />
        <div
          className={`fixed w-full h-full bg-cover bg-center  p-[40px]`}
          style={{ backgroundImage: `url(${spreadData?.image})` }}
        />
        <div className="fixed w-full h-full bg-cover bg-center  bg-black/20 p-[40px]" />

        <div
          className={`mx-auto text-yellow w-[1180px]  relative mb-20 mt-40 m-[10px] 
          backdrop-blur-sm bg-black/30 `}
        >
          <SpreadInfo
            spreadData={spreadData}
            divining={divining}
            setEdit={setEdit}
          />

          {divining === "preview" && (
            <div className="flex gap-3 mb-8 ml-8 w-[280px]">
              <Button
                action={() => {
                  if (!isLogin) {
                    navigate(`/signin`);
                  }
                  dispatch({ type: ActionType.Start });
                }}
                value={"Start"}
                type={"big"}
              />
            </div>
          )}
          {divining !== "preview" && (
            <div className="w-[25%] mb-4  ml-8">
              <UnderlineInput
                name="請寫下你的問題："
                value={divinedData?.question || ""}
                inputType={"text"}
                action={(e) => {
                  setDivinedData({
                    ...divinedData,
                    question: e.target.value,
                  });
                }}
                placeholder="Write Your Question"
                disabled={divining !== "start" ? true : false}
              />
            </div>
          )}

          {spreadData?.userUID === userUID && edit && (
            <div
              className="w-[110%] h-[100%] overflow-y-scroll p-16 bg-darkPink z-20 mx-auto fixed top-1/2 left-1/2 
          transform -translate-x-1/2 -translate-y-1/2"
            >
              <Draggable
                setEdit={setEdit}
                edit={edit}
                spreadData={spreadData}
                id={id}
              />
            </div>
          )}

          {divining === "start" && (
            <ChooseCard
              handleClickDivine={handleClickDivine}
              pickCard={pickCard}
              setPickCard={setPickCard}
              divinedData={divinedData}
            />
          )}
          {(divining === "preview" || divining === "end") && (
            <SpreadPlace
              type={divining === "end" ? divinedData : spreadData}
              tarot={tarot}
              size={"large"}
            />
          )}
          {divining === "end" && (
            <>
              <div className=" w-[100%] px-16 group relative pb-16">
                <AskAndNote
                  divinedData={divinedData}
                  setDivinedData={setDivinedData}
                  askAI={askAI}
                  setAskAI={setAskAI}
                  divining={divining}
                  dispatch={dispatch}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
export default Spread;
