import Moon from "../../images/Moon";
import DesignVideo from "../../images/design.mp4";
import DivineVideo from "../../images/divine.mp4";

export default function Intro({
  scrollRef1,
  scrollRef2,
  scrollRef3,
  animated,
}) {
  return (
    <div className=" w-screen  relative bg-clip-content  flex justify-center items-center">
      <div className="sm:mt-10 sm:w-[90%] tinyL:h-[600px] tiny:h-[600px] h-[2100px]  w-[70%] mt-36 ">
        <div ref={scrollRef1}>
          <div
            className={`sm:hidden
            text-yellow font-NT text-4xl tracker-wider flex flex-row shadowYellow items-center gap-2 ${
              animated[0] ? "opacity-0 animate-[slideUp_1s_forwards_300ms]" : ""
            } `}
          >
            <Moon color={"#E18EA5"} width={"56px"} height={"62px"} />
            <p>ABOUT US</p>
          </div>
          <div
            className={`sm:block hidden
            text-yellow font-NT text-3xl tracker-wider flex flex-row shadowYellow items-center gap-2 ${
              animated[0] ? "opacity-0 animate-[slideUp_1s_forwards_300ms]" : ""
            } `}
          >
            {/* <Moon color={"#E18EA5"} width={"36px"} height={"40px"} /> */}
            <p>・ABOUT US</p>
          </div>
          <div>
            <p
              className={`sm:ml-6 sm:mt-10 sm:text-base    ml-20 text-pink text-2xl tracking-widest font-normal mt-20 
        ${animated[0] ? "opacity-0 animate-[slideUp_1s_forwards_600ms]" : ""}`}
            >
              設計X紀錄X占卜
            </p>
            <p
              className={`sm:ml-6 sm:text-4xl sm:leading-relaxed
              ml-20 text-5xl  text-pink tracking-widest mt-2 font-normal 
        ${animated[0] ? "opacity-0 animate-[slideUp_1s_forwards_900ms]" : ""}`}
            >
              讓所有<br></br>塔羅學習者都愛上
            </p>
            <p
              className={`sm:ml-6  sm:text-sm  sm:w-[80%] sm:mt-10 sm:leading-loose
              leading-loose ml-20 text-yellow font-notoSansJP text-base
               tracking-wider  mt-16 w-[60%] 
        ${animated[0] ? "opacity-0 animate-[slideUp_1s_forwards_1300ms]" : ""}`}
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
          className="sm:hidden sm:flex-col sm:mt-32 flex items-end flex-row relative mt-[200px] gap-[8%]"
          ref={scrollRef2}
        >
          <div className="sm:ml-6 sm:w-[90%] flex flex-col w-[40%] mr-10">
            <p
              className={`sm:text-5xl   ml-20 text-6xl  text-pink tracking-widest mt-2 font-normal leading-normal text-end font-NT shadowPink
        ${animated[1] ? "opacity-0 animate-[slideUp_1s_forwards_400ms]" : ""}`}
            >
              Enjoy & Design
            </p>
            <p
              className={`sm:text-sm  leading-loose ml-20 text-yellow font-notoSansJP
          text-base  tracking-wider  mt-10  text-end ${
            animated[1] ? "opacity-0 animate-[slideUp_1s_forwards_800ms]" : ""
          }`}
            >
              一般的牌陣是不是無法滿足你呢？<br></br>
              客製化的設計讓你可以隨時問自己想問的<br></br> 更能客製化需求喔！
            </p>
          </div>
          <div className=" w-[45%]">
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
          className="sm:hidden sm:ml-6 sm:flex-col flex items-end flex-row relative mt-[200px] gap-[8%]"
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
          <div className="sm:w-[90%] w-[40%]">
            <p
              className={` sm:text-5xl  ml- 20 text-6xl  text-pink tracking-widest mt-2 font-normal leading-normal text-start font-NT shadowPink
        ${animated[2] ? "opacity-0 animate-[slideUp_1s_forwards_1000ms]" : ""}`}
            >
              Divine & Diary
            </p>
            <p
              className={`sm:text-sm leading-loose  text-yellow font-notoSansJP text-start text-base 
        tracking-wider  mt-10 ${
          animated[2] ? "opacity-0 animate-[slideUp_1s_forwards_2000ms]" : ""
        }`}
            >
              隨時遇到狀況都可以問問題占卜<br></br> 占卜結果詢問AI不怕看不懂！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
