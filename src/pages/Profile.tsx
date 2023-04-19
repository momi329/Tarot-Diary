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
        getAllFollowingSnapShop(user); //監聽別人的
      } else {
        console.log("別人");
        getOtherUserDiaryAndSpread(uid);
      }
    }
  }, [isLogin, userUID, uid, following]);

  if (!user || !visitedUser) {
    return <></>;
  }
  return (
    <>
      <Member />
      <ProfileHeader
        uid={uid}
        visitedUser={visitedUser}
        following={following}
        setFollowing={setFollowing}
        setPage={setPage}
      />

      {/* 只有自己的頁面才有 */}
      {userUID === uid && <Buttons setPage={setPage} />}
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
    <div className='flex flex-row gap-5'>
      <img
        src={data.image}
        alt={data.name}
        className='rounded-full w-10 h-10'
      />
      <div>
        <h5>{data.name}</h5>
        <p>{data.sign}</p>
      </div>
      <button
        onClick={() => {
          follow(uid, userUID);
        }}
      >
        {userUID === uid ? <></> : following ? "Unfollow" : "Follow"}
      </button>
      <button
        onClick={() => {
          setPage(6);
        }}
      >
        編輯個人檔案
      </button>
      <button
        onClick={() => {
          navigate(`/design`, { replace: true });
        }}
      >
        新增排陣
      </button>
      {data.followers && (
        <div className='flex flex-row gap-5'>
          <span className='flex flex-col items-center'>
            <h1>{data.followers.length}</h1>
            <p>Followers</p>
          </span>
          <span className='flex flex-col items-center'>
            <h1>{data.following.length}</h1>
            <p>Following</p>
          </span>
          <span className='flex flex-col items-center'>
            <h1>{data.following.length}</h1>
            <p>Article(Todo)</p>
          </span>
        </div>
      )}
    </div>
  );
};

const Buttons = ({ setPage }) => {
  const switchPage = (num: Number) => {
    setPage(num);
    return;
  };
  return (
    <div className=''>
      <button
        className='m-4'
        onClick={() => {
          switchPage(1);
        }}
      >
        GALLARY
      </button>
      <button
        className='m-4'
        onClick={() => {
          switchPage(2);
        }}
      >
        DIARY
      </button>

      <button
        className='m-4'
        onClick={() => {
          switchPage(3);
        }}
      >
        MY DESIGN
      </button>

      <button
        className='m-4'
        onClick={() => {
          switchPage(4);
        }}
      >
        FAVORITE
      </button>
      <button
        className='m-4'
        onClick={() => {
          switchPage(5);
        }}
      >
        ARTICLE
      </button>
    </div>
  );
};

const UserSpread = ({ userDesign, visitedUser }) => {
  return (
    <section className='flex flex-wrap gap-2'>
      {userDesign.map((spread, index) => {
        return (
          <div
            className='w-[200px] h-[200px] bg-cover relative'
            style={{ backgroundImage: `url(${spread.image})` }}
            key={index}
          >
            <p className='text-xs mt-1 absolute top-2 left-3 text-white tracking-wide'>
              PICK A CARD
            </p>
            <div
              className='h-[70px] w-[100%] bg-gray-900 opacity-60 text-white 
          p-3 pl-4 absolute bottom-0 tracking-wide'
            >
              <Link to={`/spread/${spread.spreadId}`}>
                {" "}
                <p>{spread.title}</p>
              </Link>
              <p className='text-xs mt-1  tracking-wide'>{visitedUser.name}</p>
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
    <div className='flex gap-4 flex-col w-[600px] p-4'>
      {data.map((item, index) =>
        item.docId ? (
          <div key={index} className='bg-yellow-100 p-3 relative'>
            {/* 自己的貼文才能編輯 */}
            {userUID === item.user && (
              <>
                <div
                  className='absolute top-1 right-[40px] cursor-pointer'
                  onClick={() => {
                    edit[index]
                      ? handleSave(index)
                      : handleEdit(index, item.secret);
                  }}
                >
                  {edit[index] ? "Save" : "Edit"}
                </div>
                <div
                  className='absolute top-1 right-[70px] cursor-pointer'
                  onClick={() => {
                    DeletePost(userUID, item.docId, index);
                  }}
                >
                  Delete
                </div>

                <select
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
            {item.user && (
              <Link to={`/profile/${item.user}`}>
                <div className='flex flex-row m-2 align-center'>
                  <img
                    src={item.userName && item.userImg}
                    alt={item.userName}
                    className='rounded-full w-8 h-8 m-2'
                  />
                  <p>{item.userName}</p>
                  <p className='flex-end flex-grow-1 m-2'>
                    {formatTimestamp(item.time)}
                  </p>
                </div>
              </Link>
            )}
            <h1>{item.question}</h1>
            <div className='flex flex-row  w-[500px] flex-wrap'>
              {/* 多牌牌陣 */}
              {item.spread.includes(0)
                ? item.spread.map((q, i) => card(q, i, tarot, true))
                : item.spread.map((q, i) => (
                    <div className='w-[150px]' key={i}>
                      <img
                        src={tarot[q.card] && tarot[q.card].img}
                        alt={tarot[q.card] && tarot[q.card].name}
                      />
                      {tarot[q.card] && tarot[q.card].name}
                    </div>
                  ))}
              {/* 一般 */}
            </div>
            <p>
              AI解牌
              <br />
              {item.askGpt}
            </p>
            <br />
            心得筆記
            <br />
            {edit[index] ? (
              <Editor value={item.content} onChange={onEditorContentChanged} />
            ) : (
              <Viewer value={item.content} />
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
        ) : (
          <div>
            {item.user && (
              <Link to={`/spread/${item.spreadId}`}>
                <div className='flex flex-row m-2 align-center'>
                  <img
                    src={item.userName && item.userImg}
                    alt={item.userName}
                    className='rounded-full w-8 h-8 m-2'
                  />
                  <p>{item.userName}在</p>
                  <p className='flex-end flex-grow-1 m-2'>
                    {formatTimestamp(item.time)}新增了一個牌陣！趕快來占卜喔！
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
        )
      )}
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
      className={`flex justify-center w-[50px] h-[41.5px] border border-red-100 `}
      key={i}
    >
      {item !== 0 && (
        <div
          className={`border rounded-lg w-[50px] h-[83px] cursor-pointer relative
      flex items-center justify-center flex-col  text-white z-1 gap-2 bg-slate-700`}
        >
          <Link to={`/card/${item.card}`}>
            <img
              src={tarot[item.card].img}
              alt={tarot[item.card].name}
              className={`${
                item.reverse ? "" : "rotate-180"
              } w-[100%] h-[100%] absolute top-0 left-0 `}
            />
          </Link>
          <div
            className={`w-[100%] h-[100%] absolute top-0 ${
              item.card !== undefined && end
                ? "opacity-0 hover:opacity-100"
                : "hover:opacity-100"
            }`}
          >
            <div className='bg-slate-800 opacity-60 w-[100%] h-[100%] rounded-lg'></div>
            <p className='absolute bottom-2 left-5 text-xs z-10'>
              {item.value}
            </p>
            <p className='absolute bottom-7 left-2 z-10'>{item.order}</p>
            {item.card !== undefined && (
              <Link to={`/card/${item.card}`}>
                <div className='absolute bottom-16 left-2 z-10 text-xs'>
                  {tarot[item.card].name}{" "}
                </div>
                {""}
                <div className='absolute bottom-12 left-2 z-10 text-xs'>
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
