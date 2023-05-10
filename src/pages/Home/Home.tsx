import { useContext, useEffect, useState, useRef } from "react";

import { AuthContext } from "../../context/authContext";

import Member from "../Member";
import Main from "./Main";
import Intro from "./Intro";
import Circle from "./Circle";
import SpreadsSlide from "./SpreadsSlide";
import Footer from "../../components/Footer";

function Home() {
  const { openSignIn, setOpenSignIn } = useContext(AuthContext);
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

  return (
    <>
      {openSignIn && (
        <div className="w-screen h-screen fixed z-50">
          <div
            className={`w-0 opacity-0 h-screen fixed transition bg-black/90 duration-700 ease-in-out ${
              openSignIn && "w-screen opacity-100"
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
      <Main scrollRef1={scrollRef1} />
      <Intro
        scrollRef1={scrollRef1}
        scrollRef2={scrollRef2}
        scrollRef3={scrollRef3}
        animated={animated}
      />
      <Circle scrollRef4={scrollRef4} animated={animated} />
      <SpreadsSlide scrollRef5={scrollRef5} animated={animated} />
      <Footer />
    </>
  );
}
export default Home;
