import { initializeApp } from "firebase/app";
import { arrayRemove, DocumentData, getFirestore } from "firebase/firestore";
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
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
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
  //參訪其他人頁面
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
  //參訪其他人頁面
  async getOtherUserDiary(uid) {
    const diaryRef = collection(db, "users", uid, "diary");
    const q = query(diaryRef, where("secret", "==", false));
    const querySnapshot = await getDocs(q);
    const diary: DocumentData[] = [];
    querySnapshot.forEach((doc) => {
      diary.push(doc.data());
    });

    return diary;
  },

  //參訪其他人頁面
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
  //追蹤中的日記
  async getAllFollowingDiary(user) {
    let diary: DocumentData[] = [];
    await Promise.all(
      user.following.map(async (person) => {
        console.log(person, "person");
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: any = getFollowingUser.data();
        const diaryRef = collection(db, "users", person, "diary");
        const q = query(diaryRef, where("secret", "==", false));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const newDocData = {
            ...doc.data(),
            user: followingUser.userUID,
            userImg: followingUser.image,
            userName: followingUser.name,
          };
          diary.push(newDocData);
        });
      })
    );
    const q = query(collection(db, "users", user.userUID, "diary"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const newDocData = {
        ...doc.data(),
        user: user.userUID,
        userImg: user.image,
        userName: user.name,
        addComment: false,
      };
      diary.push(newDocData);
    });
    diary.sort(function (a, b) {
      return a.time.seconds - b.time.seconds;
    });
    return diary;
  },
  //追蹤中的排陣
  async getAllFollowingSpread(user) {
    let spread: DocumentData[] = [];
    await Promise.all(
      user.following.map(async (person) => {
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: any = getFollowingUser.data();
        const q = query(
          collection(db, "spreads"),
          where("userUID", "==", person)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const newDocData = {
            ...doc.data(),
            user: followingUser.userUID,
            userImg: followingUser.image,
            userName: followingUser.name,
            addComment: false,
          };
          spread.push(newDocData);
        });
      })
    );
    const q = query(
      collection(db, "spreads"),
      where("userUID", "==", user.userUID)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const newDocData = {
        ...doc.data(),
        user: user.userUID,
        userImg: user.image,
        userName: user.name,
      };
      spread.push(newDocData);
    });
    return spread;
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
      following: arrayUnion(uid),
    });
  },
  async unfollow(uid, userUID) {
    //對方followers去掉我
    const targetRef = doc(db, "users", uid);
    await updateDoc(targetRef, {
      followers: arrayRemove(userUID),
    });
    //我的following去掉他
    const myRef = doc(db, "users", userUID);
    await updateDoc(myRef, {
      following: arrayRemove(uid),
    });
  },
  async uploadBlob(userUID, file) {
    console.log("上傳");
    const storage = getStorage();
    const storageRef = ref(storage, `images/${userUID}`);
    // 'file' comes from the Blob or File API
    await uploadBytes(storageRef, file);
    const imageURL = await getDownloadURL(storageRef);
    return imageURL;
  },
  async updateDiary(userUID, docId, data) {
    const diaryRef = doc(db, "users", userUID, "diary", docId);
    await updateDoc(diaryRef, {
      content: data.content,
      secret: data.secret,
    });
  },
  async deleteDiary(userUID, docID) {
    await deleteDoc(doc(db, "users", userUID, "diary", docID));
  },
  async updateComment(user, data) {
    // 就是日記
    try {
      if (data.docId) {
        const diaryRef = doc(db, "users", user, "diary", data.docId);
        await updateDoc(diaryRef, {
          comment: data.comment,
          time: Timestamp.fromDate(new Date()),
        });
        //alert("成功");
      } else {
        //牌陣
        const spreadRef = doc(db, "spreads", data.spreadId);
        await updateDoc(spreadRef, {
          comment: data.comment,
          time: Timestamp.fromDate(new Date()),
        });
        //alert("成功");
      }
    } catch (e) {
      console.error("error", e);
    }
  },
  async updateLike(data) {
    if (data.docId) {
      const diaryRef = doc(db, "users", data.user, "diary", data.docId);
      await updateDoc(diaryRef, {
        like: data.like,
      });
      //alert("成功");
    } else {
      //牌陣
      const spreadRef = doc(db, "spreads", data.spreadId);
      await updateDoc(spreadRef, {
        like: data.like,
      });
      //alert("成功");
    }
  },
};
export default firebase;
