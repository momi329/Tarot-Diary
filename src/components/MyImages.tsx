import React, { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FiImage, FiSearch, FiX } from "react-icons/fi";
import { createApi } from "unsplash-js";
import { Random } from "unsplash-js/dist/methods/photos/types";
import { DesignSpreadData } from "../utils/type";
const Key = process.env.REACT_APP_UNSPLASH_API_KEY;
type MyImagesProps = {
  onSave: DesignSpreadData;
  setOnSave: React.Dispatch<React.SetStateAction<DesignSpreadData>>;
};
function MyImages({ onSave, setOnSave }: MyImagesProps) {
  const [photos, setPhotos] = useState<null | Random[] | Random>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const fetchPhotos = async (search) => {
    const unsplash = createApi({ accessKey: Key } as any);
    unsplash.photos
      .getRandom({
        count: 26,
        query: search,
        orientation: "portrait",
      })
      .then((result) => {
        if (result.errors) {
          window.alert(`An error occurred: ${result.errors}`);
        } else {
          const photo = result.response;
          setPhotos(photo);
        }
      });
  };
  useEffect(() => {
    fetchPhotos(" flowers dark background ");
  }, [isOpen]);
  const chooseImg = (img) => {
    setOnSave({ ...onSave, image: img });
  };
  const searchImg = (e) => {
    if (e.key === "Enter") {
      fetchPhotos(input);
    }
  };
  return (
    <>
      <div
        className="w-[100%] h-[316px] bg-backdrop-blur-sm bg-white/20 z-10
         border-[1px] border-yellow relative bg-cover bg-center  "
        style={{ backgroundImage: `url(${onSave.image})` }}
      >
        <AiOutlinePlus
          className="text-yellow top-1 absolute  w-[30px] h-[30px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <span className="absolute left-6 top-[6px] tracking-widest ml-2 font-NT text-lg text-yellow shadowYellow">
          Choose Your Main Picture
        </span>
        {isOpen ? (
          <div
            className="w-[350px]  flex flex-wrap flex-col  text-yellow
          p-4 pt-1 bg-darkPink bg-opacity-90 absolute top-0 right-0 z-40 "
          >
            <div
              className="w-[100%] flex flex-wrap  flex-row items-center 
            justify-between p-3 mb-3 border-b-[1px] border-slate-300"
            >
              <div className="tracking-widest ml-2 font-NT text-lg shadowYellow">
                Change Main Picture
              </div>
              <FiX
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </div>
            <div className="w-[100%] h-[60px] relative group  mb-3 ">
              <FiSearch className="absolute top-4 left-2 text-yellow" />
              <div className="absolute bottom-3 h-[2px]  bg-yellow/50 w-0 group-hover:w-full duration-500"></div>
              <input
                className="w-[100%] pl-9  text-yellow bg-pink/40 pt-3 outline outline-0 pb-3
               border-yellow  tracking-wider placeholder:text-gray placeholder:opacity-75 hover:bg-pink/0 duration-500"
                placeholder="Search"
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  searchImg(e);
                }}
              />
            </div>

            <div className="h-[400px] flex flex-wrap justify-center gap-2  overflow-auto ">
              {photos &&
                (photos as Random[]).map((photo) => (
                  <>
                    <div
                      key={photo.id}
                      className="w-[140px] h-[100px] object-contain rounded-ms hover:scale-110 bg-cover bg-center relative cursor-pointer"
                      style={{ backgroundImage: `url(${photo.urls.regular})` }}
                      onClick={() => {
                        chooseImg(photo.urls.regular);
                        setIsOpen(false);
                      }}
                    >
                      <div className="w-[100%] absolute bottom-0 p-[4px] pl-2 bg-darkPink text-white  underline-offset-1 opacity-0 hover:scale-110">
                        <a href={photo.links.html} className=" text-xs">
                          {photo.user.name}
                        </a>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </div>
        ) : (
          <FiImage
            className="w-6 h-6 absolute top-1 right-1 text-yellow opacity-90 cursor-pointer"
            onClick={() => {
              setIsOpen(true);
            }}
          />
        )}
      </div>
    </>
  );
}

export default MyImages;
