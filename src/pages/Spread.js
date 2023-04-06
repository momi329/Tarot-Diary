import { useParams } from "react-router-dom";
import app from "../Firebaseapp";
import db from "../Firebasedb";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

function Spread() {
  const [spreadData, setSpreadData] = useState([]);
  const { id } = useParams();
  async function getDesign() {
    console.log("getDesign");
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const newData = data.filter((i) => i.spreadId === id);
    console.log(newData[0]);
    setSpreadData(newData[0]);
  }
  useEffect(() => {
    getDesign();
  }, [id]);

  if (spreadData.length === 0 || spreadData === undefined) {
    console.log("spreadData", spreadData);
    return;
  } else {
    console.log("spreadData", spreadData);
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
      <div className='flex flex-wrap w-[1010px] border border-gray-50 z-1'>
        {spreadData.spread.map((item, i) => {
          return (
            <div className='flex  justify-center w-[100px] h-[80px] ' key={i}>
              {item !== 0 && (
                <div
                  className={`border rounded-lg w-[90px] h-[150px] cursor-pointer relative
                  flex items-center justify-center flex-col bg-slate-800 text-white z-10 gap-2`}
                >
                  <div>
                    <p>{item.value}</p>
                    <p>{item.order}</p>
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
