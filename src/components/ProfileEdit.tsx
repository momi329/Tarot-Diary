import { AuthContext } from "../context/authContext";
import { useState, useEffect, useContext } from "react";
import firebase from "../utils/firebase";
import Button from "./Button";

function ProfileEdit() {
  const { isLogin, user, userUID, setUser } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [modify, setModify] = useState({
    image: user.image,
    name: user.name,
    sign: user.sign,
  });
  const updateUserData = async () => {
    await firebase.updateUserData(userUID, modify);
    alert("成功！");
    setEdit(false);
    setUser({
      ...user,
      name: modify.name,
      image: modify.image,
      sign: modify.sign,
    });
  };
  const inputImageChange = async (e) => {
    const file: File | null = e.target.files[0];
    const url = await firebase.uploadUserImage(userUID, file);
    console.log(url);
    if (typeof url === "string") {
      setModify({ ...modify, image: url });
    }
  };
  const handleInputChange = (e, category) => {
    setModify({ ...modify, [category]: e.target.value });
  };
  return (
    <div className='font-sygma text-yellow '>
      <div>
        <Button
          action={() => {
            edit ? updateUserData() : setEdit(true);
          }}
          type={"tiny"}
          value={edit ? "Save" : "Edit"}
        />
        <div className='flex flex-col mt-8 gap-4 justify-center mx-auto items-center'>
          <div className='flex justify-center flex-col relative w-[150px] h-[150px]'>
            <img
              src={modify.image}
              alt={modify.name}
              className='w-[100%] h-[100%] object-cover'
            />
            <label htmlFor='upload'>
              <button
                disabled={!edit}
                onClick={() => {
                  const uploadImage = document.getElementById("upload");
                  if (uploadImage) {
                    uploadImage.click();
                  }
                }}
                className='hover:underline bottom-0 bg-opacity-60
            absolute w-[100%] bg-darkPink z-10 pt-[2px]'
              >
                {" "}
                Upload Img{" "}
              </button>
            </label>
            <input
              id='upload'
              type='file'
              accept='image/*'
              onChange={(e) => {
                inputImageChange(e);
              }}
              className='hidden w-[100%] absolute bottom-0 z-0'
            />
          </div>
          <div className='flex flex-col items-start shadowYellow tracking-widest w-[40%]'>
            <p>Name</p>
            <div className='h-[1px] w-[100%] bg-yellow my-2' />
            <input
              value={modify.name}
              disabled={!edit}
              onChange={(e) => handleInputChange(e, "name")}
              className={`w-[100%] p-2 ${!edit ? "" : "bg-pink bg-opacity-20"}`}
            />
          </div>
          <div className='flex flex-col items-start shadowYellow tracking-widest w-[40%]'>
            <p>Sign</p>
            <div className='h-[1px] w-[100%] bg-yellow my-2' />
            <input
              value={modify.sign}
              disabled={!edit}
              onChange={(e) => handleInputChange(e, "sign")}
              className={`w-[100%] p-2 ${!edit ? "" : "bg-pink bg-opacity-20"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileEdit;
