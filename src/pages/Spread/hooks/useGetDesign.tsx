import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  SpreadData,
  DesignSpreadData,
  UseGetDesignHooks,
} from "../../../utils/type";
import firebase from "../../../utils/firebase";
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

function useGetDesign(): UseGetDesignHooks {
  const { id } = useParams();
  const [spreadData, setSpreadData] = useState<SpreadData | null>(null);
  const [divinedData, setDivinedData] =
    useState<DesignSpreadData>(initialDivinedData);
  const [pickCard, setPickCard] = useState<Number[]>([0, 0]);

  const getDesign = useCallback(async () => {
    const newData = id && (await firebase.getDesign(id));
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
