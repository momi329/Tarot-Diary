import { Auth, getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useContext, useEffect } from "react";
import Profile from "./Profile";
import { AuthContext } from "../context/authContext";
function Member() {
  const { user, isLogin, signIn, signOut, loading } = useContext(AuthContext);
  const auth: Auth = getAuth();
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  const fbProvider: FacebookAuthProvider = new FacebookAuthProvider();
  // useEffect(()=>{
  //   if(localStorage.getItem('userUID')){

  //   }
  // })
  return (
    <>
      {isLogin ? (
        <>
          <button
            className='p-2 bg-blue-800 text-white m-1 rounded-md'
            onClick={() => signOut(auth)}
          >
            Sign Out
          </button>
          <Profile />
        </>
      ) : (
        <>
          <button
            className='p-2 bg-orange-300 text-white m-1 rounded-md'
            onClick={() => {
              signIn(auth, provider);
            }}
          >
            Sign in with Google
          </button>
          <button
            className='p-2 bg-blue-800 text-white m-1 rounded-md'
            onClick={() => signIn(auth, fbProvider)}
          >
            Sign in with Facebook
          </button>
        </>
      )}
    </>
  );
}

export default Member;
