import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../../utils/firebase";
import { AuthContext } from "../../context/authContext";

import Editor, { EditorContentChanged } from "./Editor";

import { Timestamp } from "firebase/firestore";
import Button from "../Button";

export default function Quill({
  res,
  setRes,
  divinedData,
  setDivinedData,
  setAskAI,
  divining,
  dispatch,
}) {
  const { userUID } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialMarkdownContent = res;
  const onEditorContentChanged = (content: EditorContentChanged) => {
    setDivinedData({ ...divinedData, content: content.markdown });
  };
  async function createDivinedData(data, userUID) {
    const docId = await firebase.newDivinedData(data, userUID);
    console.log(docId, "docId");
    if (docId) {
      setDivinedData({ ...data, docId: docId });
    } else {
      console.log("error no docId");
    }
  }
  const handleSave = () => {
    const newData = { ...divinedData, time: Timestamp.fromDate(new Date()) };
    createDivinedData(newData, userUID);
    dispatch({ type: "preview" });
    // userDiary(userUID, newData);
    setAskAI(false);
    setRes("");
    navigate(`/profile/${userUID}`);
  };

  return (
    <div className='w-[100%]  flex flex-col justify-center items-center'>
      <p className='text-gray text-sm tracking-widest  self-start  mb-3'>
        記得按下儲存，才能紀錄占卜結果喔！
      </p>
      <Editor
        value={initialMarkdownContent}
        onChange={onEditorContentChanged}
      />

      <div className='self-end mt-2 animate-bounce '>
        <Button action={handleSave} type={"small"} value={"Save"} />
      </div>
    </div>
  );
}
