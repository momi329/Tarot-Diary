import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { DocumentData } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Diary from "../components/Diary";
import firebase from "../utils/firebase";
import cards from "../tarotcard/tarot-images";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import Viewer from "../components/Editor/Viewer";
import Member from "./Member";
const tarot = cards.cards;
interface VisitedUser {
  name?: string;
  image?: string;
  sign?: string;
  favorite?: [];
  followers?: string[];
  following?: string[];
  diary?: DocumentData[];
  spread?: DocumentData[];
}
function Profile(): JSX.Element {
  const { isLogin, user, userUID, signOut, signIn } = useContext(AuthContext);
  const [userDesign, setUserDesign] = useState<DocumentData[] | never[]>([]);
  const [userDiary, setUserDiary] = useState<DocumentData[] | never[]>([]);
  const [page, setPage] = useState<Number>(3);
  const [visitedUser, setVisitedUser] = useState<VisitedUser | []>([]);
  const { uid } = useParams();
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
    // spread.sort(function (a, b) {
    //   return a.time.seconds - b.time.seconds;
    // });
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
        diary: diary,
        spread: spread,
      });
    }
  }

  useEffect(() => {
    if (uid) {
      if (uid === userUID) {
        //本人
        console.log("本人");
        getUserDesignAndDiary(userUID);
      } else {
        getOtherUserDiaryAndSpread(uid);
      }
    }
  }, [page, isLogin, userUID, uid, following]);

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
      />

      {/* 只有自己的頁面才有 */}
      {userUID === uid && <Buttons setPage={setPage} />}
      {userUID === uid && page === 5 ? (
        <Gallary
          visitedUser={visitedUser}
          userDiary={userDiary}
          uid={uid}
          userUID={userUID}
        />
      ) : null}
      {/* 我追蹤的貼文todo */}
      {/* 此用戶公開日記&牌陣 */}
      {userUID !== uid && (
        <Gallary
          visitedUser={visitedUser}
          userDiary={userDiary}
          uid={uid}
          userUID={userUID}
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

const ProfileHeader = ({ uid, visitedUser, following, setFollowing }) => {
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  const { user, userUID } = useContext(AuthContext);

  //if (!userUID) return null;
  async function follow(uid, userUID) {
    if (!isLogin) return;
    await firebase.follow(uid, userUID);
    setFollowing(true);
    console.log("已追蹤");
  }
  let data;
  if (userUID === uid) {
    data = user;
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
        {following ? "Unfollow" : "Follow"}
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
const Gallary = ({ visitedUser, userDiary, uid, userUID }) => {
  if (visitedUser.length === 0 && userDiary.length === 0) return <div></div>;

  let data;
  if (uid === userUID) {
    data = userDiary;
  } else {
    data = visitedUser.diary;
  }
  console.log("???");
  return (
    <div className='flex gap-4 flex-col w-[500px] p-4'>
      {data.map((item, index) => (
        <div key={index} className='bg-yellow-100'>
          <p>{formatTimestamp(item.time)}</p>
          <h1>{item.title}</h1>
          <div className='flex flex-row gap-3 p-2'>
            {item.spread.map((card, i) => (
              <div className='w-[150px]' key={i}>
                <img src={tarot[card.card].img} alt={tarot[card.card].name} />
                {tarot[card.card].name}
              </div>
            ))}
          </div>
          <p>
            AI解牌
            <br />
            {item.askGpt}
          </p>
          <br />
          心得筆記
          <br />
          <Viewer value={item.content} />
        </div>
      ))}
    </div>
  );
};
function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp.seconds * 1000);
  const diffInMs = now - date;

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
