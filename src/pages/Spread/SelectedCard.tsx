import React, { useState } from "react";
import lightCard from "../../images/card-light.png";

function SelectedCard({ setPickCard, pickCard }) {
  const [cardArr, setCardArr] = useState(new Array(24).fill(false));

  return (
    <div className='flex flex-row w-[90%] h-[350px] justify-center relative mt-5 '>
      {cardArr.map((card, index) => {
        return (
          <div
            key={index}
            className={`rounded-lg absolute top-0 w-[120px] cursor-pointer shadow-lg shadow-green shadow-opacity-60 
        origin-center rotate-[${index * 2 - 22}deg] translate-x-${
              index * 50 - 600
            }
        ${
          card
            ? "top-[-40px] "
            : " hover:top-[-20px] hover:transform hover:-translate-x-[20px] hover:-translate-y-[20px] transition duration-300"
        }
         `}
            style={{
              // left: `${(index - 1) * 40}px`,
              transform: `rotate(${index * 2 - 22}deg) translateX(${
                index * 40 - 440
              }px)`,
              transformOrigin: `center bottom`,
            }}
            onClick={() => {
              const newCardArr = [...cardArr];
              newCardArr[index] = !newCardArr[index];
              const count = newCardArr.reduce(
                (acc, val) => (val ? acc + 1 : acc),
                0
              );
              const newPickCard = [...pickCard];
              if (count <= pickCard[1] && pickCard[0] <= pickCard[1]) {
                newPickCard[0] = count;
                setPickCard(newPickCard);
                setCardArr(newCardArr);
              }
            }}
          >
            <img src={lightCard} alt='card' className='w-[100%]' />
          </div>
        );
      })}
    </div>
  );
}
export default SelectedCard;
