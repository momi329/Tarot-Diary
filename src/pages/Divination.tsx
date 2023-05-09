import { DocumentData } from "firebase/firestore";
import { useEffect, useState, useRef, useContext } from "react";
import SpreadPreview from "../components/SpreadPreview";
import Arrow from "../images/Arrow";
import Star from "../images/Star";
import firebase from "../utils/firebase";
import type { SpreadData } from "../utils/type";
import { AuthContext } from "../context/authContext";
function Divination() {
  const [page, setPage] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { spreads } = useContext(AuthContext);

  function scrollToIndex(index) {
    if (spreads && index === spreads.length) {
      index = 0;
      setPage(0);
    }
    const listNode = listRef.current;
    if (listNode) {
      const imgNode = listNode.querySelectorAll("#spread")[index];
      const allNode = listNode.querySelectorAll("#spread");
      allNode.forEach((div) => {
        div.classList.remove("selected");
        imgNode.classList.add("unSelected");
      });
      imgNode.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
      imgNode.classList.remove("unSelected");
      imgNode.classList.add("selected");
    }
  }
  // useEffect(() => {
  //   getAllSpread();
  // }, []);

  useEffect(() => {
    if (spreads) {
      scrollToIndex(0);
    }
  }, [spreads]);
  const addPage = () => {
    if (spreads) {
      const newPage = page;
      let addPage;
      if (newPage < 5) {
        addPage = newPage + 1;
      } else {
        addPage = 0;
      }

      scrollToIndex(addPage);
      setPage(addPage);
    }
  };
  const minusPage = () => {
    const newPage = page;
    const minusPage = newPage - 1 <= 0 ? 0 : newPage - 1;
    scrollToIndex(minusPage);
    setPage(minusPage);
  };

  return (
    <>
      <div className="w-screen h-auto min-h-screen flex justify-center ">
        <div className="w-[1080px] ">
          <div className="h-[100px] w-full" />
          <div className="m-20 ml-28 relative">
            <h1 className="font-sygma text-7xl text-yellow shadowYellow">
              PICK A CARD
            </h1>
            <p className="font-notoSansJP text-white text-base tracking-widest mt-4 mb-10">
              挑選一個預設排陣準備今天的占卜吧！<br></br>{" "}
              除了預設推薦，還有很多人設計的牌陣值得一試，一起來占卜看看吧！
            </p>
            <p className="font-maintelas  text-[128px] text-pink absolute top-[-110px] left-[-100px] rotate-[-20deg]">
              Divine
            </p>
            {/* 每日推薦 */}

            <div className="relative flex">
              {/* 左箭頭 */}
              <div
                className="scale-y-[0.5] stroke-1 stroke-white 
              cursor-pointer rotate-[-90deg] absolute left-[-80px] top-1/3  opacity-70  "
              >
                <Arrow
                  size={"80px"}
                  onClick={() => {
                    minusPage();
                  }}
                  color={"#fff"}
                />{" "}
              </div>
              {/* 右箭頭 */}
              <div className="scale-y-[0.5] stroke-1 stroke-white cursor-pointer rotate-90 absolute right-[-80px] top-1/3  opacity-70  ">
                <Arrow
                  size={"80px"}
                  onClick={() => {
                    addPage();
                  }}
                  color={"#fff"}
                />{" "}
              </div>
              {/* 牌陣 */}
              <div
                className="relative overflow-hidden w-full  h-[400px] flex-nowrap shrink flex flex-row
             mt-5  my-8 gap-5 items-end "
                ref={listRef}
              >
                <div className="w-[200px] h-1/2   shrink-0" />
                {spreads?.map(
                  (spread, index) =>
                    index < 6 && (
                      <SpreadPreview
                        type={"index"}
                        spread={spread}
                        index={index}
                        key={index}
                        page={page}
                      />
                    )
                )}
                <div className="w-[200px] h-1/2 shrink-0" />
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center justify-center">
              <Star color={"#E18EA5"} />
              <p className="font-NT text-3xl text-yellow shadowYellow">
                Daily Recommendation
              </p>
              <Star color={"#E18EA5"} />
            </div>

            {/* 隨機 */}
            <div className="flex flex-row gap-5 items-center mb-4 mt-10">
              <Star color={"#E18EA5"} />
              <p className="font-NT text-3xl text-yellow shadowYellow">
                Popular
              </p>
            </div>

            <div className="flex flex-wrap w-full mb-40 gap-4">
              {spreads?.map(
                (spread, index) =>
                  index > 5 && (
                    <SpreadPreview
                      type={"personal"}
                      spread={spread}
                      index={index}
                      key={index}
                      page={page}
                    />
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Divination;
