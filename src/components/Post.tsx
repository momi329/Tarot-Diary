import { formatTimestamp } from "../pages/Profile";
import cards from "../tarotcard/tarot-images";
import { AuthContext } from "../context/authContext";
import { useParams } from "react-router-dom";
import Viewer from "./Editor/Viewer";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import Editor from "./Editor/Editor";
import firebase from "../utils/firebase";

const tarot = cards.cards;
export function Post({ targetDiary, setTargetDiary, setDiaryData }) {
  const { user, userUID, isLogin } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [newEdit, setNewEdit] = useState();
  useEffect(() => {
    async function getUserDiary(userUID: string) {
      const docSnap = await firebase.getUserDiary(userUID);
      setDiaryData(docSnap);
    }
    if (!edit) {
      getUserDiary(userUID);
    }
  }, [edit]);

  const handleSave = async () => {
    await firebase.updateDiary(userUID, targetDiary.docId, newEdit);
    setTargetDiary({ ...targetDiary, content: newEdit });
    alert("更新成功");
    setEdit(false);
  };
  const onEditorContentChanged = (content) => {
    setNewEdit(content.markdown);
  };
  return (
    <div className='flex gap-4 flex-col w-[500px] p-4 fixed top-0 right-0 '>
      <div className='bg-yellow-100 p-3 relative'>
        <div
          className='absolute top-1 right-1 cursor-pointer'
          onClick={() => setTargetDiary(null)}
        >
          Close
        </div>
        <div
          className='absolute top-1 right-[50px] cursor-pointer'
          onClick={() => {
            edit ? handleSave() : setEdit(true);
          }}
        >
          {edit ? "Save" : "Edit"}
        </div>
        <p>{formatTimestamp(targetDiary.time)}</p>
        <h1>{targetDiary.question}</h1>
        <div className='flex flex-row gap-3 p-2'>
          {targetDiary.spread.map((card, i) => (
            <div className='w-[150px]' key={i}>
              <img
                src={tarot[card.card] && tarot[card.card].img}
                alt={tarot[card.card] && tarot[card.card].name}
              />
              {tarot[card.card] && tarot[card.card].name}
            </div>
          ))}
        </div>
        <p>
          AI解牌
          <br />
          {targetDiary.askGpt}
        </p>
        <br />
        心得筆記
        <br />
        {edit ? (
          <Editor
            value={targetDiary.content}
            onChange={onEditorContentChanged}
          />
        ) : (
          <Viewer value={targetDiary.content} />
        )}
      </div>
    </div>
  );
}
