import { initializeApp } from "firebase/app";
import { DocumentData, getFirestore } from "firebase/firestore";
import { signOut, signInWithPopup, Auth, UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { collection, setDoc, getDocs } from "firebase/firestore";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDjoZe3affRBuw-DUZ5WwCtBXVxc4oi0BI",
  authDomain: "tarot-diary.firebaseapp.com",
  projectId: "tarot-diary",
  storageBucket: "tarot-diary.appspot.com",
  messagingSenderId: "339110698426",
  appId: "1:339110698426:web:f115d61ea8668a6a565183",
  measurementId: "G-L8RC14KPQY",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const firebase = {
  async signIn(
    auth: Auth,
    provider: GoogleAuthProvider | FacebookAuthProvider
  ): Promise<UserCredential> {
    const res = await signInWithPopup(auth, provider);
    const user = res.user;
    localStorage.setItem("userUID", user.uid);
    return res;
  },
  async signOut(auth: Auth) {
    await signOut(auth);
    localStorage.removeItem("userUID");
    console.log("登出");
  },
  async setUserDoc(data: DocumentData) {
    console.log(data, "data");
    const docRef = doc(db, "users", `${data.userUID}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("帳戶已存在");
      return;
    } else {
      console.log("帳戶不存在");
      const userRef = collection(db, "users");
      await setDoc(doc(userRef, data.userUID), data);
    }
  },
  async getUserDesign(userUID: string) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const newData: DocumentData[] | never[] = await data.filter(
      (i) => i.userUID === userUID
    );
    return newData;
  },
  async getUserDiary(userUID: string) {
    const docRef = doc(db, "users", userUID, "diary", userUID);
    const docSnap = await getDoc(docRef);
    return docSnap;
  },
  async getDesign(id: string) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data: any[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const newData: any[] = data.filter((i) => i.spreadId === id);
    return newData;
  },
};
export default firebase;
