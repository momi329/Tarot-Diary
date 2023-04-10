import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Divine from "../components/Divine";
import cards from "../tarotcard/tarot-images";
import { Link } from "react-router-dom";
import firebase from "../utils/firebase";
import Draggable from "../components/Draggable";
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
const initialSpread: SpreadData = {
  userUID: "",
  title: "",
  image: "",
  spread: [
    0,
    { order: 0, disabled: true, value: "", name: "", card: 0, reverse: true },
  ],
  description: "",
  spreadId: "",
};
export interface DraggableProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  spreadData: SpreadData;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData>>;
}
function Spread() {
  const [spreadData, setSpreadData] = useState<SpreadData>(initialSpread);
  const { id } = useParams();
  const tarot = cards.cards;
  const [end, setEnd] = useState<boolean>(false);
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    async function getDesign(id: string): Promise<void> {
      const newData = await firebase.getDesign(id);
      setSpreadData(newData[0]);
    }
    if (id) {
      getDesign(id);
    }
  }, [id]);
  useEffect(() => {
    async function getDesign(id: string): Promise<void> {
      const newData = await firebase.getDesign(id);
      setSpreadData(newData[0]);
    }
    if (id) {
      getDesign(id);
    }
  }, [edit]);
  if (spreadData === undefined) {
    return;
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
      <Divine
        spreadData={spreadData}
        setSpreadData={setSpreadData}
        end={end}
        setEnd={setEnd}
      />
      <button
        onClick={() => {
          setEdit(true);
        }}
      >
        Edit
      </button>
      {edit && (
        <div
          className=' w-[1200px] h-[700px] overflow-y-scroll p-16 bg-slate-400 z-20 mx-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
        '
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
        {spreadData.spread.map((item: any, i: number) => {
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
        })}
      </div>
    </div>
  );
}
export default Spread;
