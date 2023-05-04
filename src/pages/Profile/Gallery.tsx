import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

import firebase from "../../utils/firebase";
import cards from "../../tarotcard/tarot-images";

import SpreadPreview from "../../components/SpreadPreview";
import { SpreadPlace } from "../Spread/SpreadPlace";
import { formatTimestamp } from "./Profile";
import Viewer from "../../components/Editor/Viewer";
import Editor from "../../components/Editor/Editor";
import CommentAndLike from "../../components/CommentAndLike";
//svg
import Button from "../../components/Button";
import Star from "../../images/Star";
import Loading from "../../components/Loading";
//type
import type { SpreadData, VisitedUser } from "../../utils/type";
import LoadingPage from "../LoadingPage";
import Moon from "../../images/Moon";
import Alert from "../../components/Alert";

const Gallery = ({
  visitedUserRef,
  friendsPostsRef,
  visitedUser,
  setVisitedUser,
  userDiary,
  uid,
  userUID,
  friendsPosts,
  setFriendsPosts,
  page,
}) => {
  const postsLength = [...friendsPosts];
  const [edit, setEdit] = useState(postsLength.fill(false));
  const [newEdit, setNewEdit] = useState({ secret: false, content: "" });
  const [commentChange, setCommentChange] = useState({
    user: "",
    userName: "",
    userImage: "",
    comment: "",
  });
  const { user, loading, setLoading, alert, setAlert } =
    useContext(AuthContext);
  const [data, setData] = useState<SpreadData[] | VisitedUser[] | []>([]);
  const tarot = cards.cards;
  const navigate = useNavigate();
  useEffect(() => {
    let post;
    if (page === 3 && userUID === uid && friendsPostsRef) {
      console.log("userDiary");
      post = userDiary.slice(0, 5);
      setData(post);
    } else if (page === 1 && userUID === uid && friendsPostsRef) {
      console.log("friendsPostsRef.current", friendsPostsRef.current);
      post = friendsPostsRef.current.slice(0, 5);
      setData(post);
      // post = friendsPosts.slice(0, 5);
      // setData(post);
      // setTimeout(() => setLoading(false), 3000);
    } else if (visitedUser.length !== 0) {
      if (visitedUser) {
        post = visitedUserRef.current.diary.slice(0, 5);
        setData(post);
        console.log("visitedUser", visitedUser);
        // post = visitedUser.diary.slice(0, 5);
        // setData(post);
        // setTimeout(() => setLoading(false), 3000);
      }
    }
  }, [
    uid,
    userUID,
    userDiary,
    friendsPostsRef.current,
    visitedUserRef.current,
  ]);
  useEffect(() => {
    if (!data) return;
    setTimeout(() => setLoading(false), 3000);
  }, [data]);
  const handleSave = async (index) => {
    await firebase.updateDiary(userUID, data[index].docId, newEdit);
    data[index].content = newEdit.content;
    // alert("更新成功");
    const newData = [...edit];
    newData[index] = false;
    setEdit(newData);
  };
  const onEditorContentChanged = (content) => {
    setNewEdit({ ...newEdit, content: content.markdown });
  };
  const handleEdit = (index, secret) => {
    const newData = [...edit];
    newData[index] = true;
    setEdit(newData);
    setNewEdit({ ...newEdit, secret: secret });
    return;
  };
  const DeletePost = async (userUID, docID, index) => {
    console.log("userUID, docID, index", userUID, docID, index);

    await firebase.deleteDiary(userUID, docID);
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
    friendsPostsRef.current.splice(index, 1);
    console.log(friendsPostsRef.current, " friendsPostsRef.current");
    setAlert(false);
  };
  const seeMore = () => {
    setLoading(true);
    const more = data.length + 5;
    if (uid === userUID && page === 3) {
      setData(userDiary.slice(0, more));
      setLoading(false);
    }
    if (uid === userUID && page === 1) {
      setData(friendsPostsRef.current.slice(0, more));
      setLoading(false);
    } else {
      setData(visitedUserRef.current.diary.slice(0, more));
      setLoading(false);
    }
  };
  if (data.length === 0)
    return (
      <div className='flex gap-4 flex-col  w-[100%] animate-pulse'>
        <div className='bg-yellow-100 px-6 py-5 relative  bg-pink bg-opacity-30 h-[400px]'>
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row  align-center '>
              <div className='rounded-full w-[50px] h-[50px] mr-[16px] bg-yellow/20' />
              <div className=' w-40 h-4 self-center bg-gray/20 rounded-sm  w-40 h-4' />
              <div
                className='font-NT bg-gray rounded-sm shadowGray self-center 
                  leading-normal tracking-widest mt-1'
              />
            </div>
          </div>
          <div className='w-[100%] h-[1px] bg-white/20 mt-3 ' />
          <div className=' w-[90%] h-4 self-center bg-white/20 rounded-sm   h-4 m-4 mt-7' />
          <div className=' w-80 h-4 self-center bg-gray/20 rounded-sm  h-4 m-4' />
          <div className=' w-96 h-4 self-center bg-white/20 rounded-sm   h-4 m-4' />
          <div className=' w-[90%] h-4 self-center bg-gray/20 rounded-sm   h-4 m-4' />
          <div className=' w-96 h-4 self-center bg-gray/20 rounded-sm   h-4 m-4' />
          <div className='w-[90%] h-4 bg-white/20 mt-3 m-4' />
          <div className=' w-96 h-4 self-center bg-white/20 rounded-sm   h-4 m-4' />
          <div className=' w-[90%] h-4 self-center bg-gray/20 rounded-sm   h-4 m-4' />
        </div>
      </div>
    );
  return (
    <>
      <div className='flex gap-4 flex-col  w-[100%] '>
        {data.map((item, index) => (
          <div
            key={index}
            className='bg-yellow-100 px-6 py-5 relative  bg-pink bg-opacity-30 '
          >
            <div className='flex flex-row justify-between items-center'>
              {item.user && (
                <Link to={`/profile/${item.user}`}>
                  <div className='flex flex-row  align-center '>
                    <img
                      src={item.userName && item.userImg}
                      alt={item.userName}
                      className='rounded-full w-[50px] h-[50px] mr-[16px]'
                    />
                    <p className='font-notoSansJP text-yellow self-center'>
                      {item.userName}
                    </p>
                    <p
                      className='font-NT text-gray shadowGray self-center 
                  leading-normal tracking-widest mt-1'
                    >
                      ・{formatTimestamp(item.time)}
                    </p>
                  </div>
                </Link>
              )}
              {/* 自己的貼文才能編輯 */}
              {userUID === item.user && item.docId && (
                <>
                  <div
                    className='absolute top-[100px] right-6 cursor-pointer inline-flex
                  font-NT text-yellow text-xl '
                    onClick={() => {
                      edit[index]
                        ? handleSave(index)
                        : handleEdit(index, item.secret);
                    }}
                  >
                    {edit[index] ? "Save" : "Edit"}
                  </div>
                  <div
                    className='absolute top-[100px] right-[75px] cursor-pointer font-NT text-gold text-xl'
                    onClick={() => {
                      setAlert(true);
                      console.log(index);
                    }}
                  >
                    Delete
                  </div>
                  {!edit[index] && alert && (
                    <Alert
                      value={"Are you sure you want to delete?"}
                      buttonValue={[
                        {
                          value: "Cancel",
                          type: "little",
                          action: () => setAlert(false),
                        },
                        {
                          value: "Confirm",
                          type: "littlePink",
                          action: () => {
                            DeletePost(userUID, item.docId, index);
                          },
                        },
                      ]}
                    />
                  )}
                  {edit[index] ? (
                    <select
                      className='outline-none font-NT text-yellow pl-2 pr-20 bg-green ml-auto  
                 w-[30%] h-[38px] pt-1 text-base item-end bg-opacity-90 rounded-md tracking-widest inline-block'
                      disabled={!edit[index]}
                      onChange={(e) => {
                        setNewEdit({
                          ...newEdit,
                          secret: e.target.value === "true",
                        });
                      }}
                      value={item.secret ? "true" : "false"}
                    >
                      <option value='false'>Public</option>
                      <option value='true'>Private</option>
                    </select>
                  ) : (
                    <div
                      className='font-NT text-yellow tracking-widest shadowYellow text-base flex 
                    flex-row items-center justify-center'
                    >
                      {item.secret ? "Private" : "Public"}・
                      <div className='pb-[2px]'>
                        <Moon color={"#9F8761"} width={20} height={20} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            {item.user && (
              <div className='w-[100%] h-[1px] bg-white bg-opacity-40  mt-3 ' />
            )}
            {item.question ? (
              <>
                <h1 className='ml-4 mt-4 mb-4 h-4 pb-10 font-notoSansJP text-base text-yellow font-normal tracking-widest'>
                  {item.question === "" ? "" : item.question}
                </h1>

                {item.spread.includes(0) ? (
                  <SpreadPlace type={item} tarot={tarot} size={"medium"} />
                ) : (
                  <div className='gap-2 flex-row flex   w-[100%] flex-wrap justify-center'>
                    {item.spread.map((q, i) => (
                      <div
                        className='w-[130px] text-yellow font-NT tracking-wider shadowYellow '
                        key={i}
                      >
                        <img
                          src={tarot[q.card] && tarot[q.card].img}
                          alt={tarot[q.card] && tarot[q.card].name}
                          className={`opacity-70 z-0  ${
                            q.card.reserve ? "rotate-180" : ""
                          }`}
                        />
                        <p className='mt-3'>
                          {tarot[q.card] && tarot[q.card].name}
                        </p>
                        <p className='text-sm font-notoSansJP font-light tracking-widest'>
                          {q.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <span className='flex flex-row justify-between mt-8'>
                  <div className='flex flex-col w-[48%] items-center'>
                    <p className='ml-3 mb-2 shadowYellow text-yellow font-NT  tracking-wider text-lg'>
                      Ask AI
                    </p>
                    <p className='ml-3 text-sm font-notoSansJP leading-6 text-gray'>
                      {" "}
                      {item.askGpt}
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
                    {edit[index] ? (
                      <Editor
                        value={item.content}
                        onChange={onEditorContentChanged}
                      />
                    ) : (
                      <Viewer value={item.content} />
                    )}
                  </div>
                </span>
                <CommentAndLike
                  item={item}
                  index={index}
                  user={user}
                  uid={uid}
                  commentChange={commentChange}
                  userUID={userUID}
                  setCommentChange={setCommentChange}
                  friendsPosts={friendsPosts}
                  setFriendsPosts={setFriendsPosts}
                  page={page}
                  visitedUser={visitedUser}
                  setVisitedUser={setVisitedUser}
                />
              </>
            ) : (
              <div>
                {item.user && (
                  <div className='flex flex-row m-2 align-center  '>
                    <SpreadPreview type={"personal"} spread={item} index={0} />

                    <p className='flex-end w-[60%] flex-grow-1 m-2 text-yellow  ml-5'>
                      <p className='text-lg mb-2'>
                        我新增了一個 {item.title}牌陣<br></br>趕快來占卜喔！
                      </p>
                      <span className='text-gray'>
                        {" "}
                        {item.description && item.description.slice(0, 60)}...
                      </span>
                      <span
                        className='hover:underline text-pink cursor-pointer'
                        onClick={() => navigate(`/spread/${item.spreadId}`)}
                      >
                        See more
                      </span>
                    </p>
                  </div>
                )}
                <CommentAndLike
                  item={item}
                  index={index}
                  user={user}
                  uid={uid}
                  commentChange={commentChange}
                  userUID={userUID}
                  setCommentChange={setCommentChange}
                  friendsPosts={friendsPosts}
                  setFriendsPosts={setFriendsPosts}
                  page={page}
                  visitedUser={visitedUser}
                  setVisitedUser={setVisitedUser}
                />
              </div>
            )}
          </div>
        ))}
        <div className='w-full flex items-center justify-center mt-7 mb-10'>
          {loading ? (
            <Loading text={"Loading"} />
          ) : (
            <Button
              type={"big"}
              value={"See More"}
              action={() => {
                seeMore();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default Gallery;
