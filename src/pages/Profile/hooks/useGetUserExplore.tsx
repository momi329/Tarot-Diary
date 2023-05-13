import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../utils/firebase";
import { FriendsPostsType } from "../../../utils/type";
function useGetUserExplore() {
  const { user } = useContext(AuthContext);
  const [friendsPosts, setFriendsPosts] = useState<FriendsPostsType[] | null>(
    null
  );
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
        // TODO: any
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
              } as FriendsPostsType;
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
              } as FriendsPostsType;
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
