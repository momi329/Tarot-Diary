import { createContext, useState } from "react";
import firebase from "../utils/firebase";

import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
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

export const AuthContextProvider: React.FC = ({ children }: any) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User>({
    name: "",
    image: "",
    sign: "",
    email: "",
    followers: [],
    following: [],
    favorite: [],
    userUID: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [userUID, setUserUID] = useState<string>("");

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
  };

  const signOut = async (auth: Auth): Promise<void> => {
    setLoading(true);
    await firebase.signOut(auth);
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
