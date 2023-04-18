import { createContext, useState, useEffect } from "react";
import firebase from "../utils/firebase";
import { useNavigate } from "react-router-dom";

import {
  Auth,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";

export interface User {
  name: string;
  image: string;
  sign: string;
  email: string;
  followers: string[];
  following: string[];
  favorite: [];
  userUID: string;
}

interface AuthContextType {
  isLogin: boolean;
  user: User;
  loading: boolean;
  userUID: string;
  setUser: (user: User) => void;
  signIn: (
    auth: Auth,
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => Promise<void>;
  signOut: (auth: Auth) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  user: {
    name: "",
    image: "",
    sign: "",
    email: "",
    followers: [],
    following: [],
    favorite: [],
    userUID: "",
  },
  setUser: (user: User) => {},
  loading: false,
  userUID: "",
  signIn: async () => {},
  signOut: async () => {},
});
const initialUserData: User = {
  name: "",
  image: "",
  sign: "",
  email: "",
  followers: [],
  following: [],
  favorite: [],
  userUID: "",
};
export const AuthContextProvider: React.FC = ({ children }: any) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User>(initialUserData);
  const [loading, setLoading] = useState<boolean>(true);
  const [userUID, setUserUID] = useState<string>("");
  const navigate = useNavigate();
  async function getUsers(userUID) {
    const getUser = firebase.getUser(userUID);
    return getUser;
  }

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        const getUser = await getUsers(user.uid);
        setUserUID(user.uid);
        console.log("getUser", getUser);
        if (getUser) {
          setIsLogin(true);
          const data: User = {
            name: getUser.name || "",
            image: getUser.image || "",
            sign: getUser.sign || "",
            email: getUser.email || "",
            followers: getUser.followers,
            following: getUser.following,
            favorite: getUser.favorite,
            userUID: getUser.userUID || "",
          };
          setUser(data);
          setUserUID(user.uid);
        } else {
          console.log("沒有");
          setIsLogin(true);
          const data: User = {
            name: user.displayName || "",
            image: user.photoURL || "",
            sign: "",
            email: user.email || "",
            followers: [],
            following: [],
            favorite: [],
            userUID: user.uid || "",
          };
          setUser(data);
        }
        //navigate(`/profile/${data.userUID}`, { replace: true });
      } else {
        // User is signed out
        setIsLogin(false);
      }
    });
  }, []);
  const signIn = async (
    auth: ReturnType<typeof getAuth>,
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => {
    const user = await firebase.signIn(auth, provider);
    const data: User = {
      name: user.user.displayName || "",
      image: user.user.photoURL || "",
      sign: "",
      email: user.user.email || "",
      followers: [],
      following: [],
      favorite: [],
      userUID: user.user.uid || "",
    };
    await firebase.setUserDoc(data);
    setUser(data);
    setUserUID(data.userUID);
    setIsLogin(true);
    navigate(`/profile/${data.userUID}`, { replace: true });
  };

  const signOut = async (auth: Auth): Promise<void> => {
    setLoading(false);
    await firebase.signOut(auth);
    setUser(initialUserData);
    setUserUID("");
    setIsLogin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        setUser,
        loading,
        userUID,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
