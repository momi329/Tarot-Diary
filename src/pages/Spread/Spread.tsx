import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext, useReducer } from "react";
import { AuthContext } from "../../context/authContext";
import cards from "../../tarotcard/tarot-images";
import firebase from "../../utils/firebase";
import Draggable from "../Draggable";
import AskAndNote from "../../components/AskAndNote";
import Button from "../../components/Button";
import { SpreadPlace } from "./SpreadPlace";
import type { SpreadData, DesignSpreadData } from "../../utils/type";
import UnderlineButton from "../../components/UnderlineButton";
import { getRandomCards, getRandomBool } from "../../utils/function";
import UnderlineInput from "../../components/UnderlineInput";
import ChooseCard from "./ChooseCard";

const initialDivinedData: DesignSpreadData = {
  userUID: "",
  title: "",
  image: "",
  spread: [],
  description: "",
  spreadId: "",
  question: "",
  secret: false,
};

function reducer(_, action) {
  switch (action.type) {
    case "preview": {
      return "preview";
    }
    case "start": {
      return "start";
    }
    case "pickEnoughCards": {
      return "pickEnoughCards";
    }
    case "end": {
      return "end";
    }
  }
  throw Error("Unknown action: " + action.type);
}

function Spread() {
  const { isLogin, userUID } = useContext(AuthContext);
  const [divining, dispatch] = useReducer(reducer, "preview");
  const [spreadData, setSpreadData] = useState<SpreadData | null>(null);
  const [divinedData, setDivinedData] =
    useState<DesignSpreadData>(initialDivinedData);
  const [askAI, setAskAI] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [pickCard, setPickCard] = useState<Number[]>([0, 0]);

  const { id } = useParams();
  const tarot = cards.cards;

  async function getDesign(id: string): Promise<void> {
    const newData = await firebase.getDesign(id);
    if (newData) {
      setSpreadData(newData[0]);
      setDivinedData({
        userUID: newData[0].userUID,
        title: newData[0].title,
        image: newData[0].image,
        spread: [],
        description: newData[0].description,
        spreadId: newData[0].spreadId,
        question: "",
        secret: false,
      });
      setPickCard([
        0,
        newData[0].spread.reduce(
          (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
          0
        ),
      ]);
    }
  }
  const navigate = useNavigate();

  useEffect(() => {
    const divine = localStorage.getItem("myResult");
    if (divine) {
      const data = JSON.parse(divine);
      setSpreadData(data);
      setDivinedData(data);
      dispatch({ type: "end" });
      localStorage.removeItem("myResult");
    } else {
      if (id) {
        console.log("id");
        getDesign(id);
      }
    }
  }, [id, edit]);

  const handleClickDivine = async () => {
    const number = spreadData?.spread.reduce(
      (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
      0
    );
    const randomCard = await getRandomCards(number);
    const randomReverse = await getRandomBool(number);
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
    dispatch({ type: "end" });
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
          <div className="flex flex-row justify-between mx-8 mt-8">
            <span className="flex flex-col">
              <h1
                className={`text-3xl font-NT  tracking-widest mt-4 
                ${
                  spreadData?.userUID === "all" ? "shadowYellow text-5xl" : ""
                }`}
              >
                {spreadData?.title}
              </h1>
              <p className="w-[60%] leading-7 text-sm mt-5">
                {spreadData?.description}
              </p>
              <div className="font-NT text-yellow text-2xl mt-8 mb-5 tracking-widest shadowYellow ">
                PICK{" "}
                {spreadData?.spread.reduce(
                  (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
                  0
                )}{" "}
                CARDS
              </div>
            </span>

            {divining === "preview" && userUID === spreadData?.userUID ? (
              <Button
                action={() => {
                  setEdit(true);
                }}
                value={"Edit"}
                type={"little"}
              />
            ) : (
              spreadData?.author && (
                <div>
                  <div>Author</div>
                  <UnderlineButton
                    value={spreadData.author}
                    type={"memberPage"}
                    action={() => navigate(`/profile/${spreadData.userUID}`)}
                  />
                </div>
              )
            )}
          </div>

          {divining === "preview" && (
            <div className="flex gap-3 mb-8 ml-8 w-[280px]">
              <Button
                action={() => {
                  if (!isLogin) {
                    navigate(`/signin`);
                  }
                  dispatch({ type: "start" });
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

          {divining === "start" ? (
            <ChooseCard
              handleClickDivine={handleClickDivine}
              pickCard={pickCard}
              setPickCard={setPickCard}
              divinedData={divinedData}
            />
          ) : (
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
