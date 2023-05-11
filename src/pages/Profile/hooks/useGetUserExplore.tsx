import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import type { Spread, Comment } from "../../../utils/type";

type FriendsPosts = {
  content?: string;
  image: string;
  spread: Spread[];
  description: string;
  secret?: boolean;
  time: Timestamp;
  askGpt: string;
  title: string;
  like: string[];
  docId?: string;
  question: string;
  spreadId: string;
  userUID: string;
  user: string;
  userImg: string;
  userName: string;
  comment?: Comment[];
};
function useGetUserExplore() {
  const { user } = useContext(AuthContext);
  const [friendsPosts, setFriendsPosts] = useState<FriendsPosts[] | null>(null);
  const { uid } = useParams();
  useEffect(() => {
    if (user.userUID !== uid) {
      setFriendsPosts(null);
    }
    const allPerson = [...user.following, user.userUID];
    allPerson &&
      allPerson.map(async (person) => {
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: any = getFollowingUser.data();
        const q = query(
          collection(db, "users", person, "diary"),
          where("secret", "==", false)
        );
        onSnapshot(q, { includeMetadataChanges: false }, (querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const newDocData = {
                ...change.doc.data(),
                user: followingUser.userUID,
                userImg: followingUser.image,
                userName: followingUser.name,
              } as FriendsPosts;
              setFriendsPosts((prev) =>
                prev ? [...prev, newDocData] : [newDocData]
              );
            }
          });
        });
      });

    allPerson &&
      allPerson.map(async (person) => {
        const docRef = doc(db, "users", person);
        const getFollowingUser = await getDoc(docRef);
        const followingUser: any = getFollowingUser.data();
        const q = query(
          collection(db, "spreads"),
          where("userUID", "==", person)
        );
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added" && change.doc.data().time) {
              const newDocData = {
                ...change.doc.data(),
                user: person,
                userImg: followingUser.image,
                userName: followingUser.name,
              } as FriendsPosts;
              setFriendsPosts((prev) => {
                if (prev) {
                  return [...prev, newDocData];
                } else {
                  return [newDocData];
                }
              });
            }
          });
        });
      });
  }, [uid]);

  return { friendsPosts };
}
export default useGetUserExplore;
