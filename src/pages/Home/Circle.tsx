import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { AuthContext } from "../../context/authContext";
import { getRandomBool, getRandomCards } from "../../utils/function";
import SelectCardHomePage from "./SelectCardHomePage";

import pinkFlower1 from "../../images/pinkflower1.jpeg";
type CircleProps = {
  scrollRef4: React.MutableRefObject<HTMLDivElement | null>;
  animated: boolean[];
};
export default function Circle({ scrollRef4, animated }: CircleProps) {
  const { isLogin, setOpenSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <>
      <div
        ref={scrollRef4}
        className="relative min-h-[1000px] flex flex-col w-screen justify-center items-center overflow-hidden"
      >
        <div
          className="sm:w-[1300px] sm:h-[1300px]
          w-[2300px] h-[2300px] rounded-t-full  bg-black absolute  top-0
          bg-clip-content  flex justify-center items-center  overflow-hidden"
        >
          <img
            src={pinkFlower1}
            alt="pinkflower1"
            className="sm:w-[600px] sm:right-[100px]  opacity-60  rounded-3xl transform  w-[900px] absolute right-[300px] 
          top-[-100px] z-[2] rotate-[-10deg] blur-sm hover:blur-none downThenUp transition duration-700 ease-in-out"
          />
        </div>
        <p
          className={` tiny:text-6xl tiny:mt-0 tinyL:text-7xl sm:leading-normal tinyL:mt-20 font-sygma text-[120px] text-white shadowWhite z-[2] text-center 
        leading-snug tracking-wider mt-36 ${
          animated[3] ? "opacity-0 animate-[slideUp_1s_forwards_800ms]" : ""
        }`}
        >
          PICK YOUR <br></br> DAILY <br></br> TAROT
        </p>
        <p
          className={`sm:text-xl sm:mb-7 font-notoSansJP tracking-widest text-2xl text-pink z-[2] mb-24  ${
            animated[3] ? "opacity-0 animate-[slideUp_1s_forwards_1200ms]" : ""
          }`}
        >
          靜心冥想，選擇一張牌...
        </p>
        <div
          className={`z-[3] w-100% flex flex-col justify-center items-center ${
            animated[3] ? "opacity-0 animate-[slideUp_1s_forwards_1400ms]" : ""
          }`}
        >
          <SelectCardHomePage />
          <div className="w-[250px]">
            <Button
              type={"big"}
              action={async () => {
                if (isLogin) {
                  const randomCard = await getRandomCards(1);
                  const randomReverse = await getRandomBool(1);
                  const divinedData = {
                    userUID: "all",
                    title: "每日占卜",
                    spread: [
                      {
                        card: randomCard,
                        disabled: true,
                        order: 1,
                        reverse: randomReverse,
                      },
                    ],
                    description:
                      "每天抽一張塔羅牌，可以提供一些指導和啟示，幫助我們更好地應對日常生活中的挑戰。每張塔羅牌都有自己獨特的含義和象徵意義。在占卜過程中，我們通常會集中注意力，深入思考每一張牌的意義，並將其應用到我們當前的情況中。通過這種方式，我們可以從塔羅牌中獲得洞察力和指導，並更好地了解自己和周圍的世界。",
                    spreadId: "common-1",
                    question: "今日運勢",
                    secret: false,
                    image:
                      "https://images.unsplash.com/photo-1569879742961-60334a19ace5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MzE2MDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODI4Mjk1NDk&ixlib=rb-4.0.3&q=80&w=1080",
                  };
                  const data = JSON.stringify(divinedData);
                  localStorage.setItem("myResult", data);
                  navigate("/spread/common-1");
                } else {
                  setOpenSignIn(true);
                }
              }}
              value={isLogin ? "Start" : "Log in"}
            />
          </div>
        </div>
      </div>
      <div className="w-screen h-[300px] z-[1] relative">
        <div
          className="blur-lg  w-screen h-80 bg-gradient-to-b
          from-black to-green absolute top-[-160px] z-1"
        ></div>
      </div>
    </>
  );
}
