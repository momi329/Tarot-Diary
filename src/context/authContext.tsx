import { createContext, useState, useEffect } from "react";
import firebase from "../utils/firebase";

import {
  Auth,
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { isGeneratorFunction } from "util/types";
export interface User {
  name: string;
  image: string;
  sign: string;
  email: string;
  followers: [];
  following: [];
  favorite: [];
  userUID: string;
}

interface AuthContextType {
  isLogin: boolean;
  user: User;
  loading: boolean;
  userUID: string;
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
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        // User is signed in, see docs for a list of available properties
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
        setUserUID(data.userUID);
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

    // if (num === 2) {
    //   const user = await firebase.signInWithFB(auth, provider);
    //   console.log(user, "user");
    // }
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
