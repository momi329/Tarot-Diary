import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { DocumentData } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import Diary from "../components/Diary";
import firebase from "../utils/firebase";
import cards from "../tarotcard/tarot-images";
import Viewer from "../components/Editor/Viewer";
import Member from "./Member";
import Editor from "../components/Editor/Editor";
import ProfileEdit from "../components/ProfileEdit";
import CommentAndLike from "../components/CommentAndLike";
import Button from "../components/Button";
import Star from "../images/Star";

import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
interface VisitedUser {
  name?: string;
  image?: string;
  sign?: string;
  favorite?: [];
  followers?: string[];
  following?: string[];
  diary?: DocumentData[];
  spread?: DocumentData[];
  userUID?: string;
}
function Profile(): JSX.Element {
  const { isLogin, user, userUID, signOut, signIn } = useContext(AuthContext);
  const [userDesign, setUserDesign] = useState<DocumentData[] | never[]>([]);
  const [userDiary, setUserDiary] = useState<DocumentData[] | never[]>([]);
  const [page, setPage] = useState<Number>(1);
  const [visitedUser, setVisitedUser] = useState<VisitedUser | []>([]);
  const { uid } = useParams();
  const [friendsPosts, setFriendsPosts] = useState<DocumentData[] | never[]>(
    []
  );
  useEffect(() => {
    initialFollowing();
  }, [userUID]);
  const initialFollowing = () => {
    if (uid) {
      setFollowing(user.followers.includes(uid));
    } else {
      setFollowing(false);
    }
  };
  const [following, setFollowing] = useState<boolean>(false);

  async function getUserDesignAndDiary(userUID: string) {
    const spread = await firebase.getUserDesign(userUID);
    const diary = await firebase.getOtherUserDiary(userUID);
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    setUserDesign(spread);
    setUserDiary(diary);
  }
  async function getOtherUserDiaryAndSpread(uid) {
    const profile = await firebase.getProfile(uid);
    const diary = await firebase.getOtherUserDiary(uid);
    const spread = await firebase.getOtherUserSpread(uid);
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    // spread.sort(function (a, b) {
    //   return a.time.seconds - b.time.seconds;
    // });
    if (diary && spread) {
      setVisitedUser({
        ...profile,
        userUID: uid,
        diary: diary,
        spread: spread,
      });
    }
  }
  async function getAllFollowingDiaryAndSpread(user) {
    const allDiary = await firebase.getAllFollowingDiary(user);
    const spread = await firebase.getAllFollowingSpread(user);
    const allDiaryAndSpread = [...allDiary, ...spread];
    console.log("allDiary", allDiary);
    console.log("spread", spread);

    allDiaryAndSpread &&
      (await allDiaryAndSpread
        .sort(function (a, b) {
          return a.time.seconds - b.time.seconds;
        })
        .reverse());
    setFriendsPosts(allDiaryAndSpread);
  }
  async function getAllFollowingSnapShop(user) {
    const allPerson = [...user.following, user.userUID];
    let allData: DocumentData[] = [];
    allPerson.map(async (person) => {
      const docRef = doc(db, "users", person);
      const getFollowingUser = await getDoc(docRef);
      const followingUser: any = getFollowingUser.data();
      const q = query(
        collection(db, "users", person, "diary"),
        where("secret", "==", false)
      );
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added" && change.doc.data().time) {
            const newDocData = {
              ...change.doc.data(),
              user: followingUser.userUID,
              userImg: followingUser.image,
              userName: followingUser.name,
            };
            setFriendsPosts((prev) => [newDocData, ...prev]);

            // allData.push(newDocData);
          }
        });
      });
    });
    allPerson.map(async (person) => {
      const docRef = doc(db, "users", person);
      const getFollowingUser = await getDoc(docRef);
      const followingUser: any = getFollowingUser.data();
      const q = query(
        collection(db, "spreads"),
        where("userUID", "==", person)
      );
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added" && change.doc.data().time) {
            const newDocData = {
              ...change.doc.data(),
              user: person,
              userImg: followingUser.image,
              userName: followingUser.name,
            };
            setFriendsPosts((prev) => [newDocData, ...prev]);
            //allData.push(newDocData);
          }
        });
      });
    });
    console.log("allData", allData);
    // (await allData) &&
    //   allData
    //     .sort(function (a, b) {
    //       return a.time.seconds - b.time.seconds;
    //     })
    //     .reverse();
    //setFriendsPosts(allData);
  }

  useEffect(() => {
    if (uid) {
      if (uid === userUID) {
        //本人
        console.log("本人");
        getUserDesignAndDiary(userUID); //抓自己的
        getAllFollowingDiaryAndSpread(user); //抓自己和別人的
        //getAllFollowingSnapShop(user); //監聽別人的
      } else {
        console.log("別人");
        //getOtherUserDiaryAndSpread(uid);
      }
    }
  }, [isLogin, userUID, uid, following]);

  if (!user || !visitedUser) {
    return <></>;
  }
  return (
    <>
      <div className='w-screen h-[110px] mx-auto' />
      <div className='mx-auto w-screen'>
        <div className='flex flex-row w-[1180px] z-20 h-[300px] justify-center gap-[2%] mx-auto'>
          <div className='h-[100%] w-2/12'>
            {userUID && <Buttons setPage={setPage} page={page} />}
          </div>
          <div className=' h-[100%] w-6/12'>
            {page === 1 && (
              <Gallary
                visitedUser={visitedUser}
                setVisitedUser={setVisitedUser}
                userDiary={userDiary}
                uid={uid}
                userUID={userUID}
                friendsPosts={friendsPosts}
                setFriendsPosts={setFriendsPosts}
                page={page}
              />
            )}
            {userUID === uid && page === 6 && <ProfileEdit />}
            {/* 日記 */}
            {userUID === uid && page === 2 && <Diary />}
            {/* 設計牌陣 */}
            {userUID === uid && page === 4 && (
              <UserSpread userDesign={userDesign} visitedUser={visitedUser} />
            )}
          </div>
          <div className=' h-[100%] w-3/12'>
            <ProfileHeader
              uid={uid}
              visitedUser={visitedUser}
              following={following}
              setFollowing={setFollowing}
              setPage={setPage}
            />
          </div>
        </div>
      </div>
    </>
  );
  return (
    <>
      <div className='w-screen h-[110px] mx-auto' />
      <div className='w-2/12'>
        <ProfileHeader
          uid={uid}
          visitedUser={visitedUser}
          following={following}
          setFollowing={setFollowing}
          setPage={setPage}
        />
      </div>

      {/* 只有自己的頁面才有 */}

      {userUID && <Buttons setPage={setPage} page={page} />}

      {userUID === uid && page === 5 ? (
        <Gallary
          visitedUser={visitedUser}
          setVisitedUser={setVisitedUser}
          userDiary={userDiary}
          uid={uid}
          userUID={userUID}
          friendsPosts={friendsPosts}
          setFriendsPosts={setFriendsPosts}
          page={page}
        />
      ) : null}
      {userUID === uid && page === 6 && <ProfileEdit />}
      {/* 我追蹤的貼文 */}
      {userUID === uid && page === 1 && (
        <Gallary
          visitedUser={visitedUser}
          setVisitedUser={setVisitedUser}
          userDiary={userDiary}
          uid={uid}
          userUID={userUID}
          friendsPosts={friendsPosts}
          setFriendsPosts={setFriendsPosts}
          page={page}
        />
      )}
      {/* 此用戶公開日記&牌陣 */}
      {userUID !== uid && (
        <Gallary
          visitedUser={visitedUser}
          setVisitedUser={setVisitedUser}
          userDiary={userDiary}
          uid={uid}
          userUID={userUID}
          friendsPosts={friendsPosts}
          setFriendsPosts={setFriendsPosts}
          page={page}
        />
      )}
      {/* 設計排陣 */}
      {userUID === uid && page === 3 && (
        <UserSpread userDesign={userDesign} visitedUser={visitedUser} />
      )}
      {/* 日記 */}
      {userUID === uid && page === 2 && <Diary />}
    </>
  );
}
export default Profile;

