import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { DesignSpreadData, SpreadData, SpreadItem } from "../../../utils/type";
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
export type UseGetDesignHooks = {
  spreadData: SpreadData | null;
  setSpreadData: React.Dispatch<React.SetStateAction<SpreadData | null>>;
  divinedData: DesignSpreadData;
  setDivinedData: React.Dispatch<React.SetStateAction<DesignSpreadData>>;
  getDesign: () => Promise<void>;
  pickCard: number[];
  setPickCard: React.Dispatch<React.SetStateAction<number[]>>;
};
function useGetDesign(): UseGetDesignHooks {
  const { id } = useParams();
  const [spreadData, setSpreadData] = useState<SpreadData | null>(null);
  const [divinedData, setDivinedData] =
    useState<DesignSpreadData>(initialDivinedData);
  const [pickCard, setPickCard] = useState<number[]>([0, 0]);

  const getDesign = useCallback(async () => {
    const newData = id && (await firebase.getDesign(id));

    if (!newData || typeof newData === "string") return;
    if (newData) {
      setSpreadData(newData[0] as SpreadData);
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
          (acc: number, crr: number | SpreadItem) =>
            crr === 0 ? acc : acc + 1,
          0
        ),
      ]);
    }
  }, [id]);

  return {
    spreadData,
    setSpreadData,
    divinedData,
    setDivinedData,
    getDesign,
    pickCard,
    setPickCard,
  };
}
export default useGetDesign;
