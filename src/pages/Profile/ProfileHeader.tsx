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
  }

  return (
    <>
      <div className='w-100%  bg-black bg-opacity-30  fixed'>
        <div className='flex flex-row pt-6 mx-auto justify-center gap-4 '>
          <img
            src={data.image}
            alt={data.name}
            className='rounded-full w-[70px] h-[70px]'
          />
          <div>
            <h5 className='font-notoSansJP font-medium text-lg tracking-wider text-pink mt-2 truncate w-[180px]'>
              {data.name}
            </h5>
            <p className='font-notoSansJP font-medium text-sm tracking-wider text-yellow mt-1 w-[180px] '>
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
              <p className='text-lg font-NT text-gold uppercase shadowGold cursor-pointer tracking-wider'>
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
              <p className='text-lg font-NT text-gold uppercase shadowGold tracking-wider cursor-pointer tracking-wider'>
                Following
              </p>
            </span>
          </div>
        )}
        <div className=' pb-8 flex justify-center items-center uppercase'>
          {userUID === uid ? (
            <div className='w-[250px]'>
              <Button
                action={() => {
                  setPage(6);
                }}
                type={"big"}
                value={"Edit Profile"}
              />
            </div>
          ) : (
            <div className='w-[250px]'>
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
        {/* <div className='w-[95%] h-[1px] bg-gold/40 mx-auto' />
        <div className='overflow-y-hidden h-[200px] pb-6'>
          <p>FOllOWERS</p>
          {friends.followers.map((friend) => (
            <div className='flex flex-row py-2 ml-5 justify-start gap-4'>
              <img
                src={friend.image}
                alt={friend.name}
                className='rounded-full w-[60px] h-[60px]'
                onClick={() => navigate(`/profile/${friend.uid}`)}
              />
              <div>
                <h5 className='font-notoSansJP font-light text-lg tracking-wider text-pink mt-2'>
                  {friend.name}
                </h5>
                <p className='font-notoSansJP font-light text-sm tracking-wider text-yellow mt-1'>
                  {friend.sign}
                </p>
              </div>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};
export default ProfileHeader;
