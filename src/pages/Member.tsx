import app from "../Firebaseapp";
import { Auth, getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useContext } from "react";
import Profile from "./Profile";
import { AuthContext } from "../context/authContext";
import firebase from "../utils/firebase";
function Member() {
  const { user, isLogin, signIn, signOut, loading } = useContext(AuthContext);
  const auth: Auth = getAuth(app);
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  const fbProvider: FacebookAuthProvider = new FacebookAuthProvider();

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
