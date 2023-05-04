import { initializeApp } from "firebase/app";
import type { FriendsData, SpreadData } from "./type";
import {
  arrayRemove,
  DocumentData,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
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
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
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
  async updateUserData(userUID, data) {
    const userDataRef = doc(db, "users", userUID);
    await updateDoc(userDataRef, {
      name: data.name,
      image: data.image,
      sign: data.sign,
    });
  },
  async uploadUserImage(userUID, file) {
    try {
      const storageRef = ref(storage, `image/${userUID + file.name}`);
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      console.log(imageURL);
      return imageURL;
    } catch (e) {
      console.error("error", e);
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
    // const q = query(diaryRef, where("secret", "==", false));
    const querySnapshot = await getDocs(diaryRef);
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
    querySnapshot &&
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
  async snapshotFollowingDiary(user) {
    let diary: DocumentData[] = [];
    user.following.map(async (person) => {
      const q = query(collection(db, "users"), where("userUID", "==", person));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          diary.push(doc.data());
        });
      });
      return diary;
    });
  },
  async getAllSpread(): Promise<SpreadData[]> {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    let spread: SpreadData[] = [];

    await querySnapshot.forEach((doc) => {
      spread.push(doc.data() as SpreadData);
    });
    return spread;
  },
  async getAllUserName(data) {
    let newData: {}[] = [];
    await data.forEach(async (i) => {
      if (i.userUID === "all") {
        newData.push({ ...i, name: "預設" });
      } else {
        const docRef = doc(db, "users", `${i.userUID}`);
        const docSnap = await getDoc(docRef);
        docSnap.exists() && newData.push({ ...i, name: docSnap.data().name });
      }
    });
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
  async getFriendsProfile(followers, following) {
    const friendsData: FriendsData = { followers: [], following: [] };
    followers &&
      followers.length !== 0 &&
      (await followers.forEach(async (i) => {
        const docRef = doc(db, "users", i);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const followers = {
            name: docSnap.data().name,
            image: docSnap.data().image,
            sign: docSnap.data().sign,
            uid: docSnap.data().userUID,
          };
          friendsData.followers.push(followers);
        } else {
          console.log("no document");
        }
      }));
    following &&
      following.length !== 0 &&
      (await following.forEach(async (i) => {
        const docRef = doc(db, "users", i);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const following = {
            name: docSnap.data().name,
            image: docSnap.data().image,
            sign: docSnap.data().sign,
            uid: docSnap.data().userUID,
          };
          friendsData.following.push(following);
        } else {
          console.log("no document");
        }
      }));
    return friendsData;
  },
  async getCommentsProfile(data) {
    const comments = [];
    await Promise.all(
      data.map(async (i) => {
        const docRef = doc(db, "users", i.user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const comment = {
            userName: docSnap.data().name,
            userImage: docSnap.data().image,
            comment: i.comment,
            user: i.user,
          };
          console.log("comment", comment);
          comments.push(comment);
        }
      })
    );
    return comments;
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
  async updateComment(data) {
    // 就是日記
    try {
      if (data.docId) {
        const diaryRef = doc(db, "users", data.user, "diary", data.docId);
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
