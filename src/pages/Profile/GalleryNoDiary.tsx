import React from "react";
import UnderlineButton from "../../components/UnderlineButton";
import { useNavigate } from "react-router-dom";
function GalleryNoDiary() {
  const navigate = useNavigate();
  return (
    <>
      <p className="text-5xl text-yellow font-NT shadowYellow mt-2">
        No Diary Yet {" : ("}
      </p>
      <div className="text-xl text-yellow font-NT shadowYellow mt-9 flex flex-col gap-3 tracking-widest">
        {" "}
        Maybe You Can Try this:
        <div className="w-[127px]">
          <UnderlineButton
            value={"Daily Tarot"}
            type={"memberPage"}
            action={() => {
              navigate("/spread/common-1");
            }}
          />
        </div>
        <div className="w-[227px]">
          <UnderlineButton
            value={"Three Card Spread"}
            type={"memberPage"}
            action={() => {
              navigate("/spread/common-3");
            }}
          />
        </div>
        <div className="w-[150px]">
          <UnderlineButton
            value={"Yes/No Tarot"}
            type={"memberPage"}
            action={() => {
              navigate("/spread/common-2");
            }}
          />
        </div>
        <div className="flex flex-row gap-2 items-end mt-2">
          {" "}
          or{" "}
          <UnderlineButton
            value={"More..."}
            type={"memberPage"}
            action={() => navigate("/divination")}
          />
        </div>
        <div className="flex flex-row gap-2 items-end">
          {" "}
          or{" "}
          <UnderlineButton
            value={"Design By Yourself..."}
            type={"memberPage"}
            action={() => navigate("/divination")}
          />
        </div>
        <div className="flex flex-row gap-2 items-end">
          {" "}
          or Search Your Friends!
        </div>
      </div>
    </>
  );
}
export default GalleryNoDiary;
