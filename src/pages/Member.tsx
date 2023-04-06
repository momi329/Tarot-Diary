import app from "../Firebaseapp";
import db from "../Firebasedb";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { collection, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Profile from "./Profile";

function Member() {
  const [isLogIn, setIsLogIn] = useState(false);
  //const[user,setUser]=useState()
  const getUserUID = () => {
    const iserUID = localStorage.getItem("userUID");
    if (iserUID) {
      setIsLogIn(true);
    } else {
      setIsLogIn(false);
    }
  };
  useEffect(() => {
    getUserUID();
  }, []);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();

  const handleSignIn = (auth, provider) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // 登入成功，處理結果
        setIsLogIn(true);
        const user = result.user;
        localStorage.setItem("userUID", user.uid);
        console.log(user.displayName);
        userExist(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleSignOut = async () => {
    await localStorage.removeItem("userUID");
    setIsLogIn(false);
  };
  async function userExist(user) {
    console.log("herre");
    const docRef = doc(db, "users", `${user.uid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      //如果帳戶已存在
      console.log("?");
      return;
    } else {
      //如果帳戶不存在
      const userRef = collection(db, "users");
      await setDoc(doc(userRef, user.uid), {
        name: user.displayName,
        image: user.photoURL,
        sign: "",
        email: user.email,
        followers: [],
        following: [],
        spreads: [],
        favorite: [],
        userUID: user.uid,
      });
    }
  }

  return (
    <>
      {isLogIn ? (
        <>
          <button
            className='p-2 bg-blue-800 text-white m-1 rounded-md'
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <Profile />
        </>
      ) : (
        <>
          <button
            className='p-2 bg-orange-300 text-white m-1 rounded-md'
            onClick={() => handleSignIn(auth, provider)}
          >
            Sign in with Google
          </button>
          <button
            className='p-2 bg-blue-800 text-white m-1 rounded-md'
            onClick={() => handleSignIn(auth, fbProvider)}
          >
            Sign in with Facebook
          </button>
        </>
      )}
    </>
  );
}

export default Member;
