import React, { useContext, useState, useEffect } from "react";
import pinkFlower1 from "../../images/pinkflower1.jpeg";
import { MdKeyboardArrowRight } from "react-icons/md";
import { AuthContext } from "../../context/authContext";

export default function Main({ scrollRef1 }) {
  const { isLogin, setOpenSignIn } = useContext(AuthContext);
  const [showFourthParagraph, setShowFourthParagraph] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowFourthParagraph(true);
    }, 2000);
  }, []);
  function scroll() {
    const scrollNode: HTMLDivElement | null = scrollRef1.current;
    if (scrollNode) {
      scrollNode.scrollIntoView({
        behavior: "smooth",
      });
    }
  }
  return (
    <div>
      <div
        className='h-[880px] overflow-hidden bg-black  cursor-auto w-screen  
        relative bg-clip-content  flex justify-center items-center'
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

          <div className='flex flex-row gap-4 items-center shadowWhite animate-[slideIn_2s_forwards_1200ms] opacity-0'>
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
            <p
              className='absolute text-pink font-maintelas text-[180px] top-[28%] right-[18%] 
              rotate-[-15deg] font-thin animate-fadeInAnimate '
            >
              Life
            </p>
          )}
        </p>
        <div
          className='w-28 h-28 rounded-full  border-[1px] border-white bottom-[70px] left-[100px] absolute cursor-pointer
          font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2] animate-pulse animate-fadeInAnimate opacity-0'
          onClick={scroll}
        >
          Scroll
        </div>
        <p
          className='underline underline-offset-2 text-2xl tracking-widest flex flex-row gap-1 cursor-pointer
          text-white z-[2] bottom-[100px] right-[100px] absolute font-NT shadowWhite'
          onClick={() => (isLogin ? "" : setOpenSignIn(true))}
        >
          Log In To Start{" "}
          <MdKeyboardArrowRight className='underline underline-offset-2 mt-1' />
        </p>
      </div>
    </div>
  );
}
