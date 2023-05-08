import { useState } from "react";
import lightCard from "../../images/card-light.png";

const SelectCardHomePage = ({ number }) => {
  const [cardArr, setCardArr] = useState(new Array(12).fill(false));

  return (
    <>
      <div className="flex flex-row h-[420px] w-[1100px] justify-center items-center relative mt-5 ">
        {cardArr.map((card, index) => {
          return (
            <div
              key={index}
              className={`rounded-lg absolute top-0 w-[200px] cursor-pointer shadow-lg shadow-green shadow-opacity-60 
            ${
              card
                ? "top-[-40px] "
                : " hover:top-[-20px] hover:transform  hover:-translate-y-[20px] transition duration-300"
            }
            animate-[slideWithIndex(${index})] `}
              style={{
                left: `${index * 80}px`,
              }}
              onClick={() => {
                const newCardArr = [...cardArr];
                newCardArr.fill(false);
                newCardArr[index] = !newCardArr[index];
                setCardArr(newCardArr);
              }}
            >
              <img src={lightCard} alt="card" className="w-[100%]" />
            </div>
          );
        })}
      </div>
    </>
  );
};
export default SelectCardHomePage;
