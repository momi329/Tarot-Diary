import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";

import useGetDesign from "./hooks/useGetDesign";
import SpreadInfo from "./SpreadInfo";

import { ActionEnum } from "../../utils/type";
import LowerArea from "./LowerArea";
import { reducer } from "./reducer/reducer";

function Spread() {
  const { id } = useParams();

  const [type, dispatch] = useReducer(reducer, ActionEnum.Preview);
  const [edit, setEdit] = useState<boolean>(false);
  const { spreadData, setSpreadData, divinedData, setDivinedData, getDesign } =
    useGetDesign();

  useEffect(() => {
    const divine = localStorage.getItem("myResult");
    if (divine) {
      const data = JSON.parse(divine);
      setSpreadData(data);
      setDivinedData(data);
      dispatch({ type: ActionEnum.End });
      localStorage.removeItem("myResult");
    } else {
      id && getDesign();
    }
  }, [id, edit]);

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
            type={type}
            setEdit={setEdit}
            edit={edit}
          />
          <LowerArea type={type} dispatch={dispatch} data={divinedData} />
        </div>
      </div>
    </>
  );
}
export default Spread;
