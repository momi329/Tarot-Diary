import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { AiOutlineArrowRight } from "react-icons/ai";
import UnderlineButton from "../components/UnderlineButton";
import UnderlineInput from "../components/UnderlineInput";

function Member() {
  const { signIn } = useContext(AuthContext);
  const [haveAccount, setHaveAccount] = useState(true);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const auth: Auth = getAuth();
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });
  const signUp = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };
  return (
    <>
      <div className='w-screen h-[100px] ' />
      <div className='mx-auto justify-center mt-15 flex flex-col  gap-5 w-[350px] items-center'>
        <>
          <UnderlineButton
            icon={
              <AiOutlineArrowRight className='text-pink scale-125 cursor-pointer' />
            }
            value={"Continue with Google"}
            action={() => signIn(auth, provider)}
            type={"memberPage"}
          />

          <span className='font-NT text-yellow tracking-widest shadowYellow mb-1 '>
            ーーorーー
          </span>
          {haveAccount ? (
            <>
              <div className=' w-full'>
                <UnderlineInput
                  name={"Email"}
                  inputType={"text"}
                  action={(e) => {
                    setSignInData({ ...signInData, email: e.target.value });
                  }}
                  value={""}
                />
              </div>
              <div className=' w-full'>
                <UnderlineInput
                  name={"Password"}
                  inputType={"password"}
                  action={(e) => {
                    setSignInData({ ...signInData, password: e.target.value });
                  }}
                  value={""}
                />
              </div>
              <UnderlineButton
                icon={
                  <AiOutlineArrowRight className='text-pink scale-125 cursor-pointer' />
                }
                value={"Start Your Journey"}
                action={() => {}}
                type={"memberPage"}
              />
              <span
                className='text-gray '
                onClick={() => {
                  setHaveAccount(false);
                }}
              >
                Have no account?
                <span className='text-yellow hover:underline cursor-pointer'>
                  Sign Up
                </span>{" "}
              </span>
            </>
          ) : (
            <>
              <div className=' w-full'>
                <UnderlineInput
                  name={"Name"}
                  inputType={"text"}
                  action={(e) => {
                    setSignUpData({ ...signUpData, name: e.target.value });
                  }}
                  value={""}
                />
              </div>
              <div className=' w-full'>
                <UnderlineInput
                  name={"Email"}
                  inputType={"text"}
                  action={(e) => {
                    setSignUpData({ ...signUpData, email: e.target.value });
                  }}
                  value={""}
                />
              </div>
              <div className=' w-full'>
                <UnderlineInput
                  name={"Password"}
                  inputType={"password"}
                  action={(e) => {
                    setSignUpData({ ...signUpData, password: e.target.value });
                  }}
                  value={""}
                />
              </div>
              <UnderlineButton
                icon={
                  <AiOutlineArrowRight className='text-pink scale-125 cursor-pointer' />
                }
                value={"Tarot it !"}
                action={() => {}}
                type={"memberPage"}
              />
              <span
                className='text-gray '
                onClick={() => {
                  setHaveAccount(true);
                }}
              >
                Already have a account?
                <span className='text-yellow hover:underline cursor-pointer'>
                  Sign In
                </span>{" "}
              </span>
            </>
          )}
        </>
      </div>
    </>
  );
}

export default Member;
