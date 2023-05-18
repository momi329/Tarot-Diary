import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Diary from "../../components/Diary";
import { AuthContext } from "../../context/authContext";
import { PageEnum } from "../../utils/type";
import Member from "../Member";
import { Buttons } from "./Buttons";
import Gallery from "./Gallery";
import ProfileEdit from "./ProfileEdit";
import ProfileHeader from "./ProfileHeader";
import Toggle from "./Toggle";
import UserSpread from "./UserSpread";
import useGetUserDiary from "./hooks/useGetUserDiary";
import useGetUserExplore from "./hooks/useGetUserExplore";
import useGetUserProfile from "./hooks/useGetUserProfile.tsx";
import useGetUserSpread from "./hooks/useGetUserSpread";
function Profile(): JSX.Element {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const { uid } = useParams();
  const [page, setPage] = useState<PageEnum>(
    userUID === uid ? PageEnum.Explore : PageEnum.DiaryPost
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
      setPage(PageEnum.DiaryPost);
    }
    if (userUID === uid) {
      setPage(PageEnum.Explore);
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
          <div className="sm:w-full tiny:w-full flex flex-row w-[1180px] z-20 h-[300px] justify-center gap-[2%] mx-auto ">
            <div className="sm:hidden tiny:hidden  h-[100%] w-2/12">
              {userUID && (
                <Buttons
                  setPage={setPage}
                  page={page}
                  getDiary={getDiary}
                  getUserSpread={getUserSpread}
                />
              )}
            </div>

            <div className=" h-[100%] w-6/12 sm:w-full">
              {isLogin &&
                userUID === uid &&
                (page === PageEnum.DiaryCalendar ||
                  page === PageEnum.DiaryPost) && (
                  <Toggle page={page} setPage={setPage} />
                )}
              {page === PageEnum.DiaryPost && (
                <Gallery data={diary} page={page} />
              )}
              {page === PageEnum.Explore && friendsPosts && (
                <Gallery data={friendsPosts} page={page} />
              )}
              {userUID === uid && page === PageEnum.EditProfile && (
                <ProfileEdit />
              )}
              {userUID === uid && page === PageEnum.DiaryCalendar && <Diary />}
              {page === PageEnum.Design && (
                <UserSpread userSpread={userSpread} />
              )}
            </div>

            <div className="sm:hidden tiny:hidden  h-[100%] w-3/12 ">
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
