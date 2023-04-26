import { Link } from "react-router-dom";
import lightCard from "../images/card-light.png";
export const SpreadPlace = ({ type, tarot, size }) => {
  let widthAndHeight;
  if (size === "large") {
    widthAndHeight = {
      a: " max-w-screen-md mb-6 p-[30px]",
      b: " w-[119px] h-[93px] ",
      c: " w-[117px] h-[186px] gap-2 ",
      scale: "",
    };
  } else if (size === "medium") {
    widthAndHeight = {
      a: " w-[542px] mb-5 p-5",
      b: " w-[57px] h-[46px] ",
      c: " w-[56px] h-[93px] gap-2 ",
      scale:
        " hover:transform hover:scale-125 transition duration-300 hover:z-10 ",
    };
  }
  return (
    <div
      className={`flex flex-wrap justify-center  border border-yellow z-1 
  mx-auto  border-opacity-50  ${widthAndHeight.a} ${
        widthAndHeight.scale
      } min-h-[350px] ${type.userUID === "all" ? "border-none" : ""}`}
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
                } cursor-pointer relative box-border 
               flex items-center justify-center flex-col bg-slate-800 text-yellow z-0  bg-opacity-80
               ${widthAndHeight.scale}  ${
                  type.userUID === "all" ? "scale-125" : ""
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
                    <div className='absolute top-3 left-2 z-10'>
                      <p className='text-5xl font-NT text-green ml-2'>
                        {item.order}
                      </p>
                      <p className='text-sm font-NT text-green mt-[70px] w-[100%] tracking-widest px-2 py-2 bg-cream bg-opacity-30'>
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
                <div
                  className={`w-[60px] h-[40px] bg-pink bg-opacity-100 absolute top-[-60px] right-[-20px]
                   opacity-0 leading-tight p-2 ${
                     item.card !== undefined ? "hover:opacity-100" : ""
                   }`}
                >
                  {item.card !== undefined ? (
                    <div className='text-[6px] font-NT'>
                      <p>{item.order}</p>
                      <p>{item.value}</p>
                      {/* <p>{tarot[item.card].name}</p>
                      <p> {item.reverse ? "正位" : "逆位"}</p> */}
                    </div>
                  ) : (
                    <div className='text-[20px] font-NT'>
                      <p>{item.order}</p>
                      <p>{item.value}</p>
                    </div>
                  )}
                  {/* <div
                  className={`w-[100%] h-[100%] bg-black bg-opacity-40 absolute top-[0px] right-0
                   opacity-100 leading-tight p-2 ${
                     item.card !== undefined ? "hover:opacity-100" : ""
                   }`}
                > */}
                  {item.card !== undefined && (
                    <Link to={`/card/${item.card}`}>
                      <div className='text-[5px] font-NT leading-none shadowYellow'>
                        {tarot[item.card].name}{" "}
                      </div>
                      {""}
                      <div className='z-10 text-[1px] mt-[1px] leading-none text-gray'>
                        {item.reverse ? "正位" : "逆位"}
                      </div>
                    </Link>
                  )}
                  <div className='absolute bottom-2 left-0 bg-opacity-80 bg-black filter blur-sm w-[100%] h-100%'></div>
                  <p
                    className='absolute bottom-1 left-1 leading-tight 
                     text-[3px] z-10  w-[90%] tracking-wide text-yellow'
                  >
                    {item.value}
                  </p>
                  <p
                    className='absolute top-14 left-1 z-10 font-NT text-xl w-[10%] text-yellow
                      shadowGreen text-center tracking-wide leading-tight'
                  >
                    {item.order}
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
