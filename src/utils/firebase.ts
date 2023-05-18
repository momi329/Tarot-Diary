import { initializeApp } from "firebase/app";
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  UserCredential,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  DocumentData,
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import type { Comment, FriendsData, SpreadData } from "./type";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "tarot-diary.firebaseapp.com",
  projectId: "tarot-diary",
  storageBucket: "tarot-diary.appspot.com",
  messagingSenderId: "339110698426",
  appId: "1:339110698426:web:f115d61ea8668a6a565183",
  measurementId: "G-L8RC14KPQY",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage();

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
  },
  async setUserDoc(data: DocumentData) {
    const docRef = doc(db, "users", `${data.userUID}`);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
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
  async uploaduserImg(userUID, file) {
    try {
      const storageRef = ref(storage, `image/${userUID + file.name}`);
      await uploadBytes(storageRef, file);
      const imageURL = await getDownloadURL(storageRef);
      return imageURL;
    } catch (e) {
      window.alert(`error ${e}`);
      return null;
    }
  },
  async getUserDesign(userUID: string) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    const data: DocumentData[] = [];
    querySnapshot.forEach((designData) => {
      data.push(designData.data());
    });
    const newData: DocumentData[] | never[] = await data.filter(
      (i) => i.userUID === userUID || i.userUID === "all"
    );
    return newData;
  },
  async getUserDiary(userUID: string) {
    const q = query(collection(db, "users", userUID, "diary"));
    const querySnapshot = await getDocs(q);
    const diaryData: object[] = [];
    querySnapshot.forEach((y) => {
      diaryData.push(y.data());
    });
    return diaryData;
  },
  async getDesign(id: string) {
    try {
      const querySnapshot = await getDocs(collection(db, "spreads"));
      const data: DocumentData[] = [];
      await querySnapshot.forEach((design) => {
        data.push(design.data());
      });
      const newData = data.filter((i) => i.spreadId === id);
      const spreadData = [...newData];
      if (!spreadData[0].userUID) return (spreadData[0].author = "預設");

      const docRef = doc(db, "users", `${spreadData[0]?.userUID}`);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      spreadData[0].author = docSnap.data().name;
      return spreadData;
    } catch (e) {
      window.alert(`error ${e}`);
      return null;
    }
  },
  async saveDesign(data: SpreadData) {
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
      window.alert(`error ${e}`);
    }
  },
  async newDivinedData(docData, userUID) {
    const docRef = await addDoc(
      collection(db, "users", userUID, "diary"),
      docData
    );
    await updateDoc(docRef, {
      // time: serverTimestamp(),
      docId: docRef.id,
    });
    return docRef.id;
  },
  async getProfile(userUID) {
    const docRef = doc(db, "users", userUID);
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
    }
    return null;
  },
  async getOtherUserDiary(uid) {
    const docRef = doc(db, "users", uid);
    const data = await getDoc(docRef);
    const diary: DocumentData[] = [];
    if (data.exists()) {
      const userData = data.data();
      const diaryRef = collection(db, "users", uid, "diary");
      const q = query(diaryRef, where("secret", "==", false));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((diaryItem) => {
        const otherUserData = diaryItem.data();

        diary.push({
          ...otherUserData,
          user: uid,
          userImg: userData.image,
          userName: userData.name,
        });
      });
    }
    return diary;
  },
  async getOtherUserSpread(uid) {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    const otherUserSpread: DocumentData[] = [];
    querySnapshot &&
      querySnapshot.forEach((otherSpread) => {
        otherUserSpread.push(otherSpread.data());
      });
    const newData: DocumentData[] | never[] = await otherUserSpread.filter(
      (i) => i.userUID === uid
    );
    return newData;
  },
  async getAllFollowingDiary(user) {
    const diary: DocumentData[] = [];
    await Promise.all(
      user.following.map(async (person) => {
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: DocumentData | undefined = getFollowingUser.data();
        const diaryRef = collection(db, "users", person, "diary");
        const q = query(diaryRef, where("secret", "==", false));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((allFollingDiary) => {
          const newDocData = {
            ...allFollingDiary.data(),
            user: followingUser?.userUID,
            userImg: followingUser?.image,
            userName: followingUser?.name,
            seeMore: false,
          };
          diary.push(newDocData);
        });
      })
    );
    const q = query(collection(db, "users", user.userUID, "diary"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((myDiary) => {
      const newDocData = {
        ...myDiary.data(),
        user: user.userUID,
        userImg: user.image,
        userName: user.name,
        addComment: false,
        seeMore: false,
      };
      diary.push(newDocData);
    });
    diary.sort((a, b) => {
      return a.time.seconds - b.time.seconds;
    });
    return diary;
  },
  async getAllFollowingSpread(user) {
    const spread: DocumentData[] = [];
    await Promise.all(
      user.following.map(async (person) => {
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: DocumentData | undefined = getFollowingUser.data();
        const q = query(
          collection(db, "spreads"),
          where("userUID", "==", person)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((all) => {
          const newDocData = {
            ...all.data(),
            user: followingUser?.userUID,
            userImg: followingUser?.image,
            userName: followingUser?.name,
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
    querySnapshot.forEach((followingSpread) => {
      const newDocData = {
        ...followingSpread.data(),
        user: user.userUID,
        userImg: user.image,
        userName: user.name,
      };
      spread.push(newDocData);
    });
    return spread;
  },
  async snapshotFollowingDiary(user) {
    const diary: DocumentData[] = [];
    user.following.map(async (person) => {
      const q = query(collection(db, "users"), where("userUID", "==", person));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((snapshot) => {
          diary.push(snapshot.data());
        });
      });
      return diary;
    });
  },
  async getAllSpread(): Promise<SpreadData[]> {
    const querySnapshot = await getDocs(collection(db, "spreads"));
    const spread: SpreadData[] = [];
    querySnapshot.forEach((allSpread) => {
      spread.push(allSpread.data() as SpreadData);
    });
    return spread;
  },
  async getAllUserName(data) {
    const newData: object[] = [];
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
    const targetRef = doc(db, "users", uid);
    await updateDoc(targetRef, {
      followers: arrayUnion(userUID),
    });
    const myRef = doc(db, "users", userUID);
    await updateDoc(myRef, {
      following: arrayUnion(uid),
    });
  },
  async unfollow(uid, userUID) {
    const targetRef = doc(db, "users", uid);
    await updateDoc(targetRef, {
      followers: arrayRemove(userUID),
    });
    const myRef = doc(db, "users", userUID);
    await updateDoc(myRef, {
      following: arrayRemove(uid),
    });
  },
  async getFriendsProfile(followers, following) {
    const friendsData: FriendsData = { followers: [], following: [] };

    const followersPromises = followers.map(async (i) => {
      const docRef = doc(db, "users", i);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const follower = {
          name: docSnap.data().name,
          image: docSnap.data().image,
          sign: docSnap.data().sign,
          uid: docSnap.data().userUID,
        };
        return follower;
      }
      window.alert("no document");
      return null;
    });

    const followingPromises = following.map(async (i) => {
      const docRef = doc(db, "users", i);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const follow = {
          name: docSnap.data().name,
          image: docSnap.data().image,
          sign: docSnap.data().sign,
          uid: docSnap.data().userUID,
        };
        return follow;
      }
      window.alert("no document");
      return null;
    });

    const followersData = await Promise.all(followersPromises);
    const followingData = await Promise.all(followingPromises);

    friendsData.followers = followersData.filter(
      (follower) => follower !== null
    );
    friendsData.following = followingData.filter((follow) => follow !== null);

    return friendsData;
  },
  async getCommentsProfile(data) {
    const comments: Comment[] = [];
    await Promise.all(
      data.map(async (i) => {
        const docRef = doc(db, "users", i.user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const comment: Comment = {
            userName: docSnap.data().name,
            userImg: docSnap.data().image,
            comment: i.comment,
            user: i.user,
          };
          comments.push(comment);
        }
      })
    );
    return comments;
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
    try {
      if (data.docId) {
        const diaryRef = doc(db, "users", data.user, "diary", data.docId);
        await updateDoc(diaryRef, {
          comment: data.comment,
        });
      } else {
        const spreadRef = doc(db, "spreads", data.spreadId);
        await updateDoc(spreadRef, {
          comment: data.comment,
        });
      }
    } catch (e: any) {
      window.alert(e.code);
    }
  },
  async updateLike(data) {
    if (data.docId) {
      const diaryRef = doc(db, "users", data.user, "diary", data.docId);
      await updateDoc(diaryRef, {
        like: data.like,
      });
    } else {
      const spreadRef = doc(db, "spreads", data.spreadId);
      await updateDoc(spreadRef, {
        like: data.like,
      });
    }
  },
  async getAllUsers() {
    const users: DocumentData[] = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    await querySnapshot.forEach((allUsers) => {
      users.push(allUsers.data());
    });
    return users;
  },
};
export default firebase;
