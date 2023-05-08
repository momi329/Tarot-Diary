import { Link, useNavigate } from "react-router-dom";
import type { SpreadPreviewProps } from "../utils/type";
function SpreadPreview({ spread, index, type }: SpreadPreviewProps) {
  const navigate = useNavigate();
  let style;
  if (type === "personal") {
    style = {
      a: "w-[32%] h-0 pt-[32%] relative",
      b: "top-2 left-3",
    };
  }
  if (type === "index") {
    style = {
      a: `w-[350px] h-0 pt-[32%] inline-block shrink-0 relative mb-[50px] `,
      b: "top-8 left-5",
    };
  }

  return (
    <div
      id="spread"
      className={`${style.a} bg-cover duration-200  z-0 ${
        type === "personal" ? "hover:scale-110 hover:z-10 " : ""
      } `}
      key={index}
      onClick={() => navigate(`/spread/${spread.spreadId}`)}
    >
      {spread.image !== "" && (
        <img
          src={spread.image}
          alt={spread.title}
          className="opacity-90 absolute top-0 object-cover left-0 w-[100%] h-[100%] cursor-pointer"
        />
      )}
      <p
        className={`text-xs mt-1 absolute ${style.b} text-white shadowWhite tracking-wide font-NT`}
      >
        PICK A CARD
      </p>
      <div
        className="min-h-[25%] w-[100%]  bg-darkPink bg-opacity-40 cursor-pointer 
p-3 pl-4 absolute bottom-0 tracking-widest font-NT text-base text-yellow"
      >
        {" "}
        <p className="cursor-pointer">{spread.title}</p>
        {spread.name && (
          <p
            className="text-sm text-gray cursor-pointer "
            onClick={() => navigate(`/profile/${spread.userUID}`)}
          >
            Author/{spread.name}
          </p>
        )}
      </div>
    </div>
  );
}
export default SpreadPreview;
