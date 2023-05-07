import { Link } from "react-router-dom";
import lightCard from "../../images/card-light.png";
export const SpreadPlace = ({ type, tarot, size }) => {
  let widthAndHeight;
  if (size === "large") {
    widthAndHeight = {
      a: " max-w-screen-md mb-12 p-[30px]",
      b: " w-[144px] h-[113px] cursor-default",
      c: " w-[138px] h-[220px] gap-2 ",
      scale: "",
    };
  } else if (size === "medium") {
    widthAndHeight = {
      a: " w-[542px] mb-5 p-5",
      b: " w-[71px] h-[60px] ",
      c: " w-[70px] h-[120px] gap-2 ",
      scale:
        " hover:transform hover:scale-125 transition duration-300 hover:z-10 ",
    };
  }
  // backdrop-blur-sm bg-white/10
  return (
    <div
      className={`flex flex-wrap justify-center  border border-yellow z-1 
  mx-auto  border-opacity-50  ${widthAndHeight.a} border-none  ${
        widthAndHeight.scale
      } min-h-[350px] ${type.userUID === "all" ? "pt-[60px]" : ""}`}
    >
      {type.spread.map((item: any, i: number) => {
        return (
          <div
            className={`flex justify-center box-border ${widthAndHeight.b} `}
            key={i}
          >
            {item !== 0 && (
              <div
                className={` rounded-xl ${
                  widthAndHeight.c
                } cursor-default relative box-border  hover:scale-1 10 hover:shadow-lg hover:shadow-green/60 hover:duration-200
               flex items-center justify-center flex-col bg-slate-800 text-yellow z-0 over:z-10  bg-opacity-80
               ${widthAndHeight.scale}  ${
                  type.userUID === "all" ? "scale-110" : ""
                }`}
              >
                {item.card !== undefined ? (
                  <Link to={`/card/${item.card}`}>
                    <img
                      src={tarot[item.card].img}
                      alt={tarot[item.card].name}
                      className={`${
                        item.reverse ? "" : "rotate-180"
                      } w-[100%] h-[100%] absolute top-0 left-0 `}
                    />
                  </Link>
                ) : (
                  <>
                    <div className="absolute top-3 left-2 z-10 cursor-default">
                      <p className="text-5xl font-NT text-green ml-2">
                        {item.order}
                      </p>
                      <p
                        className="text-sm font-notoSansJP text-green mt-[70px] w-[100%] bg-cream/20 backdrop-blur-sm
                      tracking-widest px-2 py-2 bg-cream bg-opacity-30 "
                      >
                        {item.value}
                      </p>
                    </div>
                    <img
                      src={lightCard}
                      alt={"lightCard"}
                      className={` w-[100%] h-[100%] absolute z-0`}
                    />
                  </>
                )}
                {item.card !== undefined && (
                  <div
                    className={`w-full h-full bg-white/60 backdrop-blur-sm absolute 
                   opacity-0 leading-tight p-2 ${
                     item.card !== undefined
                       ? "hover:opacity-100 duration-500"
                       : ""
                   }`}
                  >
                    {item.card !== undefined && size === "large" ? (
                      <>
                        <p
                          className="absolute top-1 left-2 z-8 font-NT text-8xl w-[10%] text-green
                      shadowGreen text-center tracking-wide leading-tight"
                        >
                          {item.order}
                        </p>
                        <p
                          className="absolute top-[100px] left-2 leading-tight 
                     text-sm  w-[90%] tracking-wide text-green"
                        >
                          {item.value}
                        </p>

                        <div className="text-lg font-NT bottom-7 absolute leading-none text-green shadowGreen">
                          {tarot[item.card].name}{" "}
                        </div>
                        {""}
                        <div className="z-10 text-sm mt-[1px] leading-none text-gray bottom-2 absolute text-green">
                          {item.reverse ? "正位" : "逆位"}
                        </div>
                      </>
                    ) : (
                      <>
                        <p
                          className="absolute top-1 left-2 z-8 font-NT text-2xl w-[10%] text-green
                      shadowGreen text-center tracking-wide leading-tight"
                        >
                          {item.order}
                        </p>
                        <p
                          className="absolute bottom-2 left-2 leading-none
                     text-[6px]  w-[80%] tracking-wide text-green"
                        >
                          {item.value}
                        </p>

                        <div className="text-[9px] font-NT top-8 left-2 absolute leading-none text-green shadowGreen">
                          {tarot[item.card].name}{" "}
                        </div>
                        {""}
                        <span className="z-10 text-[6px] font-notoSansJP mt-[1px] leading-none text-gray top-2 right-1 absolute text-green">
                          {item.reverse ? "正位" : "逆位"}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