const ProfileHeader = ({
  uid,
  visitedUser,
  following,
  setFollowing,
  setPage,
}) => {
  const { user, userUID, isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  async function follow(uid, userUID) {
    if (!isLogin) return;
    if (userUID === uid) return;
    await firebase.follow(uid, userUID);
    setFollowing(true);
    console.log("已追蹤");
  }
  let data;
  if (userUID === uid) {
    data = user;
    console.log("data", data);
  } else {
    data = visitedUser;
  }

  return (
    <div className='w-100%  bg-black bg-opacity-30 rounde-2xl fixed'>
      <div className='flex flex-row pt-6 mx-auto justify-center gap-4'>
        <img
          src={data.image}
          alt={data.name}
          className='rounded-full w-[70px] h-[70px]'
        />
        <div>
          <h5 className='font-notoSansJP font-light text-lg tracking-wider text-pink mt-2'>
            {data.name}
          </h5>
          <p className='font-notoSansJP font-light text-sm tracking-wider text-yellow mt-2'>
            {data.sign}
          </p>
        </div>
      </div>
      {data.followers && (
        <div className='flex flex-row gap-3 justify-center my-5 items-center py-[10px] px-[15px]'>
          <span className='flex flex-col items-center'>
            <h3 className='text-3xl font-sygma text-yellow'>
              {data.followers.length}
            </h3>
            <p className='text-lg font-sygma text-gold uppercase shadowGold'>
              Followers
            </p>
          </span>
          <Star color={"#E18EA5"} />
          <span className='flex flex-col items-center'>
            <h3 className='text-3xl font-sygma text-yellow'>
              {data.following.length}
            </h3>
            <p className='text-lg font-sygma text-gold uppercase shadowGold tracking-wider'>
              Following
            </p>
          </span>
        </div>
      )}
      <div className=' pb-10 flex justify-center items-center uppercase'>
        {userUID === uid ? (
          <Button
            action={() => {
              setPage(6);
            }}
            type={"big"}
            value={"Edit Profile"}
          />
        ) : (
          <Button
            action={() => {
              follow(uid, userUID);
            }}
            type={"big"}
            value={following ? "Unfollow" : "Follow"}
          />
        )}
      </div>
    </div>
  );
};

const Buttons = ({ page, setPage }) => {
  const switchPage = (num: Number) => {
    setPage(num);
    return;
  };
  return (
    <div
      className='flex flex-col text-left font-poppins font-light tracking-wider text-yellow  
    text-xl items-start   ml-[3%] fixed '
    >
      <button
        className={`m-4 hover:underline ${page === 1 ? "underline" : ""}`}
        onClick={() => {
          switchPage(1);
        }}
      >
        Home
      </button>
      <button
        className={`m-4 hover:underline ${page === 2 ? "underline" : ""}`}
        onClick={() => {
          switchPage(2);
        }}
      >
        Diary
      </button>

      <button
        className={`m-4 hover:underline ${page === 3 ? "underline" : ""}`}
        onClick={() => {
          switchPage(3);
        }}
      >
        Profile
      </button>

      <button
        className={`m-4 hover:underline ${page === 4 ? "underline" : ""}`}
        onClick={() => {
          switchPage(4);
        }}
      >
        Design
      </button>
    </div>
  );
};

const UserSpread = ({ userDesign, visitedUser }) => {
  return (
    <section className='flex flex-wrap gap-[8px] w-[100%] mx-auto'>
      {userDesign.map((spread, index) => {
        return (
          <div className='w-[32%] h-0 pt-[32%] bg-cover relative ' key={index}>
            {spread.image !== "" && (
              <img
                src={spread.image}
                alt={spread.title}
                className='opacity-60 absolute top-0 object-cover left-0 w-[100%] h-[100%]'
              />
            )}
            <p className='text-xs mt-1 absolute top-2 left-3 text-white shadowWhite tracking-wide font-sygma'>
              PICK A CARD
            </p>
            <div
              className='min-h-[25%] w-[100%]  bg-darkPink bg-opacity-40
          p-3 pl-4 absolute bottom-0 tracking-widest font-sygma text-base text-yellow'
            >
              <Link to={`/spread/${spread.spreadId}`}>
                {" "}
                <p>{spread.title}</p>
              </Link>
            </div>
          </div>
        );
      })}
    </section>
  );
};
const Gallary = ({
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
  const { user } = useContext(AuthContext);
  if (
    visitedUser.length === 0 &&
    userDiary.length === 0 &&
    friendsPosts.length === 0
  )
    return <div></div>;
  const tarot = cards.cards;
  let data;
  if (uid === userUID && page === 5) {
    data = userDiary;
    console.log("userDiary", userDiary);
  }
  if (uid === userUID && page === 1) {
    data = friendsPosts;
    console.log("friendsPosts", friendsPosts);
  } else {
    data = visitedUser.diary;
    console.log("visitedUser", visitedUser);
  }
  const handleSave = async (index) => {
    await firebase.updateDiary(userUID, data[index].docId, newEdit);
    data[index].content = newEdit.content;
    alert("更新成功");
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
    await firebase.deleteDiary(userUID, docID);
    alert("已刪除");
    const newData = [...friendsPosts];
    newData.splice(index, 1);
    setFriendsPosts(newData);
  };

  return (
    <div className='flex gap-4 flex-col  w-[100%] '>
      {data.map((item, index) => (
        <div
          key={index}
          className='bg-yellow-100 px-6 py-5 relative  bg-pink bg-opacity-30  rounde-2xl '
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
                    className='font-sygma text-gray shadowGray self-center 
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
                  font-sygma text-yellow text-xl '
                  onClick={() => {
                    edit[index]
                      ? handleSave(index)
                      : handleEdit(index, item.secret);
                  }}
                >
                  {edit[index] ? "Save" : "Edit"}
                </div>
                <div
                  className='absolute top-[100px] right-[75px] cursor-pointer font-sygma text-gold text-xl'
                  onClick={() => {
                    DeletePost(userUID, item.docId, index);
                  }}
                >
                  Delete
                </div>

                <select
                  className='outline-none font-sygma text-yellow pl-2 pr-20 bg-green ml-auto  
                 w-[30%] h-[38px] pt-1 text-base item-end bg-opacity-90 rounde-md tracking-widest inline-block'
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
              </>
            )}
          </div>
          <div className='w-[100%] h-[1px] bg-white bg-opacity-40  mt-3 ' />
          {item.docId ? (
            <>
              <h1 className='ml-4 mt-4 mb-4 font-notoSansJP text-base text-yellow font-light tracking-widest'>
                {item.question}
              </h1>
              {/* 多牌牌陣 */}
              {item.spread.includes(0) ? (
                item.spread.map((q, i) => card(q, i, tarot, true))
              ) : (
                <div className='gap-2 flex-row flex   w-[100%] flex-wrap justify-center'>
                  {item.spread.map((q, i) => (
                    <div
                      className='w-[130px] text-yellow font-sygma tracking-wider shadowYellow '
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
              {/* 一般 */}

              <span className='flex flex-row justify-between mt-8'>
                <div className='flex flex-col w-[48%] items-center'>
                  <p className='ml-3 mb-2 shadowYellow text-yellow font-sygma  tracking-wider text-lg'>
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
                  <p className='ml-3 mb-2 shadowYellow text-yellow font-sygma  tracking-wider text-lg'>
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
                <Link to={`/spread/${item.spreadId}`}>
                  <div className='flex flex-row m-2 align-center hover:underline'>
                    <p className='flex-end flex-grow-1 m-2 text-yellow'>
                      我在{formatTimestamp(item.time)}新增了一個 {item.title}
                      牌陣！趕快來占卜喔！
                    </p>
                  </div>
                </Link>
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
    </div>
  );
};
export function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  //const diffInMs = now - date;
  const diffInMs = now.getTime() - date.getTime();
  // 超過五天
  if (diffInMs >= 5 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString();
  }

  // 一天內
  if (diffInMs >= 24 * 60 * 60 * 1000) {
    const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // 一小時內
  if (diffInMs >= 60 * 60 * 1000) {
    const diffInHours = Math.floor(diffInMs / (60 * 60 * 1000));
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  // 一分鐘內
  if (diffInMs >= 60 * 1000) {
    const diffInMinutes = Math.floor(diffInMs / (60 * 1000));
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  // 剛剛
  return "just now";
}
const card = (item, i, tarot, end) => {
  return (
    <div
      className={`flex justify-center w-[72px] h-[61px] hover:scale-150 transform transition duration-500 ease-in-out hover:z-10`}
      key={i}
    >
      {item !== 0 && (
        <div
          className={` rounde-lg w-[95%]  cursor-pointer relative 
      flex items-center justify-center flex-col  text-white z-1 gap-0 bg-slate-700`}
        >
          <Link to={`/card/${item.card}`}>
            <img
              src={tarot[item.card].img}
              alt={tarot[item.card].name}
              className={`opacity-80 ${
                item.reverse ? "" : "rotate-180"
              } w-[100%] absolute top-0 left-0 `}
            />
          </Link>
          <div
            className={`w-[120%] absolute top-0 right-1 ${
              item.card !== undefined ? "" : " hover: opacity-100 "
            }`}
          >
            <div className='bg-green opacity-60 w-[100%] h-[100%] rounde-lg z-10' />
            <p className='absolute bottom--2  text-xs z-10'>{item.value}</p>
            <p className='absolute bottom--3 z-10'>{item.order}</p>
            {item.card !== undefined && (
              <Link to={`/card/${item.card}`}>
                <div className='absolute bottom-6  z-10 text-xs'>
                  {tarot[item.card].name}{" "}
                </div>
                {""}
                <div className='absolute bottom-2 z-10 text-xs'>
                  {item.reverse ? "正位" : "逆位"}
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
