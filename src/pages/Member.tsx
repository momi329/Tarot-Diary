import { Auth, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useContext, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import UnderlineButton from "../components/UnderlineButton";
import UnderlineInput from "../components/UnderlineInput";
import { AuthContext } from "../context/authContext";
function Member() {
  const { googleSignIn, signUp, nativeSignIn } = useContext(AuthContext);
  const [haveAccount, setHaveAccount] = useState(true);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signInData, setSignInData] = useState({
    email: "TestAccount@gmail.com",
    password: "123123",
  });
  const auth: Auth = getAuth();
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  return (
    <>
      <div className="w-screen h-[100px] " />
      <div className="mx-auto justify-center mt-15 flex flex-col  gap-5 w-[350px] items-center">
        <UnderlineButton
          icon={
            <AiOutlineArrowRight className="text-pink scale-125 cursor-pointer" />
          }
          value={"Continue with Google"}
          action={() => googleSignIn(auth, provider)}
          type={"memberPage"}
        />

        <span className="font-NT text-yellow tracking-widest shadowYellow mb-1 ">
          ーーorーー
        </span>
        {haveAccount ? (
          <>
            <div className=" w-full">
              <UnderlineInput
                name={"Email"}
                inputType={"email"}
                action={(e) => {
                  setSignInData({ ...signInData, email: e.target.value });
                }}
                value={signInData.email}
              />
            </div>
            <div className="w-full">
              <UnderlineInput
                name={"Password"}
                inputType={"password"}
                action={(e) => {
                  setSignInData({ ...signInData, password: e.target.value });
                }}
                value={signInData.password}
              />
            </div>
            <UnderlineButton
              icon={
                <AiOutlineArrowRight className="text-pink scale-125 cursor-pointer" />
              }
              value={"Start Your Journey"}
              action={() => {
                nativeSignIn(auth, signInData.email, signInData.password);
              }}
              type={"memberPage"}
            />
            <span
              className="text-gray "
              onClick={() => {
                setHaveAccount(false);
              }}
            >
              Have no account?
              <span className="text-yellow hover:underline cursor-pointer">
                Sign Up
              </span>{" "}
            </span>
          </>
        ) : (
          <>
            <div className=" w-full">
              <UnderlineInput
                name={"Name"}
                inputType={"text"}
                action={(e) => {
                  setSignUpData({ ...signUpData, name: e.target.value });
                }}
                value={signUpData.name}
              />
            </div>
            <div className=" w-full">
              <UnderlineInput
                name={"Email"}
                inputType={"email"}
                action={(e) => {
                  setSignUpData({ ...signUpData, email: e.target.value });
                }}
                value={signUpData.email}
              />
            </div>
            <div className=" w-full">
              <UnderlineInput
                name={"Password"}
                inputType={"password"}
                placeholder="at least 6 characters"
                action={(e) => {
                  setSignUpData({ ...signUpData, password: e.target.value });
                }}
                value={signUpData.password}
              />
            </div>
            <UnderlineButton
              icon={
                <AiOutlineArrowRight className="text-pink scale-125 cursor-pointer" />
              }
              disabled={signUpData.password.length < 6}
              value={"Tarot it !"}
              action={() => {
                signUp(
                  auth,
                  signUpData.name,
                  signUpData.email,
                  signUpData.password
                );
              }}
              type={"memberPage"}
            />
            <span
              className="text-gray "
              onClick={() => {
                setHaveAccount(true);
              }}
            >
              Already have a account?
              <span className="text-yellow hover:underline cursor-pointer">
                Sign In
              </span>{" "}
            </span>
          </>
        )}
      </div>
    </>
  );
}

export default Member;
