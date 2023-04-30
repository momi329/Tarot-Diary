import pinkFlower1 from "../../images/pinkflower1.jpeg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Moon from "../../images/Moon";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { getRandomBool, getRandomCards } from "../../components/Divine";
import Footer from "../../components/Footer";
import Star from "../../images/Star";
import React, { useRef } from "react";
import cards from "../../tarotcard/tarot-images";
import SelectCardHomePage from "./SelectCardHomePage";
const tarot = cards.cards;
function Home() {
  const navigate = useNavigate();
  const [showFourthParagraph, setShowFourthParagraph] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setShowFourthParagraph(true);
    }, 2000);
  }, []);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const el = document.getElementById("animated-element");
      if (el && !animated && isElementInViewport(el)) {
        setAnimated(true);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animated]);

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  }
  useEffect(() => {
    const handleScroll = (event) => {
      console.log(window.scrollY);
      if (
        window.innerHeight + window.scrollY + 800 >=
        document.body.offsetHeight
      ) {
        console.log("activate");
        event.preventDefault();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function wheelHandler(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;
    const scrollLeft = element.scrollLeft;
    const deltaY = event.deltaY;
    console.log(deltaY, scrollWidth, clientWidth, scrollLeft);
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
      <div>
        <div
          className='h-[880px] overflow-hidden bg-black  
       w-screen  relative bg-clip-content  flex justify-center items-center'
        >
          <img
            src={pinkFlower1}
            alt='pinkflower1'
            className='opacity-60  rounded-3xl transform  w-[900px] absolute left-[-30px] 
          top-[-150px] z-[2] rotate-[10deg] blur-sm hover:blur-none transition duration-700 ease-in-out upanddown'
          />
          <img
            src={pinkFlower1}
            alt='pinkflower1'
            className='opacity-60  rounded-3xl transform  w-[750px] absolute right-[-30px] 
          top-[100px] z-[2] rotate-[-40deg] blur-sm hover:blur-none transition duration-700 ease-in-out tracking-[0.02em] downThenUp'
          />
          <p
            className='capitalize font-sygma text-9xl text-white z-[3]  text-start
           leading-normal mb-14  opacity-90'
          >
            <p className=' animate-[slideIn_2s_forwards_500ms] opacity-0'>
              PICK YOUR CARD
            </p>

            <div className='flex flex-row gap-4 items-center shadowWhite animate-[slideIn_2s_forwards_1000ms] opacity-0'>
              TAROT&LIFE
              <div className='h-[1px] w-1/3 flex-grow bg-white mb-[10px] opacity-80'></div>
            </div>
            <div className='flex flex-row gap-4 items-center shadowWhite'>
              <span className='animate-[slideIn_1s_forwards_1500ms] opacity-0'>
                TAROT
              </span>
              <div className='h-[1px] w-[20px] flex-grow bg-white mb-[10px] animate-[slideIn_1s_forwards_1500ms] opacity-0'></div>
              <span className='text-end ml-auto animate-[slideIn_1s_forwards_1500ms] opacity-0'>
                DIARY
              </span>
            </div>
            {showFourthParagraph && (
              <p className='absolute text-pink font-maintelas text-[180px] top-[28%] right-[18%] rotate-[-15deg] font-thin animate-fadeInAnimate'>
                Life
              </p>
            )}
          </p>
          <div
            className='w-28 h-28 rounded-full  border-[1px] border-white bottom-[70px] left-[100px] absolute
        font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2]'
          >
            Scroll
          </div>
          <p
            className='underline underline-offset-2 text-2xl tracking-widest flex flex-row gap-1 cursor-pointer
           text-white z-[2] bottom-[100px] right-[100px] absolute font-NT shadowWhite'
            onClick={() => navigate(`/signin`)}
          >
            Log In To Start{" "}
            <MdKeyboardArrowRight className='underline underline-offset-2 mt-1' />
          </p>
        </div>
      </div>
      {/* part2 */}
      <div className=' w-screen  relative bg-clip-content  flex justify-center items-center'>
        <div className='min-h-[1500px] w-[70%] mt-24'>
          <div className='text-yellow font-NT text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2'>
            <Moon color={"#E18EA5"} width={"56px"} height={"62px"} />
            <p>ABOUT US</p>
          </div>
          <div>
            <p className='ml-20 text-pink text-2xl tracking-widest font-normal mt-20'>
              設計X紀錄X占卜
            </p>
            <p className='ml-20 text-5xl  text-pink tracking-widest mt-2 font-normal leading-normal'>
              讓所有<br></br>塔羅學習者都愛上
            </p>
            <p className='leading-loose ml-20 text-yellow font-notoSansJP text-base tracking-wider  mt-16 w-[60%] '>
              占卜後留下紀錄，方便你在現實生活中驗證！<br></br>{" "}
              但是好麻煩喔？拍照都會反光，牌陣的意義也記不起來...<br></br>
              你是否想要系統性紀錄抽牌結果？<br></br>
              我們提供線上紀錄的管道。<br></br>
              結合占卜x抽牌x設計，讓你學習塔羅的路途上有系統性地記錄方便回顧！
              <br></br>
              也方便你隨時隨地可以抽牌！
            </p>
          </div>
          <div className='flex items-end flex-col'>
            <p className='ml-20 text-pink text-2xl tracking-widest font-normal mt-40'>
              設計X紀錄X占卜
            </p>
            <p className='ml-20 text-5xl  text-pink tracking-widest mt-2 font-normal leading-normal text-end'>
              讓所有<br></br>塔羅學習者都愛上
            </p>
            <p className='leading-loose ml-20 text-yellow font-notoSansJP text-base tracking-wider  mt-16 w-[60%] text-end'>
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
      </div>
      {/* 圓 */}
      <div className='relative min-h-[1000px] flex flex-col w-screen justify-center items-center overflow-hidden'>
        <div
          className='w-[2300px] h-[2300px] rounded-t-full  bg-black absolute  top-[0px]
          bg-clip-content  flex justify-center items-center  overflow-hidden'
        >
          <img
            src={pinkFlower1}
            alt='pinkflower1'
            className='opacity-60  rounded-3xl transform  w-[900px] absolute right-[300px] 
          top-[-100px] z-[2] rotate-[-10deg] blur-sm hover:blur-none downThenUp transition duration-700 ease-in-out'
          />
        </div>
        <p
          id='animated-element'
          className='font-sygma text-[120px] text-white shadowWhite z-[2] text-center 
        leading-snug tracking-wider mt-32'
        >
          PICK YOUR <br></br> DAILY <br></br> TAROT
        </p>
        <p
          id='animated-element'
          className='font-notoSansJP tracking-widest text-2xl text-pink z-[2] mb-24 '
        >
          靜心冥想，選擇一張牌...
        </p>
        <div className='z-[3] w-100% flex flex-col justify-center items-center'>
          <SelectCardHomePage number={1} />
          <div className=''>
            <Button
              type={"big"}
              action={async () => {
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
              }}
              value={"Start"}
            />
          </div>
        </div>
        {/* 缺一個按鈕占卜 */}
      </div>
      <div className='w-screen h-[300px] z-[1] relative'>
        <div
          className='blur-lg  w-screen h-80 bg-gradient-to-b
          from-black to-green absolute top-[-160px] z-1'
        ></div>
      </div>
      {/* 牌陣 */}
      {/* <div className='w-screen h-[1000px] z-[3] relative'>
       
        <div className=' w-screen  relative mt-20   flex justify-center items-center'>
          <div className='min-h-[80px] w-[70%] '>
            <div className='text-yellow z-[4] font-NT text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2'>
              <Star color={"#E18EA5"} />
              <p>TAROT SPREADS</p>
            </div>
          </div>
          <div className='min-h-[800px] w-70% flex justify-end items-center bg-pink z-3'></div>
        </div>
      </div> */}

      {/* <div className='w-screen h-6 z-[2] relative'>
        <div className='min-h-[80px] w-[70%] left-[20%]  top-[-50px] absolute'>
          <div
            className='text-yellow z-[4] font-NT 
          text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2'
          >
            <Star color={"#E18EA5"} />
            <p>TAROT SPREADS</p>
          </div>
        </div>
      </div>
      <div className='w-screen h-[600px] z-[2] relative flex  justify-end'>
        <div
          className='w-[60%] border border-pink mb-24 overflow-x-auto flex flex-row gap-16 '
          onWheel={wheelHandler}
        >
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>

          <div className='w-[280px] h-[420px] bg-yellow z-[3] shrink-0'></div>
        </div>
      </div> */}
      <Footer />
    </>
  );
}
export default Home;
