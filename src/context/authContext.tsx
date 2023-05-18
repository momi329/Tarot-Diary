import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import firebase from "../utils/firebase";
import { SpreadData } from "../utils/type";
import { LoadingContext } from "./loadingContext";

import type { User } from "../utils/type";

type AuthContextType = {
  isLogin: boolean;
  user: User;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  userUID: string;
  setUser: (user: User) => void;
  googleSignIn: (
    auth: Auth,
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => Promise<void>;
  nativeSignIn: (
    auth: Auth,

    email: string,
    password: string
  ) => Promise<void>;
  signOut: (auth: Auth) => Promise<void>;
  signUp: (
    auth: Auth,
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  spreads: SpreadData[] | null;
  openSignIn: boolean;
  setOpenSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
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
  loading: true,
  setLoading: () => {},
  userUID: "",
  googleSignIn: async () => {},
  nativeSignIn: async () => {},
  signOut: async () => {},
  signUp: async () => {},
  spreads: null,
  openSignIn: false,
  setOpenSignIn: () => {},
  alert: false,
  setAlert: () => {},
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
  const [loading, setLoading] = useState<boolean>(false);
  const [userUID, setUserUID] = useState<string>("");
  const [spreads, setSpread] = useState<SpreadData[] | null>(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [alert, setAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setIsLoading } = useContext(LoadingContext);

  async function getUsers(userUID) {
    const getUser = firebase.getUser(userUID);
    return getUser;
  }
  async function getAllSpread() {
    const spreads: SpreadData[] = await firebase.getAllSpread();
    const addNameSpreads = await firebase.getAllUserName(spreads);
    if (spreads) {
      setSpread(shuffle(addNameSpreads));
    }
  }
  useEffect(() => {
    getAllSpread();
  }, []);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        const getUser = await getUsers(user.uid);
        setUserUID(user.uid);
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
      } else {
        setIsLogin(false);
      }
    });
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const googleSignIn = async (
    auth: ReturnType<typeof getAuth>,
    provider: GoogleAuthProvider | FacebookAuthProvider
  ) => {
    const user = await firebase.signIn(auth, provider);
    const getUser = await getUsers(user.user.uid);
    setUserUID(user.user.uid);
    if (getUser) {
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
      await firebase.setUserDoc(data);
      setUser(data);
      setUserUID(data.userUID);
      setIsLogin(true);
      setOpenSignIn(false);
      if (
        location.pathname.includes("sign") ||
        location.pathname.includes("profile")
      ) {
        navigate(`/profile/${data.userUID}`, { replace: true });
      }
    } else {
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
      if (location.pathname.includes("signin")) {
        navigate(`/profile/${data.userUID}`, { replace: true });
      }
    }
  };
  const signUp = async (
    auth: Auth,
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const data: User = {
        name: name,
        image:
          "https://images.unsplash.com/photo-1520763185298-1b434c919102?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80",
        sign: "",
        email: user.email || "",
        followers: [],
        following: [],
        favorite: [],
        userUID: user.uid || "",
      };
      await firebase.setUserDoc(data);
      setUser(data);
      setUserUID(data.userUID);
      setIsLogin(true);
      if (location.pathname.includes("signin")) {
        navigate(`/profile/${data.userUID}`, { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const nativeSignIn = async (auth: Auth, email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    setUserUID(user.uid);
    const getUser = await getUsers(user.uid);
    if (getUser) {
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
      await firebase.setUserDoc(data);
      setUser(data);
      setUserUID(data.userUID);
      setIsLogin(true);
      setOpenSignIn(false);
      if (
        location.pathname.includes("sign") ||
        location.pathname.includes("profile")
      ) {
        navigate(`/profile/${data.userUID}`, { replace: true });
      }
    }
  };

  const signOut = async (auth: Auth): Promise<void> => {
    setAlert(true);
    await firebase.signOut(auth);
    setUser(initialUserData);
    setUserUID("");
    setIsLogin(false);
    setTimeout(() => {
      setAlert(false);
    }, 5000);
  };
  return (
    <AuthContext.Provider
      value={{
        isLogin,
        user,
        setUser,
        loading,
        setLoading,
        userUID,
        googleSignIn,
        nativeSignIn,
        signOut,
        spreads,
        openSignIn,
        setOpenSignIn,
        alert,
        setAlert,
        signUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
