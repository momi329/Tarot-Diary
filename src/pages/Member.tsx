import { Auth, getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useContext, useEffect } from "react";
import Profile from "./Profile";
import firebase from "../utils/firebase";
import { AuthContext } from "../context/authContext";
function Member() {
  const { user, isLogin, signIn, signOut, loading } = useContext(AuthContext);
  const auth: Auth = getAuth();
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
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
          {/* <Profile /> */}
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
        </>
      )}
    </>
  );
}

export default Member;
