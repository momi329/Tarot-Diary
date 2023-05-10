import { AuthContext } from "../../context/authContext";
import { useState, useEffect, useContext } from "react";
import firebase from "../../utils/firebase";
import Button from "../../components/Button";
import Alert from "../../components/Alert";

function ProfileEdit() {
  const { user, userUID, setUser, alert, setAlert } = useContext(AuthContext);
  const [modify, setModify] = useState({
    image: user.image,
    name: user.name,
    sign: user.sign,
  });
  const updateUserData = async () => {
    await firebase.updateUserData(userUID, modify);
    setAlert(true);
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
    if (typeof url === "string") {
      setModify({ ...modify, image: url });
    }
  };
  const handleInputChange = (e, category) => {
    setModify({ ...modify, [category]: e.target.value });
  };
  return (
    <>
      {alert && (
        <Alert
          value={"Save Successfully!"}
          buttonValue={[
            {
              type: "little",
              value: "Confirm",
              action: () => {
                setTimeout(() => setAlert(false), 5000);
              },
            },
          ]}
        />
      )}
      <div className="font-NT text-yellow ">
        <div>
          <Button
            action={() => {
              updateUserData();
            }}
            type={"tiny"}
            value={"Save"}
          />
          <div className="flex flex-col mt-8 gap-4 justify-center mx-auto items-center">
            <div className="flex justify-center flex-col relative w-[150px] h-[150px]">
              <img
                src={modify.image}
                alt={modify.name}
                className="w-[100%] h-[100%] object-cover"
              />
              <label htmlFor="upload">
                <button
                  onClick={() => {
                    const uploadImage = document.getElementById("upload");
                    if (uploadImage) {
                      uploadImage.click();
                    }
                  }}
                  className="hover:underline bottom-0 bg-opacity-60
            absolute w-[100%] bg-darkPink z-10 pt-[2px]"
                >
                  {" "}
                  Upload Img{" "}
                </button>
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  inputImageChange(e);
                }}
                className="hidden w-[100%] absolute bottom-0 z-0"
              />
            </div>
            <div className="flex flex-col items-start shadowYellow tracking-widest w-[40%]">
              <p>Name</p>
              <div className="h-[1px] w-[100%] bg-yellow my-2" />
              <input
                maxLength={20}
                value={modify.name}
                onChange={(e) => handleInputChange(e, "name")}
                className={`w-[100%] p-2  bg-pink bg-opacity-20`}
              />
            </div>
            <div className="flex flex-col items-start shadowYellow tracking-widest w-[40%]">
              <p>Current Mood</p>
              <div className="h-[1px] w-[100%] bg-yellow my-2" />
              <input
                maxLength={20}
                value={modify.sign}
                onChange={(e) => handleInputChange(e, "sign")}
                className={`w-[100%] p-2  bg-pink bg-opacity-20`}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ProfileEdit;
