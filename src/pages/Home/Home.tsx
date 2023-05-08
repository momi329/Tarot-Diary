import pinkFlower1 from "../../images/pinkflower1.jpeg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Moon from "../../images/Moon";
import { useContext, useEffect, useState } from "react";
import Button from "../../components/Button";
import { getRandomBool, getRandomCards } from "../Spread/Divine";
import Footer from "../../components/Footer";
import Star from "../../images/Star";
import React, { useRef } from "react";
import cards from "../../tarotcard/tarot-images";
import SelectCardHomePage from "./SelectCardHomePage";
import { AuthContext } from "../../context/authContext";
import DesignVideo from "../../images/design.mp4";
import DivineVideo from "../../images/divine.mp4";
import { SpreadPlace } from "../Spread/SpreadPlace";
import SpreadPreview from "../../components/SpreadPreview";
import Member from "../Member";
const tarot = cards.cards;
function Home() {
  const navigate = useNavigate();
  const { isLogin, spreads, openSignIn, setOpenSignIn } =
    useContext(AuthContext);
  const [showFourthParagraph, setShowFourthParagraph] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowFourthParagraph(true);
    }, 2000);
  }, []);
  const [animated, setAnimated] = useState([false, false, false, false, false]);
  const scrollRef1 = useRef<HTMLDivElement | null>(null);
  const scrollRef2 = useRef<HTMLDivElement | null>(null);
  const scrollRef3 = useRef<HTMLDivElement | null>(null);
  const scrollRef4 = useRef<HTMLDivElement | null>(null);
  const scrollRef5 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleScroll() {
      if (
        !scrollRef1.current ||
        !scrollRef2.current ||
        !scrollRef3.current ||
        !scrollRef4.current ||
        !scrollRef5.current
      )
        return;
      const inToView1 = scrollRef1.current.getBoundingClientRect();
      const inToView2 = scrollRef2.current.getBoundingClientRect();
      const inToView3 = scrollRef3.current.getBoundingClientRect();
      const inToView4 = scrollRef4.current.getBoundingClientRect();
      const inToView5 = scrollRef5.current.getBoundingClientRect();

      const windowHeight = window.innerHeight;
      if (
        scrollRef1.current &&
        inToView1.top < windowHeight &&
        inToView2.top > windowHeight
      ) {
        const newAnimated = [...animated];
        newAnimated[0] = true;
        setAnimated(newAnimated);
      } else if (
        scrollRef2.current &&
        inToView2.top < windowHeight &&
        inToView3.top > windowHeight
      ) {
        const newAnimated = [...animated];
        newAnimated[1] = true;
        setAnimated(newAnimated);
      } else if (
        scrollRef3.current &&
        inToView3.top < windowHeight &&
        inToView4.top > windowHeight
      ) {
        const newAnimated = [...animated];
        newAnimated[2] = true;
        setAnimated(newAnimated);
      } else if (
        scrollRef4.current &&
        inToView4.top < windowHeight &&
        inToView5.top > windowHeight
      ) {
        const newAnimated = [...animated];
        newAnimated[3] = true;
        setAnimated(newAnimated);
      } else if (scrollRef5.current && inToView5.top < windowHeight) {
        const newAnimated = [...animated];
        newAnimated[4] = true;
        setAnimated(newAnimated);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scroll() {
    const scrollNode: HTMLDivElement | null = scrollRef1.current;
    if (scrollNode) {
      scrollNode.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  function wheelHandler(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;
    const scrollLeft = element.scrollLeft;
    const deltaY = event.deltaY;
    if (deltaY > 0 && scrollLeft < scrollWidth - clientWidth) {
      const deltaScroll = Math.min(
        deltaY,
        scrollWidth - clientWidth - scrollLeft
      );
      element.scrollLeft += deltaScroll;
    } else if (deltaY < 0 && scrollLeft > 0) {
      const deltaScroll = Math.max(deltaY, -scrollLeft);
      element.scrollLeft += deltaScroll;
    }
  }
  return (
    <>
      {openSignIn && (
        <div className="w-screen h-screen fixed z-50">
          <div
            className={`w-0 opacity-0 h-screen fixed transition bg-black/90 duration-700 ease-in-out ${
              openSignIn ? "w-screen opacity-100" : ""
            }`}
          />
          <div
            className="relative left-[95%] top-[5%] cursor-pointer"
            onClick={() => setOpenSignIn(false)}
          >
            <div className="absolute top-0 w-10 h-[1px] bg-white rotate-[-45deg]" />
            <div className="absolute top-0 w-10 h-[1px] bg-white rotate-[45deg]" />
          </div>
          <div className="w-full mx-auto mt-20 fixed z-[51]">
            <Member />
          </div>
        </div>
      )}
      <div>
        {/* part1 */}
        <div
          className="h-[880px] overflow-hidden bg-black  cursor-auto
       w-screen  relative bg-clip-content  flex justify-center items-center"
        >
          <img
            src={pinkFlower1}
            alt="pinkflower1"
            className="opacity-60  rounded-3xl transform  w-[900px] absolute left-[-30px] 
          top-[-150px] z-[2] rotate-[10deg] blur-sm hover:blur-none transition duration-700 ease-in-out upanddown"
          />
          <img
            src={pinkFlower1}
            alt="pinkflower1"
            className="opacity-60  rounded-3xl transform  w-[750px] absolute right-[-30px] 
          top-[100px] z-[2] rotate-[-40deg] blur-sm hover:blur-none transition duration-700 ease-in-out tracking-[0.02em] downThenUp"
          />
          <p
            className="capitalize font-sygma text-9xl text-white z-[3]  text-start
           leading-normal mb-14  opacity-90"
          >
            <p className=" animate-[slideIn_2s_forwards_500ms] opacity-0">
              PICK YOUR CARD
            </p>

            <div className="flex flex-row gap-4 items-center shadowWhite animate-[slideIn_2s_forwards_1200ms] opacity-0">
              TAROT&LIFE
              <div className="h-[1px] w-1/3 flex-grow bg-white mb-[10px] opacity-80"></div>
            </div>
            <div className="flex flex-row gap-4 items-center shadowWhite">
              <span className="animate-[slideIn_1s_forwards_1500ms] opacity-0">
                TAROT
              </span>
              <div className="h-[1px] w-[20px] flex-grow bg-white mb-[10px] animate-[slideIn_1s_forwards_1500ms] opacity-0"></div>
              <span className="text-end ml-auto animate-[slideIn_1s_forwards_1500ms] opacity-0">
                DIARY
              </span>
            </div>
            {showFourthParagraph && (
              <p
                className="absolute text-pink font-maintelas text-[180px] top-[28%] right-[18%] 
              rotate-[-15deg] font-thin animate-fadeInAnimate "
              >
                Life
              </p>
            )}
          </p>
          <div
            className="w-28 h-28 rounded-full  border-[1px] border-white bottom-[70px] left-[100px] absolute cursor-pointer
        font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2] animate-pulse animate-fadeInAnimate opacity-0"
            onClick={scroll}
          >
            Scroll
          </div>
          <p
            className="underline underline-offset-2 text-2xl tracking-widest flex flex-row gap-1 cursor-pointer
           text-white z-[2] bottom-[100px] right-[100px] absolute font-NT shadowWhite"
            onClick={() => (isLogin ? "" : setOpenSignIn(true))}
          >
            Log In To Start{" "}
            <MdKeyboardArrowRight className="underline underline-offset-2 mt-1" />
          </p>
        </div>
      </div>
      {/* part2 */}
      <div className=" w-screen  relative bg-clip-content  flex justify-center items-center">
        <div className="min-h-[2050px] w-[70%] mt-36">
          <div ref={scrollRef1}>
            <div
              className={`text-yellow font-NT text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2 ${
                animated[0]
                  ? "opacity-0 animate-[slideUp_1s_forwards_300ms]"
                  : ""
              } `}
            >
              <Moon color={"#E18EA5"} width={"56px"} height={"62px"} />
              <p>ABOUT US</p>
            </div>
            <div>
              <p
                className={`ml-20 text-pink text-2xl tracking-widest font-normal mt-20 
              ${
                animated[0]
                  ? "opacity-0 animate-[slideUp_1s_forwards_600ms]"
                  : ""
              }`}
              >
                設計X紀錄X占卜
              </p>
              <p
                className={`ml-20 text-5xl  text-pink tracking-widest mt-2 font-normal leading-normal
              ${
                animated[0]
                  ? "opacity-0 animate-[slideUp_1s_forwards_900ms]"
                  : ""
              }`}
              >
                讓所有<br></br>塔羅學習者都愛上
              </p>
              <p
                className={`leading-loose ml-20 text-yellow font-notoSansJP text-base tracking-wider  mt-16 w-[60%] 
              ${
                animated[0]
                  ? "opacity-0 animate-[slideUp_1s_forwards_1300ms]"
                  : ""
              }`}
              >
                占卜後留下紀錄，方便你在現實生活中驗證！<br></br>{" "}
                但是好麻煩喔？拍照都會反光，牌陣的意義也記不起來...<br></br>
                你是否想要系統性紀錄抽牌結果？<br></br>
                我們提供線上紀錄的管道。<br></br>
                結合占卜x抽牌x設計，讓你學習塔羅的路途上有系統性地記錄方便回顧！
                <br></br>
                也方便你隨時隨地可以抽牌！
              </p>
            </div>
          </div>

          <div
            className="flex items-end flex-row relative mt-[200px] gap-[8%]"
            ref={scrollRef2}
          >
            <div className="flex flex-col w-[40%] mr-10">
              <p
                className={`ml- 20 text-6xl  text-pink tracking-widest mt-2 font-normal leading-normal text-end font-NT shadowPink
              ${
                animated[1]
                  ? "opacity-0 animate-[slideUp_1s_forwards_400ms]"
                  : ""
              }`}
              >
                Enjoy & Design
              </p>
              <p
                className={`leading-loose ml-20 text-yellow font-notoSansJP
                text-base  tracking-wider  mt-10  text-end ${
                  animated[1]
                    ? "opacity-0 animate-[slideUp_1s_forwards_800ms]"
                    : ""
                }`}
              >
                一般的牌陣是不是無法滿足你呢？<br></br>
                客製化的設計讓你可以隨時問自己想問的<br></br> 更能客製化需求喔！
              </p>
            </div>
            <div className="w-[45%]">
              <video
                width="100%"
                loop
                playsInline
                autoPlay
                muted
                className={` hover:scale-110  ${
                  animated[1]
                    ? "opacity-0 animate-[slideUp_1s_forwards_1100ms]"
                    : ""
                }`}
              >
                <source src={DesignVideo} type="video/mp4" />
              </video>
            </div>
          </div>
          <div
            className="flex items-end flex-row relative mt-[200px] gap-[8%]"
            ref={scrollRef3}
          >
            <div className="flex flex-col w-[45%] mr-10">
              <video
                width="100%"
                loop
                playsInline
                autoPlay
                muted
                className={` hover:scale-110  ${
                  animated[2]
                    ? "opacity-0 animate-[slideUp_1s_forwards_1500ms]"
                    : ""
                }`}
              >
                <source src={DivineVideo} type="video/mp4" />
              </video>
            </div>
            <div className="w-[40%]">
              <p
                className={`ml- 20 text-6xl  text-pink tracking-widest mt-2 font-normal leading-normal text-start font-NT shadowPink
              ${
                animated[2]
                  ? "opacity-0 animate-[slideUp_1s_forwards_1000ms]"
                  : ""
              }`}
              >
                Divine & Diary
              </p>
              <p
                className={`leading-loose  text-yellow font-notoSansJP text-start text-base 
              tracking-wider  mt-10 ${
                animated[2]
                  ? "opacity-0 animate-[slideUp_1s_forwards_2000ms]"
                  : ""
              }`}
              >
                隨時遇到狀況都可以問問題占卜<br></br> 占卜結果詢問AI不怕看不懂！
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* 圓 */}
      <div
        ref={scrollRef4}
        className="relative min-h-[1000px] flex flex-col w-screen justify-center items-center overflow-hidden"
      >
        <div
          className="w-[2300px] h-[2300px] rounded-t-full  bg-black absolute  top-0
          bg-clip-content  flex justify-center items-center  overflow-hidden"
        >
          <img
            src={pinkFlower1}
            alt="pinkflower1"
            className="opacity-60  rounded-3xl transform  w-[900px] absolute right-[300px] 
          top-[-100px] z-[2] rotate-[-10deg] blur-sm hover:blur-none downThenUp transition duration-700 ease-in-out"
          />
        </div>
        <p
          className={`font-sygma text-[120px] text-white shadowWhite z-[2] text-center 
        leading-snug tracking-wider mt-36 ${
          animated[3] ? "opacity-0 animate-[slideUp_1s_forwards_800ms]" : ""
        }`}
        >
          PICK YOUR <br></br> DAILY <br></br> TAROT
        </p>
        <p
          className={`font-notoSansJP tracking-widest text-2xl text-pink z-[2] mb-24 ${
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
          <SelectCardHomePage number={1} />
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
      {/* 牌陣 */}

      <div className="w-screen h-6 z-[2] relative" ref={scrollRef5}>
        <div className="min-h-[80px] w-[80%] left-[20%]  top-[-50px] absolute">
          <div
            className={`text-yellow z-[4] font-NT  ${
              animated[4] ? "opacity-0 animate-[slideUp_1s_forwards_300ms]" : ""
            }
          text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2`}
          >
            <Star color={"#E18EA5"} />
            <p>TAROT SPREADS</p>
          </div>
        </div>
      </div>
      <div
        className={`w-screen h-[600px] z-[2] mt-16 relative flex  justify-end ${
          animated[5] ? "opacity-0 animate-[slideUp_1s_forwards_900ms]" : ""
        }`}
      >
        <div
          className="w-[80%]  mb-24 overflow-x-auto flex flex-row gap-16 "
          onWheel={wheelHandler}
        >
          {spreads &&
            spreads.map((item, i) => (
              <SpreadPreview spread={item} index={i} type={"index"} />
            ))}
        </div>
        <div
          className="w-28 h-28 rounded-full  border-[1px] border-white bottom-[100px] left-[100px] absolute cursor-pointer
        font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2] animate-pulse animate-fadeInAnimate opacity-0"
          onClick={() => navigate("/divination")}
        >
          More
        </div>
      </div>
      <Footer />
    </>
  );
}
export default Home;
