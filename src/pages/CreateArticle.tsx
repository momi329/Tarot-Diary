import { AuthContext } from "../context/authContext";
import { useState, useContext } from "react";
import Editor, { EditorContentChanged } from "../components/Editor/Editor";
import {
  doc,
  setDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import firebase from "../utils/firebase";
var quillObj: any;
const diaryFormat = {
  card: "",
  content: "",
  reverse: "",
  askGpt: "",
  secret: "",
  time: "",
  spreadID: "",
};
function CreateArticle() {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const [newArticle, setNewArticle] = useState({ content: "", image: [] });
  const initialMarkdownContent = "";
  const onEditorContentChanged = (content) => {
    console.log(content.html);
    setNewArticle({ ...newArticle, content: content.html });
  };
  // const uploadImage = async (e) => {
  //   const files = e.target.files;
  //   console.log(e.target.files);
  //   const imageURL = await firebase.uploadImage(files, userUID);
  //   console.log(imageURL, "imageURL");
  //   //setNewArticle({ ...newArticle, image: imageURL });
  // };
  const handleSave = () => {
    const newData = {
      ...newArticle,
      userUID: userUID,
      time: Timestamp.fromDate(new Date()),
    };
    async function uploadArticle(userUID, newData) {
      await firebase.uploadArticle(userUID, newData);
    }
    uploadArticle(userUID, newData);
    setNewArticle({ content: "", image: [] });
  };

  function handleInput(event) {
    const content = event.target.innerText.replace(/\n/g, "<br/>");
    setNewArticle({ ...newArticle, content: content });
    //setNewArticle({ ...newArticle, content: event.target.textContent });
  }

  return (
    <div className='w-[400px] h-[500px] bg-slate-300 p-5 overscroll-y-auto'>
      <div className='flex flex-row'>
        <img
          src={user.image}
          alt={user.name}
          className='rounded-full w-10 h-10'
        />
        <div>
          <h1>{user.name}</h1>
          <select onChange={() => {}}>
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>
      </div>
      <div className='relative'>
        {newArticle.content === "" ? (
          <span className='absolute top-1'>請輸入內容...</span>
        ) : null}
        <div
          contentEditable='true'
          onInput={handleInput}
          className='w-[100%] h-[300px] text-black'
        />
      </div>
      <input
        // onChange={(e) => uploadImage(e)}
        type='file'
        value=''
        accept='image/*'
        multiple
      />
      <input onClick={handleSave} type='button' value='Save' />
    </div>
  );
}
export default CreateArticle;
