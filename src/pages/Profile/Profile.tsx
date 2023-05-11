import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useParams } from "react-router-dom";
// TODO: format
// 1: type import type{} 2: From outside eg React, external libraries
// 3: Not from this folder 4: From this folder
import Diary from "../../components/Diary";
import Toggle from "./Toggle";
import ProfileHeader from "./ProfileHeader";
import UserSpread from "./UserSpread";
import ProfileEdit from "./ProfileEdit";

import Member from "../Member";
import UnderlineButton from "../../components/UnderlineButton";
import useGetUserProfile from "./hooks/useGetUserProfile.tsx";
import useGetUserDiary from "./hooks/useGetUserDiary";
import NewGallery from "./NewGallery";
import useGetUserExplore from "./hooks/useGetUserExplore";
import useGetUserSpread from "./hooks/useGetUserSpread";
// TODO: enum used by different files should be in types folder
export enum Page {
  DiaryCalendar = "diaryCalendar",
  DiaryPost = "diaryPost",
  Explore = "explore",
  EditProfile = "editProfile",
  Design = "design",
}

function Profile(): JSX.Element {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const { uid } = useParams();
  const [page, setPage] = useState<Page>(
    userUID === uid ? Page.Explore : Page.DiaryPost
  );
  const [following, setFollowing] = useState<boolean>(false);

  const { userProfile, setUserProfile, getUserProfile } = useGetUserProfile();
  const { diary, getDiary } = useGetUserDiary();
  const { friendsPosts } = useGetUserExplore();
  const { userSpread, getUserSpread } = useGetUserSpread();

  useEffect(() => {
    getUserProfile();
    initialFollowing();
    if (userUID !== uid) {
      getDiary();
      setPage(Page.DiaryPost);
    }
    if (userUID === uid) {
      setPage(Page.Explore);
    }
  }, [uid]);

  const initialFollowing = () => {
    if (uid) {
      setFollowing(user.following.includes(uid));
    } else {
      setFollowing(false);
    }
  };

  if (!user) {
    return <></>;
  }

  return (
    <>
      {uid && <div className="w-screen h-[110px] mx-auto" />}
      <div className="mx-auto w-screen">
        {!uid ? (
          <Member />
        ) : (
          <div className="flex flex-row w-[1180px] z-20 h-[300px] justify-center gap-[2%] mx-auto ">
            <div className="h-[100%] w-2/12">
              {userUID && (
                <Buttons
                  setPage={setPage}
                  page={page}
                  getDiary={getDiary}
                  getUserSpread={getUserSpread}
                />
              )}
            </div>

            <div className=" h-[100%] w-6/12">
              {isLogin &&
                userUID === uid &&
                (page === Page.DiaryCalendar || page === Page.DiaryPost) && (
                  <Toggle page={page} setPage={setPage} />
                )}
              {page === Page.DiaryPost && (
                <NewGallery data={diary} page={page} />
              )}
              {page === Page.Explore && friendsPosts && (
                <NewGallery data={friendsPosts} page={page} />
              )}
              {userUID === uid && page === Page.EditProfile && <ProfileEdit />}
              {userUID === uid && page === Page.DiaryPost && <Diary />}
              {page === Page.Design && <UserSpread userSpread={userSpread} />}
            </div>

            <div className=" h-[100%] w-3/12 ">
              <ProfileHeader
                userProfile={userProfile}
                setUserProfile={setUserProfile}
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

const Buttons = ({ page, setPage, getDiary, getUserSpread }) => {
  const { userUID } = useContext(AuthContext);
  const { uid } = useParams();

  const switchPage = (page: string) => {
    setPage(page);
    return;
  };
  return (
    <div
      className="flex flex-col text-left font-NT font-light  text-yellow  
    text-2xl items-start   ml-[3%] fixed shadowYellow gap-6"
    >
      {userUID === uid && (
        <UnderlineButton
          value={"Explore"}
          type={"profile"}
          action={() => {
            switchPage("explore");
          }}
          selected={page === Page.Explore}
        />
      )}
      <UnderlineButton
        value={"Diary"}
        type={"profile"}
        action={() => {
          getDiary();
          if (userUID === uid) {
            switchPage("diaryCalender");
          } else {
            switchPage("diaryPost");
          }
        }}
        selected={page === Page.DiaryCalendar}
      />
      <UnderlineButton
        value={"Design"}
        type={"profile"}
        action={() => {
          getUserSpread();
          switchPage("design");
        }}
        selected={page === Page.Design}
      />
    </div>
  );
};

export function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  const diffInMs = now.getTime() - date.getTime();
  if (diffInMs >= 5 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString();
  }
  if (diffInMs >= 24 * 60 * 60 * 1000) {
    const diffInDays = Math.floor(diffInMs / (24 * 60 * 60 * 1000));
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
  if (diffInMs >= 60 * 60 * 1000) {
    const diffInHours = Math.floor(diffInMs / (60 * 60 * 1000));
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
  if (diffInMs >= 60 * 1000) {
    const diffInMinutes = Math.floor(diffInMs / (60 * 1000));
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
