import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
//firebase
import firebase from "../../utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
//components
import Diary from "../../components/Diary";
import Toggle from "./Toggle";
import Gallery from "./Gallery";
import ProfileHeader from "./ProfileHeader";
import UserSpread from "./UserSpread";
import ProfileEdit from "./ProfileEdit";
//type
import type { VisitedUser } from "../../utils/type";
import Member from "../Member";
import LoadingPage from "../LoadingPage";
import UnderlineButton from "../../components/UnderlineButton";

function Profile(): JSX.Element {
  const { isLogin, user, userUID, loading, setLoading } =
    useContext(AuthContext);
  const [userDesign, setUserDesign] = useState<DocumentData[] | never[]>([]);
  const [userDiary, setUserDiary] = useState<DocumentData[] | never[]>([]);
  const [page, setPage] = useState<Number>(1);
  const [visitedUser, setVisitedUser] = useState<VisitedUser | {}>({});
  const { uid } = useParams();
  const [friendsPosts, setFriendsPosts] = useState<DocumentData[] | never[]>(
    []
  );
  const navigate = useNavigate();
  const friendsPostsRef = useRef<DocumentData[] | []>([]);
  // const visitedUserRef = useRef<VisitedUser | {}>({});

  useEffect(() => {
    initialFollowing();
  }, [userUID, uid]);
  const initialFollowing = () => {
    if (uid) {
      setFollowing(user.following.includes(uid));
    } else {
      setFollowing(false);
    }
  };
  const [following, setFollowing] = useState<boolean>(false);

  async function getUserDesignAndDiary(userUID: string) {
    const spread = await firebase.getUserDesign(userUID);
    const diary = await firebase.getOtherUserDiary(userUID, user);
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    console.log("UserDiary", diary);
    setUserDesign(spread);
    setUserDiary(diary);
  }
  async function getOtherUserDiaryAndSpread(uid) {
    const profile = await firebase.getProfile(uid);
    const diary = await firebase.getOtherUserDiary(uid, user);
    const spread = await firebase.getOtherUserSpread(uid);
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();

    return {
      ...profile,
      userUID: uid,
      diary: diary,
      spread: spread,
      seeMore: false,
    };
    // setVisitedUser({
    //   ...profile,
    //   userUID: uid,
    //   diary: diary,
    //   spread: spread,
    // });
  }
  async function getAllFollowingDiaryAndSpread(user) {
    const allDiary = await firebase.getAllFollowingDiary(user);
    const spread = await firebase.getAllFollowingSpread(user);
    const allDiaryAndSpread = [...allDiary, ...spread];
    allDiaryAndSpread &&
      (await allDiaryAndSpread
        .sort(function (a, b) {
          return a.time.seconds - b.time.seconds;
        })
        .reverse());
    // setFriendsPosts(allDiaryAndSpread);
    return allDiaryAndSpread;
  }
  async function getAllFollowingSnapShop(user) {
    const allPerson = [...user.following, user.userUID];
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
            // friendsPostsRef.current((prev) => [newDocData, ...prev])
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
  }

  useEffect(() => {
    async function getAllData() {
      if (uid) {
        if (uid === userUID) {
          //本人
          console.log("本人");
          getUserDesignAndDiary(userUID); //抓自己的
          const friendsPost = await getAllFollowingDiaryAndSpread(user); //抓自己和別人的
          friendsPostsRef.current = friendsPost;
          getAllFollowingSnapShop(user); //監聽別人的

          return () => {
            getAllFollowingSnapShop(user);
          };
        } else {
          const visited = await getOtherUserDiaryAndSpread(uid);
          console.log("visited", visited);
          setVisitedUser(visited);
          // visitedUserRef.current = visited;
        }
      }
    }
    getAllData();
  }, [isLogin, uid, user, page, userUID]);
  if (!user || !visitedUser) {
    return <></>;
  }

  return (
    <>
      {uid && <div className='w-screen h-[110px] mx-auto' />}
      <div className='mx-auto w-screen'>
        {!uid ? (
          <>
            <Member />
          </>
        ) : (
          <div className='flex flex-row w-[1180px] z-20 h-[300px] justify-center gap-[2%] mx-auto '>
            <div className='h-[100%] w-2/12'>
              {userUID && <Buttons setPage={setPage} page={page} />}
            </div>
            <div className=' h-[100%] w-6/12'>
              {page === 2 || page === 3 ? (
                <Toggle page={page} setPage={setPage} />
              ) : (
                <></>
              )}
              {page === 1 && (
                <Gallery
                  visitedUser={visitedUser}
                  setVisitedUser={setVisitedUser}
                  userDiary={userDiary}
                  uid={uid}
                  userUID={userUID}
                  friendsPosts={friendsPosts}
                  setFriendsPosts={setFriendsPosts}
                  page={page}
                  // visitedUserRef={visitedUserRef}
                  friendsPostsRef={friendsPostsRef}
                />
              )}
              {page === 3 && (
                <Gallery
                  visitedUser={visitedUser}
                  setVisitedUser={setVisitedUser}
                  userDiary={userDiary}
                  uid={uid}
                  userUID={userUID}
                  friendsPosts={friendsPosts}
                  setFriendsPosts={setFriendsPosts}
                  page={page}
                  // visitedUserRef={visitedUserRef}
                  friendsPostsRef={friendsPostsRef}
                />
              )}
              {/* 編輯個人檔案 */}
              {userUID === uid && page === 6 && <ProfileEdit />}
              {/* 日記 */}
              {userUID === uid && page === 2 && <Diary />}
              {/* 設計牌陣 */}
              {userUID === uid && page === 4 && (
                <UserSpread userDesign={userDesign} visitedUser={visitedUser} />
              )}
            </div>
            <div className=' h-[100%] w-3/12 '>
              <ProfileHeader
                uid={uid}
                visitedUser={visitedUser}
                setVisitedUser={setVisitedUser}
                following={following}
                setFollowing={setFollowing}
                setPage={setPage}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default Profile;

const Buttons = ({ page, setPage }) => {
  const { userUID } = useContext(AuthContext);
  const { uid } = useParams();
  const switchPage = (num: Number) => {
    setPage(num);
    return;
  };
  return (
    <div
      className='flex flex-col text-left font-NT font-light  text-yellow  
    text-2xl items-start   ml-[3%] fixed shadowYellow gap-6'
    >
      {userUID === uid && (
        <>
          <UnderlineButton
            value={"Explore"}
            type={"profile"}
            action={() => {
              switchPage(1);
            }}
            selected={page === 1}
          />
          <UnderlineButton
            value={"Diary"}
            type={"profile"}
            action={() => {
              switchPage(2);
            }}
            selected={page === 2}
          />
          <UnderlineButton
            value={"Design"}
            type={"profile"}
            action={() => {
              switchPage(4);
            }}
            selected={page === 4}
          />
          {/* <button
            className={`m-4 hover:underline-offset-1 shadowYellow tracking-wider  ${
              page === 1 ? "underline" : ""
            }`}
            onClick={() => {
              switchPage(1);
            }}
          >
            Explore
          </button>
          <button
            className={`m-4 hover:underline-offset-1 shadowYellow tracking-wider  ${
              page === 2 ? "underline" : ""
            }`}
            onClick={() => {
              switchPage(2);
            }}
          >
            Diary
          </button>

          <button
            className={`m-4 hover:underline-offset-1 shadowYellow tracking-wider ${
              page === 4 ? "underline" : ""
            }`}
            onClick={() => {
              switchPage(4);
            }}
          >
            Design
          </button> */}
        </>
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
