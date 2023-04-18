import { AuthContext } from "../context/authContext";
import { useState, useEffect, useContext } from "react";
import firebase from "../utils/firebase";

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
    <div>
      <div>
        <button
          onClick={() => {
            edit ? updateUserData() : setEdit(true);
          }}
        >
          {edit ? "Save" : "Edit"}
        </button>
        <img
          src={modify.image}
          alt={modify.name}
          className='w-[80px] h-[80px] object-cover'
        />
        <button>Upload Img</button>
        <input
          type='file'
          disabled={!edit}
          onChange={(e) => {
            inputImageChange(e);
          }}
        />
        <input
          value={modify.name}
          disabled={!edit}
          onChange={(e) => handleInputChange(e, "name")}
        />
        <input
          value={modify.sign}
          disabled={!edit}
          onChange={(e) => handleInputChange(e, "sign")}
        />
      </div>
    </div>
  );
}
export default ProfileEdit;
