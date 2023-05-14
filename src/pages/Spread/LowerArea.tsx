import { ActionEnum, SpreadItem } from "../../utils/type";

import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AskAndNote from "../../components/AskAndNote";
import Button from "../../components/Button";
import UnderlineInput from "../../components/UnderlineInput";
import { AuthContext } from "../../context/authContext";
import cards from "../../tarotcard/tarot-images";
import { getRandomBool, getRandomCards } from "../../utils/function";
import { DesignSpreadData } from "../../utils/type";
import ChooseCard from "./ChooseCard";
import { SpreadPlace } from "./SpreadPlace";
import useGetDesign from "./hooks/useGetDesign";

type DispatchAction = {
  type: ActionEnum;
};

type LowerAreaProps = {
  type: ActionEnum;
  dispatch: (action: DispatchAction) => void;
  data: DesignSpreadData;
};

function LowerArea({ type, dispatch }: LowerAreaProps) {
  const { isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    spreadData,
    divinedData,
    setDivinedData,
    pickCard,
    setPickCard,
    getDesign,
  } = useGetDesign();
  useEffect(() => {
    // TODO: Ask why we need this?
    getDesign();
  }, []);
  const handleClickDivine = async () => {
    if (!spreadData) return;
    const number: number = spreadData.spread.filter(
      (item) => item !== 0
    ).length;
    const randomCard = getRandomCards(number);
    const randomReverse = getRandomBool(number);
    const modifiedData = spreadData?.spread.reduce(
      (acc: (number | SpreadItem)[], item: number | SpreadItem) => {
        if (typeof item === "number") {
          acc.push(0);
        } else {
          const card = randomCard[item.order - 1];
          const reverse = randomReverse[item.order - 1];
          const newItem = { ...item, card, reverse };
          acc.push(newItem);
        }
        return acc;
      },
      []
    );
    const newData = { ...divinedData, spread: modifiedData };
    setDivinedData(newData);
    dispatch({ type: ActionEnum.End });
  };
  return (
    <>
      {type === "preview" && (
        <div className="flex gap-3 mb-8 ml-8 w-[280px]">
          <Button
            action={() => {
              if (!isLogin) {
                navigate(`/signin`);
              }
              dispatch({ type: ActionEnum.Start });
            }}
            value={"Start"}
            type={"big"}
          />
        </div>
      )}
      {(type === ActionEnum.Start || type === ActionEnum.End) && (
        <div className="w-[25%] mb-4  ml-8">
          <UnderlineInput
            name="請寫下你的問題："
            value={divinedData?.question || ""}
            inputType={"text"}
            action={(e) =>
              setDivinedData({
                ...divinedData,
                question: e.target.value,
              })
            }
            placeholder="Write Your Question"
            disabled={type === ActionEnum.End}
          />
        </div>
      )}
      {type === ActionEnum.Start && (
        <ChooseCard
          handleClickDivine={handleClickDivine}
          pickCard={pickCard}
          setPickCard={setPickCard}
          divinedData={divinedData}
        />
      )}
      {(type === ActionEnum.End || type === ActionEnum.Preview) && (
        <SpreadPlace
          type={
            (type === "end" && divinedData) ||
            (type === "preview" && spreadData)
          }
          tarot={cards.cards}
          size={"large"}
        />
      )}
      {type === ActionEnum.End && (
        <>
          <div className=" w-[100%] px-16 group relative pb-16">
            <AskAndNote
              divinedData={divinedData}
              setDivinedData={setDivinedData}
              type={type}
              dispatch={dispatch}
            />
          </div>
        </>
      )}
    </>
  );
}

export default LowerArea;
