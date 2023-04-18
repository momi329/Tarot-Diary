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
  const cardArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

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
    <div className='w-[80%] h-[100%] mx-auto'>
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
      <img width='300px' src={image} alt='ScreenShot' />
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
      {/* 編輯 */}
      {divining === 0 && (
        <>
          <button
            disabled={end}
            onClick={() => {
              setEdit(true);
            }}
          >
            Edit
          </button>
          <button onClick={() => dispatch({ type: "start" })}>點我選牌</button>
        </>
      )}
      {/* 詢問AI */}
      {divining === 3 && (
        <AskGPT
          divinedData={divinedData}
          end={end}
          setEnd={setEnd}
          askAI={askAI}
          setAskAI={setAskAI}
          divining={divining}
          dispatch={dispatch}
        />
      )}
      {/* 可編輯 */}
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
            imgRef={imgRef}
            takeScreenshot={takeScreenshot}
          />
        </div>
      )}
      {/* 結果 */}
      <div
        ref={imgRef}
        className='flex flex-wrap w-[1200px] border border-gray-50 z-1 '
      >
        {divining === 3 &&
          divinedData.spread.map((item: any, i: number) => {
            return (
              <div className='flex  justify-center w-[115px] h-[90px] ' key={i}>
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
          })}{" "}
      </div>
      {/* 預覽 */}
      <div className='flex flex-wrap w-[1200px] border border-gray-50 z-1 '>
        {divining === 0 &&
          spreadData.spread.map((item: any, i: number) => {
            return (
              <div className='flex  justify-center w-[115px] h-[90px] ' key={i}>
                {item !== 0 && (
                  <div
                    className={`border rounded-lg w-[108px] h-[180px] cursor-pointer relative
                  flex items-center justify-center flex-col  text-white z-1 gap-2 bg-slate-700`}
                  >
                    <div
                      className={`w-[100%] h-[100%] absolute top-0 ${
                        item.card !== undefined
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
export const selectCard = (cardArr) => {
  return (
    <div className='flex flex-row '>
      {cardArr.map((card) => {
        return (
          <div
            key={card}
            className='bg-slate-600 border border-slate-100 
              w-[80px] h-[100px] cursor-pointer transition duration-150 ease-out hover:ease-in'
          ></div>
        );
      })}
    </div>
  );
};
