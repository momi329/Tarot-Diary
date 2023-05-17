import { useEffect, useRef, useState } from "react";
import pinkFlower1 from "../images/pinkflower1.jpeg";
function Footer() {
  const footerRef = useRef<HTMLParagraphElement | null>(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (!footerRef.current) return;
      const inToView1 = footerRef.current?.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (footerRef.current && inToView1?.top < windowHeight) {
        setAnimated(!animated);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div>
      <div
        className="h-[800px] sm:w-full overflow-hidden bg-black animate-pulse
       w-screen  relative bg-clip-content  flex justify-center items-center"
      >
        <img
          src={pinkFlower1}
          alt="pinkflower1"
          className="opacity-60  rounded-3xl transform  w-[850px] absolute left-[-30px] hover:animate-pulse
          top-[-100px] z-[2] rotate-[132deg] blur-sm hover:blur-none transition duration-700 ease-in-out"
        />
        <p
          ref={footerRef}
          className={`capitalize font-NT text-5xl text-yellow z-[3]  text-center 
         w-[60%] shadowYellow  leading-normal mb-10 tinyL:text-4xl 
         tinyL:leading-relaxed tiny:text-2xl tiny:leading-7 opacity-0 
         ${animated ? "opacity-0 animate-[slideUp_1s_forwards_400ms]" : ""}
         `}
        >
          "For Those Who Feel Lost And <br></br>Uncertain, Tarot Cards Can Be a
          <br></br>
          Helpful Tool In Making Decisions."
        </p>
      </div>
    </div>
  );
}
export default Footer;
