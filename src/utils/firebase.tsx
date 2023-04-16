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
  query,
  where,
} from "firebase/firestore";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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
const storage = getStorage();
const storageRef = ref(storage);

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
  async getUser(userUID) {
    const docRef = doc(db, "users", userUID);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
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
    // const docRef = (db, "users", userUID, "diary");
    // const docSnap = await getDoc(docRef);
    // return docSnap;
    const q = query(collection(db, "users", userUID, "diary"));
    const querySnapshot = await getDocs(q);
    const diaryData: {}[] = [];
    querySnapshot.forEach((doc) => {
      diaryData.push(doc.data());
    });
    return diaryData;
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
      time: serverTimestamp(),
      docId: docRef.id,
    });
    return docRef.id;
  },
  // async uploadImage(files, userUID) {
  //   const urls: string[] = [];
  //   const metadata = {
  //     contentType: "image/jpeg",
  //   };
  //   const promises = [];

  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     const storageRef = ref(storage, `images/${userUID}` + file.name);
  //     const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  //     const promise = getDownloadURL(storageRef).then((photoURL) => {
  //       urls.push(photoURL);
  //     });
  //     promises.push(promise);
  //   }
  //   await Promise.all(promises);
  //   return urls;
  // },
  async uploadArticle(userUID, data) {
    try {
      const docRef = await addDoc(collection(db, "article"), data);
      console.log("Document written with ID: ", docRef.id);
      const newRef = doc(db, "article", docRef.id);
      await updateDoc(newRef, {
        docId: docRef.id,
      });
      alert("儲存成功");
    } catch (e) {
      console.error("error", e);
    }
  },
  async getProfile(userUID) {
    const docRef = doc(db, "users", `${userUID}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name,
        image: data.image,
        sign: data.sign,
        favorite: data.favorite,
        followers: data.followers,
        following: data.following,
      };
    } else {
      console.log("No such document!");
    }
  },
  async getOtherUserDiary(uid) {
    const diaryRef = collection(db, "users", uid, "diary");
    const q = query(diaryRef, where("secret", "==", false));
    const querySnapshot = await getDocs(q);
    const diary: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      diary.push(doc.data());
      console.log("diary", doc.data());
    });
    console.log("diary", diary);

    return diary;
  },

  async getOtherUserSpread(uid) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let data: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      data.push(doc.data());
    });
    const newData: DocumentData[] | never[] = await data.filter(
      (i) => i.userUID === uid
    );
    return newData;
  },
  async follow(uid, userUID) {
    //對方followers加我
    const targetRef = doc(db, "users", uid);
    await updateDoc(targetRef, {
      followers: arrayUnion(userUID),
    });
    //我的following加他
    const myRef = doc(db, "users", userUID);
    await updateDoc(myRef, {
      following: arrayUnion(userUID),
    });
  },
  async unfollow() {
    return;
  },
};
export default firebase;
