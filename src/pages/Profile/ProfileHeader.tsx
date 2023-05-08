import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

import firebase from "../../utils/firebase";

import Button from "../../components/Button";
import Star from "../../images/Star";
import { FriendsData } from "../../utils/type";
import Friends from "./Friends";

import type { VisitedUser } from "../../utils/type";
import type { User } from "../../context/authContext";
const ProfileHeader = ({
  uid,
  visitedUser,
  setVisitedUser,
  following,
  setFollowing,
  setPage,
}) => {
  const { user, userUID, isLogin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [openFriends, setOpenFriends] = useState({
    following: false,
    followers: false,
  });
  const [friends, setFriends] = useState<FriendsData>({
    following: [],
    followers: [],
  });
  const [data, setData] = useState<VisitedUser | User>({});

  async function follow(uid, userUID) {
    if (!isLogin) return;
    if (userUID === uid) return;
    await firebase.follow(uid, userUID);
    setFollowing(true);
    if (userUID !== uid) {
      const newData = { ...visitedUser };
      newData.followers = [...newData.followers, userUID];
      setVisitedUser(newData);
    }
    console.log("已追蹤");
  }
  async function unfollow(uid, userUID) {
    await firebase.unfollow(uid, userUID);
    setFollowing(false);
    if (userUID !== uid) {
      const newData = { ...visitedUser };
      const index = newData.followers.indexOf(userUID);
      if (index > -1) {
        newData.followers.splice(index, 1);
      }
      setVisitedUser(newData);
      console.log("已取消");
    }
  }
  async function getFriends(followers, following) {
    const profile = await firebase.getFriendsProfile(followers, following);
    setFriends(profile);
  }
  useEffect(() => {
    if (userUID === uid) {
      getFriends(user.followers, user.following);
    } else {
      getFriends(visitedUser.followers, visitedUser.following);
    }
  }, [uid, visitedUser, user, userUID, following]);

  useEffect(() => {
    if (userUID === uid) {
      console.log("自己");
      setData(user);
    } else {
      console.log("別人");
      setData(visitedUser);
    }
  }, [uid, user, userUID, visitedUser]);
  useEffect(() => {
    console.log(data);
  }, [data]);

  if (Object.keys(data).length === 0)
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
      {openFriends.followers || openFriends.following ? (
        <Friends
          openFriends={openFriends}
          setOpenFriends={setOpenFriends}
          friends={friends}
        />
      ) : null}
      <div className=" bg-black bg-opacity-30  fixed">
        <div className="flex flex-row pt-6 mx-auto justify-center gap-4 ">
          <img
            src={data.image}
            alt={data.name}
            className="rounded-full w-[70px] h-[70px]"
          />
          <div>
            <h5 className="font-notoSansJP font-medium text-lg tracking-wider text-pink mt-2 truncate w-[180px]">
              {data.name}
            </h5>
            <p className="font-notoSansJP font-medium text-sm tracking-wider text-yellow mt-1 w-[180px] ">
              {data.sign}
            </p>
          </div>
        </div>
        {data.followers && (
          <div className="flex flex-row gap-3 justify-center my-5 items-center py-[10px] px-[15px]">
            <span
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                setOpenFriends({
                  ...openFriends,
                  followers: !openFriends.followers,
                });
              }}
            >
              <h3 className="text-3xl font-NT text-yellow">
                {data.followers.length}
              </h3>
              <p className="text-lg font-NT text-gold uppercase shadowGold cursor-pointer tracking-wider">
                Followers
              </p>
            </span>
            <Star color={"#E18EA5"} />
            <span
              className="flex flex-col items-center"
              onClick={() => {
                setOpenFriends({
                  ...openFriends,
                  following: !openFriends.following,
                });
              }}
            >
              <h3 className="text-3xl font-NT text-yellow cursor-pointer">
                {data.following && data.following.length}
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
                  setPage(6);
                }}
                type={"big"}
                value={"Edit Profile"}
              />
            </div>
          ) : (
            <div className="w-[250px]">
              <Button
                action={() => {
                  following ? unfollow(uid, userUID) : follow(uid, userUID);
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
