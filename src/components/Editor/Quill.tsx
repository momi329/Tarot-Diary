import { useState, useReducer, useContext, useEffect } from "react";
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

export default function Quill({
  res,
  setRes,
  setEnd,
  article,
  setArticle,
  setAskAI,
  divining,
  dispatch,
}) {
  const { isLogin, user, userUID } = useContext(AuthContext);
  //const [editorMarkdownValue, setEditorMarkdownValue] = useState("");
  const initialMarkdownContent = res;
  const onEditorContentChanged = (content: EditorContentChanged) => {
    // setEditorHtmlValue(content.html);
    //setEditorMarkdownValue(content.markdown);
    setArticle({ ...article, content: content.markdown });
  };
  // useEffect(() => {
  //   console.log(article, "article");
  // }, [article]);
  const handleSave = () => {
    const newData = { ...article, time: Timestamp.fromDate(new Date()) };
    console.log(newData);
    async function userDiary(userUID, newData) {
      try {
        const docRef = doc(db, "users", userUID, "diary", article.docId);
        await updateDoc(docRef, newData);
        alert("儲存成功");
      } catch (e) {
        console.error("error", e);
      }
    }
    dispatch({ type: "preview" });
    userDiary(userUID, newData);
    setEnd(false);
    setAskAI(false);
    setRes("");
  };

  return (
    <div className=''>
      <Editor
        value={initialMarkdownContent}
        onChange={onEditorContentChanged}
      />
      <input onClick={handleSave} type='button' value='Save' />
      {/* <div>
        <textarea
          className='w-[45%] mr-[10px]'
          defaultValue={editorMarkdownValue}
          rows={5}
        />
        <textarea defaultValue={editorHtmlValue} rows={5} />
      </div> */}
      {/* {saveArticle === "Edit" && (
        <div className='border border-slate-400 p-1'>
          <Viewer value={editorMarkdownValue} />
        </div>
      )} */}
    </div>
  );
}
