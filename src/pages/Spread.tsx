import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useReducer } from "react";
import { AuthContext } from "../context/authContext";
import Divine from "../components/Divine";
import cards from "../tarotcard/tarot-images";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import Draggable from "../components/Draggable";
import AskGPT from "../components/AksGPT";
import { createRef } from "react";
import { useScreenshot } from "use-react-screenshot";
import lightCard from "../images/card-light.png";
import Button from "../components/Button";
import Moon from "../images/Moon";
import { SpreadPlace } from "../components/SpreadPlace";
import Star from "../images/Star";
export interface SpreadData {
  userUID: string;
  title: string;
  image: string;
  spread: (
    | number
    | {
        order: number;
        disabled?: boolean;
        value: string;
        name: string;
        card: number;
        reverse: boolean;
      }
  )[];
  description?: string;
  spreadId: string;
}

export interface DraggableProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  spreadData: SpreadData | undefined;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | undefined>>;
}
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
export interface DesignSpreadData {
  image: string;
  title: string;
  spread:
    | number[]
    | {
        disabled: boolean;
        value: string;
        order: number;
        name: string;
        card: number;
        reverse: boolean;
      }[];
  userUID?: string;
  description: string;
  spreadId: string;
  question?: string;
  secret: boolean;
}
function reducer(state, action) {
  switch (action.type) {
    case "preview": {
      return 0;
      //預覽狀態
    }
    case "start": {
      return 1;
      //開始選牌
    }
    case "pickEnoughCards": {
      return 2;
      //占卜
    }
    case "end": {
      return 3;
      //顯示結果
    }
  }
  throw Error("Unknown action: " + action.type);
}

