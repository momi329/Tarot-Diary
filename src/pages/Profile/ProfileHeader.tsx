import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../components/Button";
import { AuthContext } from "../../context/authContext";
import Star from "../../images/Star";
import firebase from "../../utils/firebase";
import { FriendsData, PageEnum, ProfileType } from "../../utils/type";
import Friends from "./Friends";
type ProfileHeaderProps = {
  following: boolean;
  setFollowing: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<PageEnum>>;
  userProfile: ProfileType;
  setUserProfile: React.Dispatch<React.SetStateAction<ProfileType>>;
};
const ProfileHeader = ({
  following,
  setFollowing,
  setPage,
  userProfile,
  setUserProfile,
}: ProfileHeaderProps) => {
  const { uid } = useParams();
  const { user, userUID, isLogin } = useContext(AuthContext);
  const [openFriends, setOpenFriends] = useState({
    following: false,
    followers: false,
  });
  const [friends, setFriends] = useState<FriendsData>({
    following: [],
    followers: [],
  });

  async function follow() {
    if (!isLogin) return;
    if (userUID === uid) return;
    await firebase.follow(uid, userUID);
    setFollowing(true);
    if (!userProfile) return;
    if (userUID !== uid) {
      const newData = { ...userProfile };
      userProfile.followers = [...newData.followers, userUID];
      setUserProfile(newData);
    }
  }
  async function unfollow() {
    await firebase.unfollow(uid, userUID);
    setFollowing(false);
    if (!userProfile) return;
    if (userUID !== uid) {
      const newData = { ...userProfile };
      const index = newData.followers.indexOf(userUID);
      if (index > -1) {
        newData.followers.splice(index, 1);
      }
      setUserProfile(newData);
    }
  }
  async function getFriends(a, b) {
    const profile = await firebase.getFriendsProfile(a, b);
    setFriends(profile);
  }
  const handleGetFriends = () => {
    if (userUID === uid) {
      getFriends(user.followers, user.following);
    } else {
      getFriends(userProfile?.followers, userProfile?.following);
    }
  };

  if (!userProfile)
    return (
      <div className="bg-black bg-opacity-30 w-[304px] fixed">
        <div className="flex flex-row pt-6 mx-auto justify-center gap-4 animate-pulse">
          <div className="rounded-full w-[70px] h-[70px] bg-gray/20" />
          <div>
            <div className="h-5 w-[130px] mt-3 rounded-sm bg-gray/40"></div>
            <p className="h-5 mt-1 w-[80px] mt-2 rounded-sm bg-gray/10"></p>
          </div>
        </div>

        <div className="flex flex-row gap-3 justify-center my-5 items-center py-[10px] gap-5 px-[15px]">
          <span className="flex flex-col items-start gap-3">
            <div className=" w-[100px] h-5 mb-3 bg-gray/10 rounded-sm" />
            <p className=" w-[100px] h-5 bg-gray/10 rounded-sm" />
            <p className=" w-[100px] h-5 bg-gray/10 rounded-sm" />
          </span>

          <span className="flex flex-col items-start gap-3">
            <div className=" w-[100px] h-5 mb-3 bg-gray/10 rounded-sm" />
            <p className=" w-[100px] h-5 bg-gray/20 rounded-sm" />
            <p className=" w-[100px] h-5 bg-gray/5 rounded-sm" />
          </span>
        </div>

        <div className=" pb-8 flex justify-center items-center uppercase">
          <div className="w-[250px] h-[78px] rounded-[50%] bg-gray/10 " />
        </div>
      </div>
    );
  return (
    <>
      {(openFriends.followers || openFriends.following) && (
        <Friends
          openFriends={openFriends}
          setOpenFriends={setOpenFriends}
          friends={friends}
        />
      )}
      <div className=" bg-black bg-opacity-30  fixed">
        <div className="flex flex-row pt-6 mx-auto justify-center gap-4 ">
          <img
            src={userProfile.image}
            alt={userProfile.name}
            className="rounded-full w-[70px] h-[70px]"
          />
          <div>
            <h5 className="font-notoSansJP font-medium text-lg tracking-wider text-pink mt-2 truncate w-[180px]">
              {userProfile.name}
            </h5>
            <p className="font-notoSansJP font-medium text-sm tracking-wider text-yellow mt-1 w-[180px] ">
              {userProfile.sign}
            </p>
          </div>
        </div>
        {userProfile.followers && (
          <div className="flex flex-row gap-3 justify-center my-5 items-center py-[10px] px-[15px]">
            <span
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                handleGetFriends();
                setOpenFriends({
                  ...openFriends,
                  followers: !openFriends.followers,
                });
              }}
            >
              <h3 className="text-3xl font-NT text-yellow">
                {userProfile?.followers.length}
              </h3>
              <p className="text-lg font-NT text-gold uppercase shadowGold cursor-pointer tracking-wider">
                Followers
              </p>
            </span>
            <Star color={"#E18EA5"} />
            <span
              className="flex flex-col items-center"
              onClick={() => {
                handleGetFriends();
                setOpenFriends({
                  ...openFriends,
                  following: !openFriends.following,
                });
              }}
            >
              <h3 className="text-3xl font-NT text-yellow cursor-pointer">
                {userProfile?.following.length}
              </h3>
              <p className="text-lg font-NT text-gold uppercase shadowGold tracking-wider cursor-pointer tracking-wider">
                Following
              </p>
            </span>
          </div>
        )}
        <div className=" pb-8 flex justify-center items-center uppercase">
          {userUID === uid ? (
            <div className="w-[250px]">
              <Button
                action={() => {
                  setPage(PageEnum.EditProfile);
                }}
                type={"big"}
                value={"Edit Profile"}
              />
            </div>
          ) : (
            <div className="w-[250px]">
              <Button
                action={() => {
                  uid && following ? unfollow() : follow();
                }}
                type={"big"}
                value={following ? "Unfollow" : "Follow"}
              />{" "}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default ProfileHeader;
