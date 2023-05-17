import { useContext, useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import pinkFlower1 from "../../images/pinkflower1.jpeg";

export default function Main({ scrollRef1 }) {
  const { isLogin, setOpenSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showFourthParagraph, setShowFourthParagraph] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // TODO: wrap in tailwind animation delay
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
        className="h-[880px] tinyL:h-[90vh] tiny:h-[70vh] overflow-hidden bg-black  cursor-auto w-screen  
        relative bg-clip-content  flex justify-center items-center"
      >
        <img
          src={pinkFlower1}
          alt="pinkflower1"
          className="sm:hidden opacity-60  rounded-3xl transform  w-[900px] absolute left-[-30px] 
          top-[-150px] z-[2] rotate-[10deg] blur-sm hover:blur-none transition duration-700 ease-in-out upanddown"
        />
        <img
          src={pinkFlower1}
          alt="pinkflower1"
          className="opacity-60  rounded-3xl transform  w-[750px] absolute right-[-30px] 
          top-[100px] z-[2] rotate-[-40deg] blur-sm hover:blur-none transition duration-700 ease-in-out tracking-[0.02em] downThenUp"
        />
        <div
          className="tiny:mt-5 tiny:text-4xl tinyL:text-7xl tiny:text-5xl sm:w-[86%] capitalize font-sygma text-9xl text-white z-[3]  text-start
          leading-normal mb-14  opacity-90 leading-loose"
        >
          <span className=" animate-[slideIn_2s_forwards_500ms] opacity-0 sm:tracking-wider sm:leading-normal tiny:mb-4">
            PICK YOUR CARD
          </span>
          <div
            className="flex flex-row gap-4 items-center shadowWhite animate-[slideIn_2s_forwards_1200ms] opacity-0 
            tinyL:mb-6 sm:my-4 tinyL:tracking-widest "
          >
            TAROT&LIFE
            <div className="sm:w-[auto]  h-[1px] w-1/3 flex-grow bg-white mb-[10px] opacity-80"></div>
          </div>
          <div className="flex flex-row gap-4 items-center shadowWhite">
            <span className="animate-[slideIn_1s_forwards_1500ms] opacity-0 ">
              TAROT
            </span>
            <div className="sm:w-[auto]  h-[1px] w-[20px] flex-grow bg-white mb-[10px] animate-[slideIn_1s_forwards_1500ms] opacity-0"></div>
            <span className="text-end ml-auto animate-[slideIn_1s_forwards_1500ms] opacity-0 ">
              DIARY
            </span>
          </div>
          {showFourthParagraph && (
            <p
              className="tinyL:text-8xl tinyL:top-[35%] tinyL:rignt-[4%] 
              tiny:rignt-[4%]  tiny:text-7xl tiny:top-[32%] tiny:right-[8%] 
              absolute text-pink font-maintelas 
              text-[180px] top-[28%] right-[13%] 
              rotate-[-15deg] font-thin animate-fadeInAnimate "
            >
              Life
            </p>
          )}
        </div>
        <div
          className="sm:hidden  w-28 h-28 rounded-full  border-[1px] border-white bottom-[70px] left-[100px] absolute cursor-pointer
          font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2] animate-pulse animate-fadeInAnimate opacity-0"
          onClick={scroll}
        >
          Scroll
        </div>
        <div
          className="sm:text-base underline underline-offset-2 text-2xl tracking-widest flex flex-row gap-1 cursor-pointer
          text-white z-[2] bottom-[10%] right-[10%] absolute font-NT shadowWhite"
          onClick={() =>
            isLogin ? navigate(`/divination`) : setOpenSignIn(true)
          }
        >
          {isLogin ? "Start Tarot" : "Log In To Start"}
          <MdKeyboardArrowRight className="underline underline-offset-2 mt-1" />
        </div>
      </div>
    </div>
  );
}
