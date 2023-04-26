import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "../../utils/firebase";
import { AuthContext } from "../../context/authContext";

import Editor, { EditorContentChanged } from "./Editor";
import Viewer from "./Viewer";
import {
  doc,
  setDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import Button from "../Button";

export default function Quill({
  res,
  setRes,
  setEnd,
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
    // async function userDiary(userUID, newData) {
    //   try {
    //     const docRef = doc(db, "users", userUID, "diary", article.docId);
    //     await updateDoc(docRef, newData);
    //     alert("儲存成功");
    //   } catch (e) {
    //     console.error("error", e);
    //   }
    // }
    dispatch({ type: "preview" });
    // userDiary(userUID, newData);
    setEnd(false);
    setAskAI(false);
    setRes("");
    navigate(`/profile/${userUID}`);
  };

  return (
    <div className='w-[100%] flex flex-col'>
      <Editor
        value={initialMarkdownContent}
        onChange={onEditorContentChanged}
      />
      <div className='self-end mt-2'>
        <Button action={handleSave} type={"small"} value={"Save"} />
      </div>
    </div>
  );
}
