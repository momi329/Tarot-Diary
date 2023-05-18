import { useEffect, useState } from "react";
import lightCard from "../../images/card-light.png";

const SelectCardHomePage = () => {
  const [cardArr, setCardArr] = useState<boolean[] | null>(null);
  const handleResize = () => {
    if (window.innerWidth < 400) {
      setCardArr(new Array(5).fill(false));
    } else if (window.innerWidth < 1200) {
      setCardArr(new Array(6).fill(false));
    } else if (window.innerWidth < 1920) {
      setCardArr(new Array(12).fill(false));
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(() => {
    handleResize();
  }, []);
  return (
    <>
      <div
        className="sm:mb-10 tinyL:w-[500px] tiny:w-[350px] tinyL:h-[300px] tiny:h-[250px]  
      flex flex-row h-[420px] w-[1100px] justify-center items-center relative mt-5 "
      >
        {cardArr?.map((card, index) => {
          return (
            <div
              key={index}
              className={`sm:min-w-[140px] sm:w-[140px]  mx-auto z-0
              rounded-lg  min-w-[180px] w-[180px] cursor-pointer shadow-lg shadow-green shadow-opacity-60 
              ${
                card
                  ? " transform  -translate-y-[20px]"
                  : " hover:top-[-20px] hover:transform  hover:-translate-y-[20px] transition duration-300"
              }
              ${index > 0 ? "-ml-24 tiny:-ml-32 tinyL:-ml-24" : " "}
            animate-[slideWithIndex(${index})] `}
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
