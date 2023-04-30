import { Auth, getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { useContext, useEffect } from "react";
import Profile from "./Profile/Profile";
import firebase from "../utils/firebase";
import { AuthContext } from "../context/authContext";
import Button from "../components/Button";
function Member() {
  const { user, isLogin, signIn, signOut, loading } = useContext(AuthContext);
  const auth: Auth = getAuth();
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  return (
    <>
      <div className='w-screen h-[80px] ' />
      <div className=' justify-center mx-auto flex  mt-10'>
        {isLogin ? (
          <>
            <Button
              type={"big"}
              value={"SIGN OUT"}
              action={() => signOut(auth)}
            />
            {/* <Profile /> */}
          </>
        ) : (
          <>
            <Button
              type={"big"}
              action={() => {
                signIn(auth, provider);
              }}
              value={"SIGN IN WITH GOOGLE"}
            />
          </>
        )}
      </div>
    </>
  );
}

export default Member;
