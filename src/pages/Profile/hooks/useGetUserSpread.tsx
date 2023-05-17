import { Timestamp } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { SpreadItem } from "../../../utils/type";
type UserSpread = {
  time: Timestamp;
  image: string;
  spreadId: string;
  userUID: string;
  comment: Comment[];
  spread: (SpreadItem | number)[];
  like: string[];
  description: string;
  title: string;
};
const useGetUserSpread = () => {
  const [userSpread, setUserSpread] = useState<UserSpread[] | null>(null);
  const { uid } = useParams();
  const getUserSpread = useCallback(async () => {
    const spread = (await firebase.getOtherUserSpread(uid)) as UserSpread[];
    spread
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();

    setUserSpread(spread);
  }, [uid]);

  return { userSpread, getUserSpread };
};

export default useGetUserSpread;
