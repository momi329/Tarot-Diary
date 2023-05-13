import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

import useGetDesign from "./hooks/useGetDesign";
import SpreadInfo from "./SpreadInfo";

import cards from "../../tarotcard/tarot-images";
import { getRandomBool, getRandomCards } from "../../utils/function";
import LowerArea from "./LowerArea";

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
  // TODO: change divining to "type" if it's a props
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
    const number: number = spreadData?.spread.filter(
      (item) => item !== 0
    ).length;
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
            type={divining}
            setEdit={setEdit}
            edit={edit}
          />
          <LowerArea
            type={divining}
            dispatch={dispatch}
            data={divinedData}
            // setDivinedData={setDivinedData}
          />
          {/* {divining === "preview" && (
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
          )} */}
          {/* {divining !== "preview" && (
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
          )} */}

          {/* {divining === "start" && (
            <ChooseCard
              handleClickDivine={handleClickDivine}
              pickCard={pickCard}
              setPickCard={setPickCard}
              divinedData={divinedData}
            />
          )} */}

          {/* {(divining === "end" || divining === "preview") && (
            <SpreadPlace
              type={
                (divining === "end" && divinedData) ||
                (divining === "preview" && spreadData)
              }
              tarot={tarot}
              size={"large"}
            />
          )} */}

          {/* {divining === "end" && (
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
          )} */}
        </div>
      </div>
    </>
  );
}
export default Spread;
