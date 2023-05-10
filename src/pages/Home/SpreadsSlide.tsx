import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import SpreadPreview from "../../components/SpreadPreview";
import { AuthContext } from "../../context/authContext";
import Star from "../../images/Star";

export default function SpreadsSlide({ scrollRef5, animated }) {
  const navigate = useNavigate();
  const { spreads } = useContext(AuthContext);

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
      <div className='w-screen h-6 z-[2] relative' ref={scrollRef5}>
        <div className='min-h-[80px] w-[80%] left-[20%]  top-[-50px] absolute'>
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
          className='w-[80%]  mb-24 overflow-x-auto flex flex-row gap-16 '
          onWheel={wheelHandler}
        >
          {spreads &&
            spreads.map((item, i) => (
              <SpreadPreview spread={item} index={i} type={"index"} />
            ))}
        </div>
        <div
          className='w-28 h-28 rounded-full  border-[1px] border-white bottom-[100px] left-[100px] absolute cursor-pointer
        font-NT shadowWhite text-xl text-white leading-[112px] text-center opacity-90 z-[2] animate-pulse animate-fadeInAnimate opacity-0'
          onClick={() => navigate("/divination")}
        >
          More
        </div>
      </div>
    </>
  );
}
