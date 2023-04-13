import { initializeApp } from "firebase/app";
import { DocumentData, getFirestore } from "firebase/firestore";
import { signOut, signInWithPopup, Auth, UserCredential } from "firebase/auth";
import { doc, getDoc, addDoc } from "firebase/firestore";
import {
  collection,
  setDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
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
  // async signInWithFB(auth: Auth, provider: FacebookAuthProvider) {
  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     // The signed-in user info.
  //     const user = result.user;
  //     // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  //     const credential = FacebookAuthProvider.credentialFromResult(result);
  //     const accessToken = credential.accessToken;
  //     // console.log(result);
  //     return user;
  //   } catch (error) {
  //     // Handle Errors here.
  //     const errorCode = error.code;
  //     const errorMessage = error.message;
  //     // The email of the user's account used.
  //     const email = error.customData.email;
  //     // The AuthCredential type that was used.
  //     const credential = FacebookAuthProvider.credentialFromError(error);

  //     // ...
  //   }
  // },
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
      (i) => i.userUID === userUID || i.userUID === "all"
    );
    return newData;
  },
  async getUserDiary(userUID: string) {
    const docRef = doc(db, "users", userUID, "diary", userUID);
    const docSnap = await getDoc(docRef);
    return docSnap;
  },
  async getDesign(id: string) {
    try {
      const querySnapshot = await getDocs(collection(db, "spreads"));
      let data: any[] = [];
      await querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      if (id.length < 10) {
        const newData: any[] = data.filter((i) => i.spreadId === id);
        return newData;
      }
      const newData: any[] = data.filter((i) => i.spreadId === id);
      return newData;
    } catch (e) {
      console.error("error", e);
    }
  },
  async saveDesign(data: any) {
    await addDoc(collection(db, "spreads"), data);
  },
  async userDiary(userUID: string, data) {
    try {
      const docRef = doc(db, "users", userUID, "diary", userUID);
      await updateDoc(docRef, {
        diary: arrayUnion(data),
      });
      alert("成功更新日記");
    } catch (e) {
      console.error("error", e);
    }
  },
  async newDivinedData(docData, userUID) {
    const docRef = await addDoc(
      collection(db, "users", userUID, "diary"),
      docData
    );
    await updateDoc(docRef, {
      timestamp: serverTimestamp(),
      docId: docRef.id,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  },
};
export default firebase;
