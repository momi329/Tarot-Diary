import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { DocumentData } from "firebase/firestore";

import Diary from "../components/Diary";
import firebase from "../utils/firebase";
function Profile(): JSX.Element {
  const { isLogin, user, userUID } = useContext(AuthContext);
  const [userDesign, setUserDesign] = useState<DocumentData[] | never[]>([]);
  const [page, setPage] = useState<Number>(3);

  useEffect(() => {
    async function getUserDesign(userUID: string) {
      const newData = await firebase.getUserDesign(userUID);
      setUserDesign(newData);
    }
    getUserDesign(userUID);
  }, [page, isLogin, userUID]);
  const switchPage = (num: Number) => {
    setPage(num);
    return;
  };
  if (!isLogin) {
    alert("請先登入");
    return <></>;
  }
  return (
    <>
      <div className='flex flex-row gap-5'>
        <img
          src={user.image ?? undefined}
          alt={user.name ?? undefined}
          className='rounded-full'
        />
        <div>
          <h5>{user.name}</h5>
          <p>{user.sign}</p>
        </div>
        {user.followers && (
          <div className='flex flex-row gap-5'>
            <span className='flex flex-col items-center'>
              <h1>{user.followers.length}</h1>
              <p>Followers</p>
            </span>
            <span className='flex flex-col items-center'>
              <h1>{user.following.length}</h1>
              <p>Following</p>
            </span>
            <span className='flex flex-col items-center'>
              <h1>{user.following.length}</h1>
              <p>Article(Todo)</p>
            </span>
          </div>
        )}
      </div>
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
      {page === 3 && (
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
                  <p className='text-xs mt-1  tracking-wide'>{user.name}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}
      {page === 2 && <Diary />}
    </>
  );
}
export default Profile;
