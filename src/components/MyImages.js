import { useState, useEffect } from "react";
import { createApi } from "unsplash-js";
import { FiX } from "react-icons/fi";
import { FiChevronLeft } from "react-icons/fi";
import { FiImage } from "react-icons/fi";
import { FiSearch } from "react-icons/fi";
const Key = process.env.REACT_APP_UNSPLASH_API_KEY;
function MyImages({ onSave, setOnSave }) {
  const [photos, setPhotos] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const fetchPhotos = async (search) => {
    console.log("hi", Key);
    const unsplash = createApi({ accessKey: Key });
    unsplash.photos
      .getRandom({
        count: 15,
        page: 1,
        query: search,
        orientation: "landscape",
      })
      .then((result) => {
        if (result.errors) {
          // handle error here
          console.log("error occurred: ", result.errors[0]);
        } else {
          // handle success here
          const photo = result.response;
          setPhotos(photo);
          console.log(photo);
        }
      });
  };
  useEffect(() => {
    fetchPhotos("spirit");
  }, [isOpen]);
  //暫時關掉
  const chooseImg = (img) => {
    setOnSave({ ...onSave, image: img });
    return;
  };
  const searchImg = (e) => {
    if (e.key === "Enter") {
      fetchPhotos(input);
    }
  };
  // if (!photos) return;
  return (
    <>
      <div
        className='w-[500px] h-[250px] border-2 relative bg-cover bg-center'
        style={{ backgroundImage: `url(${onSave.image})` }}
      >
        <FiImage
          className='w-5 h-5 absolute top-1 right-1'
          onClick={() => {
            setIsOpen(true);
          }}
        />
        {isOpen && (
          <div
            className='w-[350px]  flex flex-wrap flex-col  
          p-4 pt-1 bg-slate-200 absolute top-0 right-0 z-30 '
          >
            <div
              className='w-[100%] flex flex-wrap  flex-row items-center 
            justify-between p-3 mb-3 border-b-[1px] border-slate-300'
            >
              <FiChevronLeft className='w-5 h-5' />
              <div className='tracking-wide'>更換背景</div>
              <FiX
                className='w-5 h-5'
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </div>
            <div className='w-[100%] relative'>
              <FiSearch className='absolute top-3 left-2 text-slate-400' />
              <input
                className='w-[100%] p-2  mb-3 pl-7'
                placeholder='Search'
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  searchImg(e);
                }}
              />
            </div>

            <div className='h-[400px] flex flex-wrap justify-center gap-2  overflow-auto '>
              {photos &&
                photos.map((photo) => (
                  <>
                    <div
                      key={photo.id}
                      className='w-[140px] h-[100px] object-contain rounded-ms hover:opacity-80 bg-cover bg-center relative cursor-pointer'
                      style={{ backgroundImage: `url(${photo.urls.regular})` }}
                      onClick={() => {
                        chooseImg(photo.urls.regular);
                      }}
                    >
                      <div className='w-[100%] absolute bottom-0 p-[4px] pl-2 bg-slate-900 text-white  underline-offset-1 opacity-0 hover:opacity-80'>
                        <a href={photo.links.html} className=' text-xs'>
                          {photo.user.name}
                        </a>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MyImages;
