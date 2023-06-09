import { DocumentData } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import UnderlineInput from "../../components/UnderlineInput";
import firebase from "../../utils/firebase";
type FriendsProps = {
  openFriends: { followers: boolean; following: boolean };
  friends: {
    followers: { name: string; image: string; sign: string; uid: string }[];
    following: { name: string; image: string; sign: string; uid: string }[];
  };
  setOpenFriends: React.Dispatch<
    React.SetStateAction<{ followers: boolean; following: boolean }>
  >;
};
function Friends({ openFriends, friends, setOpenFriends }: FriendsProps) {
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState<DocumentData[]>();
  const [inputValue, setInputValue] = useState("");
  const usersRef = useRef<DocumentData[] | null>(null);

  async function getAllUsers() {
    const users = await firebase.getAllUsers();
    if (users) {
      usersRef.current = users;
    }
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (!friends) return;
    if (openFriends.followers) {
      setData(friends.followers);
    } else {
      setData(friends.following);
    }
  }, [friends, openFriends]);

  if (!friends || !data) return <></>;
  return (
    <>
      <div
        className="w-screen h-screen bg-pink/20 backdrop-blur-sm fixed top-0 left-0 z-10"
        onClick={() => {
          setOpenFriends({ following: false, followers: false });
        }}
      />
      <div className="fixed top-[calc(50%-250px)] left-[calc(50%-175px)] w-[350px] h-[500px] bg-black/90 z-10 flex flex-col items-center">
        {search ? (
          <>
            <div className="w-[90%] mt-2 pb-2 ">
              <UnderlineInput
                placeholder={"Search friends..."}
                value={inputValue}
                inputType={"text"}
                action={(e) => {
                  setInputValue(e.target.value);
                }}
                keyAction={(e) => {
                  if (e.key === "Enter" && usersRef.current) {
                    const filteredUsers = usersRef.current.filter(
                      (user) =>
                        user.name.includes(inputValue) ||
                        user.sign.includes(inputValue)
                    );
                    setData(filteredUsers);
                  }
                }}
              />
            </div>
            <CiSearch
              className="text-gold w-7 h-7 absolute top-5 right-6 cursor-pointer hover:scale-110 duration-200"
              onClick={() => {
                if (usersRef.current === null) return;
                const filteredUsers = usersRef.current.filter(
                  (user) =>
                    user.name.includes(inputValue) ||
                    user.sign.includes(inputValue)
                );
                setData(filteredUsers);
              }}
            />
          </>
        ) : (
          <>
            <div className="w-full text-center text-gold font-NT shadowGold text-2xl tracking-widest pt-5 pb-3 ">
              {openFriends.followers
                ? "Followers"
                : openFriends.following && "Following"}
            </div>
            <CiSearch
              className="text-gold w-7 h-7 absolute top-5 left-5 cursor-pointer hover:scale-110 duration-200"
              onClick={() => {
                setSearch(!search);
              }}
            />
          </>
        )}
        <div className="w-[90%] h-[1px] bg-gold mb-4" />
        <div
          className={`w-[90%] h-auto overflow-y-scroll flex flex-col  gap-4
        ${data && data.length === 0 ? "items-center" : ""}
        `}
        >
          {data && data.length === 0 && (
            <div className="font-NT font-normal text-center text-lg tracking-widest shadowPink tracking-wider text-pink mt-2">
              <p className="font-NT font-normal text-8xl my-4 tracking-widest shadowPink">
                {":("}
              </p>
              {search ? "Oops! No such user." : "Oops! No friends yet."}
            </div>
          )}
          {data.map((friend, i) => (
            <div
              className="flex flex-row py-2 ml-5 justify-start gap-5"
              key={i}
            >
              <img
                src={friend.image}
                alt={friend.name}
                className="rounded-full w-[60px] h-[60px] cursor-pointer hover:scale-110 duration-200"
                onClick={() => {
                  setOpenFriends({ following: false, followers: false });
                  friend.uid
                    ? navigate(`/profile/${friend.uid}`)
                    : navigate(`/profile/${friend.userUID}`);
                }}
              />
              <div>
                <h5 className="font-notoSansJP font-normal text-lg tracking-wider text-pink mt-1">
                  {friend.name}
                </h5>
                <p className="font-notoSansJP font-normal text-sm tracking-wider text-yellow mt-[2px]">
                  {friend.sign}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Friends;
