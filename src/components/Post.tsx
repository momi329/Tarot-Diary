import { formatTimestamp } from "../pages/Profile/Profile";
import cards from "../tarotcard/tarot-images";
import { AuthContext } from "../context/authContext";
import Viewer from "./Editor/Viewer";
import { useState, useEffect, useContext } from "react";
import Editor from "./Editor/Editor";
import firebase from "../utils/firebase";
import Star from "../images/Star";
import Moon from "../images/Moon";
import { SpreadPlace } from "../pages/Spread/SpreadPlace";
const tarot = cards.cards;
export function Post({ targetDiary, setTargetDiary, setDiaryData }) {
  const { user, userUID, isLogin } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [newEdit, setNewEdit] = useState(targetDiary.content);
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
    console.log(targetDiary);
    await firebase.updateDiary(userUID, targetDiary.docId, {
      ...targetDiary,
      content: newEdit,
    });
    setTargetDiary({ ...targetDiary, content: newEdit });
    alert("更新成功");
    setEdit(false);
  };
  const onEditorContentChanged = (content) => {
    console.log(content.markdown);
    setNewEdit(content.markdown);
  };
  return (
    <div
      className='fixed w-screen h-screen top-0 left-0  z-10
    flex items-center justify-center  bg-black bg-opacity-80'
    >
      <div
        className=' gap-4 flex-col w-[45%] h-[80%] p-4 
     z-20 overflow-y-scroll overscroll-contain rounded-xl '
      >
        <div
          className='bg-pink bg-opacity-30 
      p-4 relative '
        >
          <div
            className='absolute top-4 right-5 cursor-pointer text-gold text-2xl font-notoSansJP font-light'
            onClick={() => setTargetDiary(null)}
          >
            X
          </div>
          <div
            className='absolute top-6 right-[50px] cursor-pointer text-yellow hover:underline'
            onClick={() => {
              edit ? handleSave() : setEdit(true);
            }}
          >
            {edit ? "Save" : "Edit"}
          </div>

          <div className='flex flex-row p-2 gap-2'>
            <Moon color={"#9F8761"} width={"47px"} height={"52px"} />
            <h1
              className='ml-4 mt-4 mb-4 font-notoSansJP font-normal
         text-xl text-yellow  tracking-widest'
            >
              {targetDiary.question}
            </h1>
            <p
              className='font-notoSansJP text-gray shadowGray self-center 
                  leading-normal tracking-wider  font-light '
            >
              ・{formatTimestamp(targetDiary.time)}
            </p>
          </div>
          <div className='flex flex-row gap-3 justify-center p-2'>
            {!targetDiary.spread.includes(0) ? (
              targetDiary.spread.map((q, i) => (
                <div
                  className='w-[130px] text-yellow font-NT tracking-wider shadowYellow '
                  key={i}
                >
                  <img
                    src={tarot[q.card] && tarot[q.card].img}
                    alt={tarot[q.card] && tarot[q.card].name}
                    // className={`opacity-70 z-0  ${
                    //   q.card.reserve ? "rotate-180" : ""
                    // }`}
                  />
                  <p className='mt-3'>{tarot[q.card] && tarot[q.card].name}</p>
                  <p className='text-sm font-notoSansJP font-light tracking-widest'>
                    {q.value}
                  </p>
                </div>
              ))
            ) : (
              <SpreadPlace type={targetDiary} tarot={tarot} size={"medium"} />
            )}
          </div>
          <span className='flex flex-row justify-between mt-8 mb-9'>
            <div className='flex flex-col w-[48%] items-center'>
              <p className='ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg'>
                Ask AI
              </p>
              <p className='ml-3 text-sm font-notoSansJP leading-6 text-gray'>
                {" "}
                {targetDiary.askGpt}
              </p>
            </div>
            <div className='flex flex-col gap-2 justify-between items-center '>
              <Star color={"#E18EA5"} />
              <div className='my-3 w-[1px] bg-pink h-[100%]' />
              <Star color={"#E18EA5"} />
            </div>
            <div className='flex flex-col w-[48%] items-center'>
              <p className='ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg'>
                Memo
              </p>

              {edit ? (
                <Editor
                  value={targetDiary.content}
                  onChange={onEditorContentChanged}
                />
              ) : (
                <Viewer value={targetDiary.content} />
              )}
            </div>
          </span>
          {targetDiary.comment &&
            targetDiary.comment.map((comment, q) => (
              <>
                <div
                  className='flex flex-row items-center ml-2 my-3 text-sm'
                  key={q}
                >
                  <img
                    src={comment.userImage}
                    alt={comment.user}
                    className='w-8 h-8 rounded-full'
                  />
                  <p className='font-notoSansJP font-normal  ml-4 text-yellow tracking-widest w-[25%]'>
                    {comment.userName}
                  </p>
                  <p className='font-notoSansJP font-light text-yellow tracking-widest flex-grow'>
                    {comment.comment}
                  </p>
                </div>
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
