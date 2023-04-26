import pinkFlower1 from "../images/pinkflower1.jpeg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Moon from "../images/Moon";
import { useEffect, useState } from "react";
import lightCard from "../images/card-light.png";
import Button from "../components/Button";
import Divine from "../components/Divine";
import Footer from "../components/Footer";
import Star from "../images/Star";
import React, { useRef } from "react";

function Home() {
  const navigate = useNavigate();

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
            className='opacity-60  rounded-3xl transform  w-[900px] absolute left-[-30px] hover:animate-pulse
          top-[-150px] z-[2] rotate-[10deg] blur-sm hover:blur-none transition duration-700 ease-in-out'
          />
          <img
            src={pinkFlower1}
            alt='pinkflower1'
            className='opacity-60  rounded-3xl transform  w-[750px] absolute right-[-30px] hover:animate-pulse
          top-[100px] z-[2] rotate-[-40deg] blur-sm hover:blur-none transition duration-700 ease-in-out tracking-[0.02em]'
          />
          <p
            className='capitalize font-sygma text-9xl text-white z-[3]  text-start
         lg:w-[50%]   leading-normal mb-14  opacity-90'
          >
            <p>PICK YOUR CARD</p>

            <div className='flex flex-row gap-4 items-center shadowWhite'>
              TAROT&LIFE
              <div className='h-[1px] w-1/3 flex-grow bg-white mb-[10px] opacity-80'></div>
            </div>
            <div className='flex flex-row gap-4 items-center shadowWhite'>
              <span>TAROT</span>
              <div className='h-[1px] w-[20px] flex-grow bg-white mb-[10px]'></div>
              <span className='text-end ml-auto '>DIARY</span>
            </div>
            <p className='absolute text-pink  font-maintelas text-[180px] top-[28%] right-[18%] rotate-[-15deg] font-thin'>
              Life
            </p>
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
        <div className='min-h-[800px] w-[70%] mt-24'>
          <div className='text-yellow font-NT text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2'>
            <Moon color={"#E18EA5"} width={"56px"} height={"62px"} />
            <p>ABOUT US</p>
          </div>
          <div>
            <p className='ml-20 text-pink text-2xl underline underline-offset-2 tracking-widest font-normal mt-20'>
              設計X紀錄X占卜
            </p>
            <p className='ml-20 text-5xl underline underline-offset-2 text-pink tracking-widest mt-2 font-normal leading-normal'>
              讓所有<br></br>塔羅學習者都愛上
            </p>
            <p className='leading-loose ml-20 text-yellow font-notoSansJP text-base tracking-wider  mt-16 w-[60%] '>
              假字，是資連提攤新志龍內大大？歷價。的…莖夫他卜抽囉漢樣…啦價社留金內誰伸人元著電當央黨詰笙我！的…姑且過帕加單會東此己樣管愛名才灰很的並樣瞭人，家恣代交岱裊成行美，因然，我很篇隊泡的公忿然我家稍頭舟撓試安神不完嫌；題妳誰非的號之，正才思在遷生言呦建鑑且請資中天在的悟工很恤題中方思枯騰十清西張體出琴？諧少提資系認厲…，工很恤題中方思枯騰十清西張體出琴？諧少提資系認厲…
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
            className='opacity-60  rounded-3xl transform  w-[900px] absolute right-[300px] hover:animate-pulse
          top-[-100px] z-[2] rotate-[-10deg] blur-sm hover:blur-none transition duration-700 ease-in-out'
          />
        </div>
        <p
          className='font-sygma text-[120px] text-white shadowWhite z-[2] text-center 
        leading-snug tracking-wider mt-32'
        >
          PICK YOUR <br></br> DAILY <br></br> TAROT
        </p>
        <p className='font-notoSansJP tracking-widest text-2xl text-pink z-[2] mb-24 '>
          靜心冥想，選擇一張牌...
        </p>
        <div className='z-[3] w-100% flex flex-col justify-center items-center'>
          <SelectCardHomePage number={1} />
          <div className=''>
            <Button type={"big"} action={() => {}} value={"Start"} />
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
      <div className='w-screen h-6 z-[2] relative'>
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
      </div>
      <Footer />
    </>
  );
}
export default Home;
const SelectCardHomePage = ({ number }) => {
  const [cardArr, setCardArr] = useState(new Array(12).fill(false));

  return (
    <>
      <div className='flex flex-row h-[420px] w-[1100px] justify-center items-center relative mt-5 '>
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
              `}
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
              <img src={lightCard} alt='card' className='w-[100%]' />
            </div>
          );
        })}
      </div>
    </>
  );
};
