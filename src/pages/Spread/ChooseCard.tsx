import { useEffect } from "react";
import Button from "../../components/Button";
import SelectedCard from "./SelectedCard";
export default function ChooseCard({
  pickCard,
  setPickCard,
  handleClickDivine,
  divinedData,
}) {
  useEffect(() => console.log(pickCard, "pickcard in lower area"), [pickCard]);

  return (
    <div className="flex flex-col gap-6 justify-center mb-18 mt-5 items-center">
      <SelectedCard pickCard={pickCard} setPickCard={setPickCard} />
      <span className="flex flex-row items-end">
        <span className="text-5xl text-pink font-NT shadowPink tracking-widest">
          {pickCard[0] + ""}
        </span>
        <p className="text-3xl text-pink font-NT shadowPink tracking-widest mb-1">
          {`/` + pickCard[1]}
        </p>
      </span>
      <div className="w-[300px] group">
        <div
          className={`${
            pickCard[0] !== pickCard[1] || divinedData.question === ""
              ? "group-hover:opacity-100"
              : ""
          }  w-[60%] mb-1 mx-auto
opacity-0 bg-black/20 text-yellow text-notoSansJP tracking-widest text-sm p-2 rounded-xl text-center`}
        >
          {divinedData.question === ""
            ? "!請填寫想問的問題"
            : pickCard[0] !== pickCard[1] && "！請抽到指定張數"}
        </div>
        <Button
          action={handleClickDivine}
          disabled={pickCard[0] !== pickCard[1] || divinedData.question === ""}
          type={"big"}
          value={"Divine"}
        />
      </div>
      <div className="w-[100%] h-16"></div>
    </div>
  );
}
