import { useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import Divine from "../components/Divine";
import cards from "../tarotcard/tarot-images";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import Draggable from "../components/Draggable";
import AskGPT from "../AksGPT";

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
  description: string;
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
}
function Spread() {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const [spreadData, setSpreadData] = useState<SpreadData | undefined>(
    undefined
  );
  const [divinedData, setDivinedData] =
    useState<DesignSpreadData>(initialDivinedData);
  const { id } = useParams();
  const tarot = cards.cards;
  const [end, setEnd] = useState<boolean>(false);
  const [askAI, setAskAI] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  //新增common牌陣
  // useEffect(() => {
  //   const data = {
  //     userUID: "all",
  //     title: "Three Card Spread",
  //     discription:
  //       "時間之流占卜法：簡單三張牌，意義大無窮/n使用時機：這種牌陣專用於問卜一件事情或一個方面隨時間變化而出現的情況，比如健康狀況、感情發展、職位升遷等等/n這些問題都有一個共同的特點，就是整個過程已經開始，並還將繼續，問卜需要了解的是一個完整的過程/n在這個過程的各個階段之間存在着內在的聯繫。第一張牌代表過去，表示已經發生過的事情；第二張牌描述的是當前的情況，也是一種純客觀的反映；第三張牌表示如果放任事情發展，不發生任何作爲，事情將會出現什麼結果，是一種地未知的判斷",
  //     spreadID: "common-3",
  //     spread: [
  //       { disabled: true, order: 1, value: "Past" },
  //       { disabled: true, order: 2, value: "Now" },
  //       { disabled: true, order: 3, value: "Future" },
  //     ],
  //     image: "",
  //   };
  //   async function addCommonSpread(data) {
  //     await setDoc(doc(db, "spreads", "common-3"), data);
  //   }
  //   addCommonSpread(data);
  // }, []);

  useEffect(() => {
    async function getDesign(id: string): Promise<void> {
      const newData = await firebase.getDesign(id);
      if (newData) {
        setSpreadData(newData[0]);
      }
    }
    if (id) {
      getDesign(id);
    }
  }, [id, edit]);
  // useEffect(() => {
  //   async function getDesign(id: string): Promise<void> {
  //     const newData = await firebase.getDesign(id);
  //     setSpreadData(newData[0]);
  //     setDivinedData(newData[0]);
  //   }
  //   if (id) {
  //     getDesign(id);
  //   }
  // }, [edit]);

  if (spreadData === undefined) {
    return;
  }
  if (spreadData.userUID === "all") {
    return (
      <div
        key='divined'
        className='w-[100%] h-[100%] mx-auto flex justify-center flex-col'
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
          <input
            type='text'
            value={divinedData.question}
            onChange={(e) => {
              setDivinedData({ ...divinedData, question: e.target.value });
            }}
            disabled={end}
            placeholder='請寫下你的問題'
          />
        </div>
        <div className='flex flex-row'>
          {end
            ? divinedData.spread.map((item, index) => {
                return <div key={index}> {divine(item, index, tarot)} </div>;
              })
            : spreadData.spread.map((item, index) => {
                return (
                  item !== 0 && (
                    <div key={index}>{card(item, index, tarot, end)}</div>
                  )
                );
              })}
        </div>
        <Divine
          spreadData={spreadData}
          setSpreadData={setSpreadData}
          end={end}
          setEnd={setEnd}
          divinedData={divinedData}
          setDivinedData={setDivinedData}
        />
        <AskGPT
          divinedData={divinedData}
          end={end}
          setEnd={setEnd}
          askAI={askAI}
          setAskAI={setAskAI}
        />
      </div>
    );
  }
  return (
    <div className='w-[100%] h-[100%] mx-auto'>
      <div>Design Your Spread!</div>
      <div
        style={{ backgroundImage: `url(${spreadData.image})` }}
        className='w-[1280px] h-[340px] bg-cover bg-center'
      ></div>
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
      <input
        type='text'
        value={divinedData.question}
        onChange={(e) => {
          setDivinedData({ ...divinedData, question: e.target.value });
        }}
        disabled={end}
        placeholder='請寫下你的問題'
      />
      <Divine
        spreadData={spreadData}
        setSpreadData={setSpreadData}
        end={end}
        setEnd={setEnd}
        divinedData={divinedData}
        setDivinedData={setDivinedData}
      />
      <button
        disabled={end}
        onClick={() => {
          setEdit(true);
        }}
      >
        Edit
      </button>
      <AskGPT
        divinedData={divinedData}
        end={end}
        setEnd={setEnd}
        askAI={askAI}
        setAskAI={setAskAI}
      />
      {edit && (
        <div
          className=' w-[1200px] h-[700px] overflow-y-scroll p-16 bg-slate-400 z-20 mx-auto fixed top-1/2 left-1/2 
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

      <div className='flex flex-wrap w-[1200px] border border-gray-50 z-1 '>
        {end
          ? divinedData.spread.map((item: any, i: number) => {
              return (
                <div
                  className='flex  justify-center w-[115px] h-[90px] '
                  key={i}
                >
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
                        <p className='absolute bottom-7 left-2 z-10'>
                          {item.order}
                        </p>
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
            })
          : spreadData.spread.map((item: any, i: number) => {
              return (
                <div
                  className='flex  justify-center w-[115px] h-[90px] '
                  key={i}
                >
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
                        <p className='absolute bottom-7 left-2 z-10'>
                          {item.order}
                        </p>
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
            })}
      </div>
    </div>
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
const divine = (item, i, tarot) => {
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
