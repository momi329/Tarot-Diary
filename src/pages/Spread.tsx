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
    case "selected": {
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
  const [end, setEnd] = useState<boolean>(false);
  const [askAI, setAskAI] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [showAI, serShowAI] = useState<boolean>(false);
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
          description: newData[0].discription,
          spreadId: newData[0].spreadId,
          question: "",
          secret: false,
        });
      }
    }
    if (id) {
      getDesign(id);
    }
  }, [id, edit]);

  if (spreadData === undefined) {
    return;
  }
  //為系統預設的排陣
  if (spreadData.userUID === "all") {
    return (
      <div
        key='divined'
        className='w-[80%] h-[100%] mx-auto flex justify-center flex-col'
      >
        <div className='w-[60%]'>
          <h1>{spreadData.title}</h1>
          <p>{spreadData.description}</p>
          <div>
            PICK{" "}
            {spreadData.spread.reduce(
              (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
              0
            )}{" "}
            CARDS
          </div>
          {/* 寫下問題 */}
          {divining !== 0 && (
            <input
              type='text'
              value={divinedData.question}
              onChange={(e) => {
                setDivinedData({ ...divinedData, question: e.target.value });
              }}
              disabled={end}
              placeholder='請寫下你的問題'
            />
          )}
        </div>
        <div className='flex flex-row'>
          {/* 是否公開 */}
          {divining === 3 && (
            <select
              onChange={(e) => {
                setDivinedData({
                  ...divinedData,
                  secret: e.target.value === "true",
                });
              }}
            >
              <option value='false'>Public</option>
              <option value='true'>Private</option>
            </select>
          )}
          {/* 預覽 */}
          {divining === 0 && (
            <>
              <button onClick={() => dispatch({ type: "start" })}>
                點我選牌
              </button>
              {spreadData.spread.map((item, index) => {
                return (
                  item !== 0 && (
                    <div key={index}>{card(item, index, tarot, end)}</div>
                  )
                );
              })}
            </>
          )}
          {/* 選牌＆占卜 */}
          {divining === 1 && (
            <div>
              {selectCard(cardArr)}
              <Divine
                spreadData={spreadData}
                setSpreadData={setSpreadData}
                end={end}
                setEnd={setEnd}
                divinedData={divinedData}
                setDivinedData={setDivinedData}
                divining={divining}
                dispatch={dispatch}
                image={image}
                takeScreenshot={takeScreenshot}
                imgRef={imgRef}
              />
            </div>
          )}
          {/* 結果 */}
          {divining === 3 &&
            divinedData.spread.map((item, index) => {
              return <div key={index}> {divine(item, index, tarot)} </div>;
            })}
        </div>
        {/* 問小雀 */}
        {divining === 3 && (
          <AskGPT
            divinedData={divinedData}
            setDivinedData={setDivinedData}
            end={end}
            setEnd={setEnd}
            askAI={askAI}
            setAskAI={setAskAI}
            divining={divining}
            dispatch={dispatch}
          />
        )}
      </div>
    );
  }
  //自己設計的牌陣
  return (
    <>
      <div
        style={{ backgroundImage: `url(${spreadData.image})` }}
        className='w-screen h-[300px] bg-cover bg-center opacity-75'
      />
      <div className='mx-auto text-yellow w-[1080px] mt-10'>
        <div className='flex flex-row justify-between'>
          <span className='flex flex-col'>
            <h1 className='text-3xl font-sygma  tracking-wideest'>
              {spreadData.title}
            </h1>
            <p>{spreadData.description}</p>
            <div className='font-sygma text-yellow text-2xl mt-3 mb-5 tracking-widest shadowYellow'>
              PICK{" "}
              {spreadData.spread.reduce(
                (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
                0
              )}{" "}
              CARDS
            </div>
            <p>{spreadData.description}</p>
          </span>
          {/* 編輯 */}
          {divining === 0 && (
            <Button
              action={() => {
                setEdit(true);
              }}
              value={"Edit"}
              type={"little"}
            />
          )}
          {/* 詢問AI */}
          {divining === 3 && (
            <div className='absolute top-0 right-0'>
              {showAI ? (
                <AskGPT
                  divinedData={divinedData}
                  setDivinedData={setDivinedData}
                  end={end}
                  setEnd={setEnd}
                  askAI={askAI}
                  setAskAI={setAskAI}
                  divining={divining}
                  dispatch={dispatch}
                />
              ) : (
                <Moon color={"#9F8761"} />
              )}
            </div>
          )}
        </div>
        {/* 開始選牌 */}
        {divining === 0 && (
          <div className='flex gap-3 mb-8'>
            <Button
              action={() => dispatch({ type: "start" })}
              value={"Start"}
              type={"tiny"}
            />
          </div>
        )}
        {/* 寫下問題 */}
        {divining !== 0 && (
          <input
            type='text'
            value={divinedData.question}
            onChange={(e) => {
              setDivinedData({ ...divinedData, question: e.target.value });
            }}
            className='bg-pink bg-opacity-20 p-2 w-[25%] tracking-wider placeholder:text-yellow mb-4'
            placeholder='請寫下你的問題'
          />
        )}
        {/* -----更換狀態----- */}
        {/* 預覽 */}
        {/* 選牌＆占卜 */}
        {divining === 0 && (
          <SpreadPlace
            divining={divining}
            spreadData={spreadData}
            divinedData={divinedData}
            tarot={tarot}
          />
        )}
        {/* 可編輯 */}
        {edit && (
          <div
            className='w-[100%] h-[700px] overflow-y-scroll p-16 bg-darkPink z-20 mx-auto fixed top-1/2 left-1/2 
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
          <SpreadPlace
            divining={divining}
            spreadData={spreadData}
            divinedData={divinedData}
            tarot={tarot}
          />
        )}
        {/* 選牌占卜 */}
        {divining === 1 && (
          <div>
            <SelectCard
              number={spreadData.spread.reduce(
                (acc: any, crr) => (crr !== 0 ? acc + 1 : acc),
                0
              )}
            />
            <Divine
              spreadData={spreadData}
              setSpreadData={setSpreadData}
              end={end}
              setEnd={setEnd}
              divinedData={divinedData}
              setDivinedData={setDivinedData}
              divining={divining}
              dispatch={dispatch}
              image={image}
              imgRef={imgRef}
              takeScreenshot={takeScreenshot}
            />
          </div>
        )}
        {/* 占卜 */}
        {divining === 3 && (
          <Divine
            spreadData={spreadData}
            setSpreadData={setSpreadData}
            end={end}
            setEnd={setEnd}
            divinedData={divinedData}
            setDivinedData={setDivinedData}
            divining={divining}
            dispatch={dispatch}
            image={image}
            imgRef={imgRef}
            takeScreenshot={takeScreenshot}
          />
        )}
      </div>
    </>
  );
}
export default Spread;
const card = (item, i, tarot, end) => {
  return (
    <div className='flex  justify-center w-[115px] h-[180px] ' key={i}>
      {item !== 0 && (
        <div
          className={`border rounded-lg w-[108px] h-[180px] cursor-pointer relative
    flex items-center justify-center flex-col  text-white z-1 gap-2 bg-slate-700`}
        >
          {item.card !== undefined ? (
            <Link to={`/card/${item.card}`}>
              <img
                src={tarot[item.card].img}
                alt={tarot[item.card].name}
                className={`${
                  item.reverse ? "" : "rotate-180"
                } w-[100%] h-[100%] absolute top-0 left-0 `}
              />
            </Link>
          ) : null}
          <div
            className={`w-[100%] h-[100%] absolute top-0 ${
              item.card !== undefined && end
                ? "opacity-0 hover:opacity-100"
                : "hover:opacity-100"
            }`}
          >
            <div className='bg-slate-800 opacity-60 w-[100%] h-[100%] rounded-lg'></div>
            <p className='absolute bottom-2 left-5 text-xs z-10'>
              {item.value}
            </p>
            <p className='absolute bottom-7 left-2 z-10'>{item.order}</p>
            {item.card !== undefined && (
              <Link to={`/card/${item.card}`}>
                <div className='absolute bottom-16 left-2 z-10 text-xs'>
                  {tarot[item.card].name}{" "}
                </div>
                {""}
                <div className='absolute bottom-12 left-2 z-10 text-xs'>
                  {item.reverse ? "正位" : "逆位"}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
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
export const SelectCard = ({ number }) => {
  const [cardArr, setCardArr] = useState(new Array(18).fill(false));
  return (
    <div className='flex flex-row w-[90%] justify-center relative mt-5'>
      {cardArr.map((card, index) => {
        return (
          <div
            key={index}
            className={`rounded-lg absolute top-0 w-[120px] cursor-pointer shadow-lg shadow-green shadow-opacity-60
            
            ${
              card
                ? "top-[-20px] left-0"
                : "hover:transform hover:-translate-x-[20px] hover:-translate-y-[20px] transition duration-300"
            }
             `}
            style={{ left: `${(index + 1) * 50}px` }}
            onClick={() => {
              const newCardArr = [...cardArr];
              newCardArr[index] = !newCardArr[index];
              setCardArr(newCardArr);
              const count = newCardArr.reduce(
                (acc, val) => (val ? acc + 1 : acc),
                0
              );
              if (count === number) {
                alert("可以占卜了");
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
const SpreadPlace = ({ divining, spreadData, divinedData, tarot }) => {
  let data;
  if (divining === 3) {
    data = divinedData;
  } else if (divining === 0) {
    data = spreadData;
  } else {
    return <></>;
  }

  return (
    <div
      className='flex flex-wrap justify-center max-w-screen-md border border-yellow z-1 
  mx-auto  border-opacity-50 mb-44'
    >
      {data.spread.map((item: any, i: number) => {
        return (
          <div
            className='flex justify-center box-border w-[119px] h-[93px] '
            key={i}
          >
            {item !== 0 && (
              <div
                className={` rounded-xl w-[117px] h-[186px] cursor-pointer relative box-border 
               flex items-center justify-center flex-col bg-slate-800 text-yellow z-0 gap-2 bg-opacity-80`}
              >
                {item.card !== undefined ? (
                  <Link to={`/card/${item.card}`}>
                    <img
                      src={tarot[item.card].img}
                      alt={tarot[item.card].name}
                      className={`${
                        item.reverse ? "" : "rotate-180"
                      } w-[100%] h-[100%] absolute top-0 left-0 `}
                    />
                  </Link>
                ) : (
                  <img
                    src={lightCard}
                    alt={"lightCard"}
                    className={` w-[100%] h-[100%] absolute top-0 left-0 `}
                  />
                )}
                <div
                  className={`w-[100%] h-[100%] absolute top-0 ${
                    item.card !== undefined
                      ? "hover:opacity-100"
                      : "hover:opacity-100"
                  }`}
                >
                  {item.card !== undefined && (
                    <Link to={`/card/${item.card}`}>
                      <div className='absolute bottom-16 left-2 z-10 text-xs'>
                        {tarot[item.card].name}{" "}
                      </div>
                      {""}
                      <div className='absolute bottom-12 left-2 z-10 text-xs'>
                        {item.reverse ? "正位" : "逆位"}
                      </div>
                    </Link>
                  )}
                  <div className='absolute bottom-3 left-[10px] bg-opacity-30 bg-yellow filter blur-sm w-[90%] h-40%'></div>
                  <p
                    className='absolute bottom-3 left-[10px]  
                     text-sm z-10 text-green w-[90%] shadowYellow tracking-widest'
                  >
                    {item.value}
                  </p>
                  <p
                    className='absolute top-7 left-3 z-10 font-sygma text-3xl w-[10%]
                     text-green shadowGreen text-center tracking-widest'
                  >
                    {item.order}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
