import { useParams } from "react-router-dom";
import app from "../Firebaseapp";
import db from "../Firebasedb";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import Divine from "../components/Divine";
import cards from "../tarotcard/tarot-images";
import { Link } from "react-router-dom";
function Spread() {
  const [spreadData, setSpreadData] = useState([]);
  const { id } = useParams();
  const tarot = cards.cards;
  const [end, setEnd] = useState(false);
  async function getDesign() {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const newData = data.filter((i) => i.spreadId === id);
    setSpreadData(newData[0]);
  }
  useEffect(() => {
    getDesign();
  }, [id]);

  if (spreadData.length === 0 || spreadData === undefined) {
    return;
  }

  return (
    <div className=''>
      <div>Design Your Spread!</div>
      <div
        style={{ backgroundImage: `url(${spreadData.image})` }}
        className='w-[1280px] h-[340px] bg-cover bg-center'
      ></div>
      <h1>{spreadData.title}</h1>
      <p>{spreadData.discription}</p>
      <h1>
        PICK{" "}
        {spreadData.spread.reduce((acc, crr) => (crr !== 0 ? acc + 1 : acc), 0)}{" "}
        CARDS
      </h1>
      <Divine
        spreadData={spreadData}
        setSpreadData={setSpreadData}
        end={end}
        setEnd={setEnd}
      />
      <div className='flex flex-wrap w-[1200px] border border-gray-50 z-1'>
        {spreadData.spread.map((item, i) => {
          return (
            <div className='flex  justify-center w-[115px] h-[90px] ' key={i}>
              {item !== 0 && (
                <div
                  className={`border rounded-lg w-[108px] h-[180px] cursor-pointer relative
                  flex items-center justify-center flex-col  text-white z-10 gap-2 bg-slate-700`}
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
                        <p className='absolute bottom-14 left-2 z-10 text-xs'>
                          {tarot[item.card].name}{" "}
                          {tarot[item.card].reverse ? "正位" : "逆位"}
                        </p>
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