function Spread() {
  const imgRef: React.RefObject<HTMLImageElement> = createRef();
  const [image, takeScreenshot] = useScreenshot();
  const { isLogin, user, userUID } = useContext(AuthContext);
  const [spreadData, setSpreadData] = useState<SpreadData | undefined>(
    undefined
  );
  const [divinedData, setDivinedData] =
    useState<DesignSpreadData>(initialDivinedData);
  const { id } = useParams();
  const tarot = cards.cards;
  const [divining, dispatch] = useReducer(reducer, 0);
  // const [end, setEnd] = useState<boolean>(false);
  const [askAI, setAskAI] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [pickCard, setPickCard] = useState<Number[]>([0, 0]);
  useEffect(() => {
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
    if (id) {
      getDesign(id);
    }
  }, [id, edit]);

  if (spreadData === undefined) {
    return;
  }

  return (
    <>
      <div
        // style={{ backgroundImage: `url(${spreadData.image})` }}
        className='w-screen h-[100%] bg-cover 
         flex justify-center  bg-center '
      >
        <div className='bg-black bg-opacity-50 fixed w-full h-full'></div>
        <div
          className='fixed w-full h-full bg-cover bg-center  p-[40px]'
          style={{ backgroundImage: `url(${spreadData.image})` }}
        />
        <div className='fixed w-full h-full bg-cover bg-center  bg-black/20 p-[40px]' />
        <div
          className={`mx-auto text-yellow w-[1180px]  relative mb-20 mt-40 m-[10px] 
          backdrop-blur-sm bg-black/30 `}
        >
          <div className='flex flex-row justify-between mx-8 mt-8'>
            <span className='flex flex-col'>
              <h1
                className={`text-3xl font-NT  tracking-widest mt-4 
            ${spreadData.userUID === "all" ? "shadowYellow text-5xl" : ""}`}
              >
                {spreadData.title}
              </h1>
              <p className='w-[60%] leading-7 text-sm mt-5 '>
                {spreadData.description}
              </p>
              <div className='font-NT text-yellow text-2xl mt-8 mb-5 tracking-widest shadowYellow '>
                PICK{" "}
                {spreadData.spread.reduce(
                  (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
                  0
                )}{" "}
                CARDS
              </div>
            </span>
            {/* 編輯 here */}
            {/* {spreadData.userUID !== "all" && divining === 0 && (
              <Button
                action={() => {
                  setEdit(true);
                }}
                value={"Edit"}
                type={"little"}
              />
            )} */}
            {divining === 0 && (
              <Button
                action={() => {
                  setEdit(true);
                }}
                value={"Edit"}
                type={"little"}
              />
            )}
          </div>
          {/* 開始選牌 */}
          {divining === 0 && (
            <div className='flex gap-3 mb-8 ml-8'>
              <Button
                action={() => dispatch({ type: "start" })}
                value={"Start"}
                type={"big"}
              />
            </div>
          )}
          {/* 寫下問題 */}
          {divining !== 0 && (
            <input
              type='text'
              value={divinedData.question}
              disabled={divining !== 1 ? true : false}
              onChange={(e) => {
                setDivinedData({ ...divinedData, question: e.target.value });
              }}
              className='bg-pink bg-opacity-20 p-2 ml-8 w-[25%] tracking-wider placeholder:text-yellow mb-4'
              placeholder='請寫下你的問題'
            />
          )}
          {/* -----更換狀態----- */}
          {/* 預覽 */}
          {/* 占卜 */}
          {divining === 0 && (
            <SpreadPlace type={spreadData} tarot={tarot} size={"large"} />
          )}
          {/* 可編輯 */}
          {edit && (
            <div
              className='w-[110%] h-[100%] overflow-y-scroll p-16 bg-darkPink z-20 mx-auto fixed top-1/2 left-1/2 
          transform -translate-x-1/2 -translate-y-1/2'
            >
              <Draggable
                setEdit={setEdit}
                edit={edit}
                spreadData={spreadData}
                id={id}
              />
            </div>
          )}
          {/* 結果 */}
          {divining === 3 && (
            <SpreadPlace type={divinedData} tarot={tarot} size={"large"} />
          )}

          {/* 選牌占卜 */}
          {divining === 1 && (
            <div className='flex flex-col gap-6 justify-center mb-18 mt-5 items-center'>
              <SelectCard pickCard={pickCard} setPickCard={setPickCard} />
              <span className='flex flex-row items-end'>
                <span className='text-5xl text-pink font-NT shadowPink tracking-widest'>
                  {pickCard[0] + ""}
                </span>
                <p className='text-3xl text-pink font-NT shadowPink tracking-widest mb-1'>
                  {`/` + pickCard[1]}
                </p>
              </span>
              <Divine
                spreadData={spreadData}
                setSpreadData={setSpreadData}
                divinedData={divinedData}
                setDivinedData={setDivinedData}
                divining={divining}
                dispatch={dispatch}
                pickCard={pickCard}
              />
              <div className='w-[100%] h-16'></div>
            </div>
          )}

          {/* 占卜 */}
          {divining === 3 && (
            <Divine
              spreadData={spreadData}
              setSpreadData={setSpreadData}
              // end={end}
              // setEnd={setEnd}
              divinedData={divinedData}
              setDivinedData={setDivinedData}
              divining={divining}
              dispatch={dispatch}
              pickCard={pickCard}
            />
          )}
          {/* 詢問AI */}
          {divining === 3 && (
            <div className=' w-[100%] px-16 group relative pb-16'>
              <AskGPT
                divinedData={divinedData}
                setDivinedData={setDivinedData}
                askAI={askAI}
                setAskAI={setAskAI}
                divining={divining}
                dispatch={dispatch}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default Spread;

export const divine = (item, i, tarot) => {
  return (
    <div
      className={`border rounded-lg w-[108px] h-[180px] cursor-pointer relative
flex items-center justify-center flex-col  text-white z-1 gap-2 bg-slate-700`}
    >
      {item.card !== undefined && (
        <Link to={`/card/${item.card}`}>
          <img
            src={tarot[item.card].img}
            alt={tarot[item.card].name}
            className={`${
              item.reverse ? "" : "rotate-180"
            } w-[100%] h-[100%] absolute top-0 left-0 `}
          />
        </Link>
      )}
    </div>
  );
};
export const SelectCard = ({ setPickCard, pickCard }) => {
  const [cardArr, setCardArr] = useState(new Array(24).fill(false));

  return (
    <div className='flex flex-row w-[90%] h-[350px] justify-center relative mt-5 '>
      {cardArr.map((card, index) => {
        return (
          <div
            key={index}
            className={`rounded-lg absolute top-0 w-[120px] cursor-pointer shadow-lg shadow-green shadow-opacity-60 
            origin-center rotate-[${index * 2 - 22}deg] translate-x-${
              index * 50 - 600
            }
            ${
              card
                ? "top-[-40px] "
                : " hover:top-[-20px] hover:transform hover:-translate-x-[20px] hover:-translate-y-[20px] transition duration-300"
            }
             `}
            style={{
              // left: `${(index - 1) * 40}px`,
              transform: `rotate(${index * 2 - 22}deg) translateX(${
                index * 40 - 440
              }px)`,
              transformOrigin: `center bottom`,
            }}
            onClick={() => {
              const newCardArr = [...cardArr];
              newCardArr[index] = !newCardArr[index];
              const count = newCardArr.reduce(
                (acc, val) => (val ? acc + 1 : acc),
                0
              );
              const newPickCard = [...pickCard];
              if (count <= pickCard[1] && pickCard[0] <= pickCard[1]) {
                newPickCard[0] = count;
                setPickCard(newPickCard);
                setCardArr(newCardArr);
              }
            }}
          >
            <img src={lightCard} alt='card' className='w-[100%]' />
          </div>
        );
      })}
    </div>
  );
};
