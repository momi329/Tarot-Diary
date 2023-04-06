import app from "../Firebaseapp";
import db from "../Firebasedb";
import { Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
function Profile() {
  const uid = localStorage.getItem("userUID");
  const [user, setUser] = useState({});
  const [userDesign, setUserDesign] = useState([]);
  const [page, setPage] = useState(3);
  async function getUserData() {
    const docRef = doc(db, "users", uid);
    const userData = await getDoc(docRef);
    if (userData !== null) {
      await setUser(userData.data());
      getUserDesign(userData.data());
    } else {
      console.log("No such document!");
    }
  }
  async function getUserDesign(user) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    console.log("data", data);
    const newData = await data.filter((i) => i.userUID === user.userUID);
    console.log("newData", newData, user.userUID, user);
    setUserDesign(newData);
    console.log("here");
  }
  useEffect(() => {
    getUserData();
  }, []);
  const switchPage = (num) => {
    setPage(num);
    return;
  };
  if (user.length === 0 || user === null) {
    return;
  }
  return (
    <>
      <div className='flex flex-row gap-5'>
        <img src={user.image} alt={user.name} className='rounded-full' />
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
          {userDesign.map((spread) => {
            return (
              <div
                className='w-[200px] h-[200px] bg-cover relative'
                style={{ backgroundImage: `url(${spread.image})` }}
                key={spread.spreadId}
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
    </>
  );
}
export default Profile;
