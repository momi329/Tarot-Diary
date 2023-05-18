import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import Moon from "../images/Moon";
import Star from "../images/Star";
import cards from "../tarotcard/tarot-images";
import firebase from "../utils/firebase";
import { formatTimestamp } from "../utils/function";
import { DiaryType } from "../utils/type";
import Editor from "./Editor/Editor";
import Viewer from "./Editor/Viewer";
const tarot = cards.cards;
type PostProps = {
  targetDiary: DiaryType | null;
  setTargetDiary: React.Dispatch<React.SetStateAction<DiaryType | null>>;
  setDiaryData: React.Dispatch<React.SetStateAction<DiaryType[]>>;
};
export function Post({ targetDiary, setTargetDiary, setDiaryData }: PostProps) {
  const { userUID } = useContext(AuthContext);
  const [edit, setEdit] = useState(false);
  const [newEdit, setNewEdit] = useState(targetDiary?.content);
  useEffect(() => {
    async function getUserDiary() {
      const docSnap = await firebase.getUserDiary(userUID);
      setDiaryData(docSnap as DiaryType[]);
    }
    if (!edit) {
      getUserDiary();
    }
  }, [edit]);

  const handleSave = async () => {
    await firebase.updateDiary(userUID, targetDiary?.docId, {
      ...targetDiary,
      content: newEdit,
    });
    if (!targetDiary) return;
    setTargetDiary({ ...targetDiary, content: newEdit });
    setEdit(false);
  };
  const onEditorContentChanged = (content) => {
    setNewEdit(content.markdown);
  };
  return (
    <div
      className="fixed w-screen h-screen top-0 left-0  z-10
    flex items-center justify-center  "
    >
      <div
        className="bg-black bg-opacity-80  w-screen h-screen top-0 left-0 fixed"
        onClick={() => setTargetDiary(null)}
      />
      <div
        className=" gap-4 flex-col w-[45%] h-[80%] p-4 
     z-20 overflow-y-scroll overscroll-contain rounded-xl "
      >
        <div
          className="bg-pink bg-opacity-30 
      p-4 relative "
        >
          <div
            className="absolute top-4 right-5 cursor-pointer text-gold text-2xl font-notoSansJP font-light"
            onClick={() => setTargetDiary(null)}
          >
            X
          </div>
          <div
            className="absolute top-6 right-[50px] cursor-pointer text-yellow hover:underline"
            onClick={() => {
              edit ? handleSave() : setEdit(true);
            }}
          >
            {edit ? "Save" : "Edit"}
          </div>

          <div className="flex flex-row p-2 gap-2">
            <Moon color={"#9F8761"} width={"47px"} height={"52px"} />
            <h1
              className="ml-4 mt-4 mb-4 font-notoSansJP font-normal
         text-xl text-yellow  tracking-widest"
            >
              {targetDiary?.question}
            </h1>
            <p
              className="font-notoSansJP text-gray shadowGray self-center 
                  leading-normal tracking-wider  font-light "
            >
              ・{formatTimestamp(targetDiary?.time)}
            </p>
          </div>
          <div className="flex flex-row gap-3 justify-center p-2">
            {targetDiary?.spread
              .filter((value) => typeof value !== "number")
              .map((q, i) => {
                if (typeof q !== "number") {
                  return (
                    <div
                      className="sm:scale-90 w-[130px] text-yellow font-NT tracking-wider shadowYellow"
                      key={i}
                    >
                      <img
                        src={(q.card && tarot[q.card].img) || ""}
                        alt={(q.card && tarot[q.card].name) || ""}
                        className={`opacity-70 z-0 ${
                          q.reverse ? "rotate-180" : ""
                        }`}
                      />
                      <p className="mt-3">{q.card && tarot[q.card].name}</p>
                      <p className="text-sm font-notoSansJP font-light tracking-widest">
                        {q.value}
                      </p>
                    </div>
                  );
                }
                return <></>;
              })}
          </div>
          <span className="flex flex-row justify-between mt-8 mb-9">
            <div className="flex flex-col w-[48%] items-center">
              <p className="ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg">
                Ask AI
              </p>
              <p className="ml-3 text-sm font-notoSansJP leading-6 text-gray">
                {" "}
                {targetDiary.askGpt}
              </p>
            </div>
            <div className="flex flex-col gap-2 justify-between items-center ">
              <Star color={"#E18EA5"} />
              <div className="my-3 w-[1px] bg-pink h-[100%]" />
              <Star color={"#E18EA5"} />
            </div>
            <div className="flex flex-col w-[48%] items-center">
              <p className="ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg">
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
                  className="flex flex-row items-center ml-2 my-3 text-sm"
                  key={q}
                >
                  <img
                    src={comment.userImg}
                    alt={comment.user}
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="font-notoSansJP font-normal  ml-4 text-yellow tracking-widest w-[25%]">
                    {comment.userName}
                  </p>
                  <p className="font-notoSansJP font-light text-yellow tracking-widest flex-grow">
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
