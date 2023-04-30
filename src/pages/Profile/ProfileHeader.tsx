import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { Link, useNavigate } from "react-router-dom";

import firebase from "../../utils/firebase";

import Button from "../../components/Button";
import Star from "../../images/Star";
import { FriendsData } from "../../utils/type";

const ProfileHeader = ({
  uid,
  visitedUser,
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
  async function follow(uid, userUID) {
    if (!isLogin) return;
    if (userUID === uid) return;
    await firebase.follow(uid, userUID);
    setFollowing(true);
    console.log("已追蹤");
  }
  async function unfollow(uid, userUID) {
    await firebase.unfollow(uid, userUID);
    setFollowing(false);
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
  }, [uid]);
  let data;
  if (userUID === uid) {
    data = user;
  } else {
    data = visitedUser;
    console.log("data", data);
  }

  return (
    <>
      <div className='w-100%  bg-black bg-opacity-30  fixed'>
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
            <span
              className='flex flex-col items-center cursor-pointer'
              onClick={() => {
                setOpenFriends({
                  ...openFriends,
                  followers: !openFriends.followers,
                });
              }}
            >
              <h3 className='text-3xl font-NT text-yellow'>
                {data.followers.length}
              </h3>
              <p className='text-lg font-NT text-gold uppercase shadowGold cursor-pointer'>
                Followers
              </p>
            </span>
            <Star color={"#E18EA5"} />
            <span
              className='flex flex-col items-center'
              onClick={() => {
                setOpenFriends({
                  ...openFriends,
                  following: !openFriends.following,
                });
              }}
            >
              <h3 className='text-3xl font-NT text-yellow'>
                {data.following.length}
              </h3>
              <p className='text-lg font-NT text-gold uppercase shadowGold tracking-wider cursor-pointer'>
                Following
              </p>
            </span>
          </div>
        )}
        {openFriends.following || openFriends.followers ? (
          openFriends.following ? (
            friends.following.map((friend) => (
              <div className='flex flex-row py-2 ml-5 justify-start gap-4'>
                <img
                  src={friend.image}
                  alt={friend.name}
                  className='rounded-full w-[70px] h-[70px]'
                  onClick={() => navigate(`/profile/${friend.uid}`)}
                />
                <div>
                  <h5 className='font-notoSansJP font-light text-lg tracking-wider text-pink mt-2'>
                    {friend.name}
                  </h5>
                  <p className='font-notoSansJP font-light text-sm tracking-wider text-yellow mt-2'>
                    {friend.sign}
                  </p>
                </div>
              </div>
            ))
          ) : (
            friends.followers.map((friend) => (
              <div className='flex flex-row py-2 ml-5 justify-start gap-4'>
                <img
                  src={friend.image}
                  alt={friend.name}
                  className='rounded-full w-[70px] h-[70px]'
                  onClick={() => navigate(`/profile/${friend.uid}`)}
                />
                <div>
                  <h5 className='font-notoSansJP font-light text-lg tracking-wider text-pink mt-2'>
                    {friend.name}
                  </h5>
                  <p className='font-notoSansJP font-light text-sm tracking-wider text-yellow mt-2'>
                    {friend.sign}
                  </p>
                </div>
              </div>
            ))
          )
        ) : (
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
                  following ? unfollow(uid, userUID) : follow(uid, userUID);
                }}
                type={"big"}
                value={following ? "Unfollow" : "Follow"}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default ProfileHeader;
