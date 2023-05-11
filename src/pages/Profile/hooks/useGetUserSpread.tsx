import { useCallback, useState } from "react";
import firebase from "../../../utils/firebase";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
import { Spread } from "../../../utils/type";
type UserSpread = {
  time: Timestamp;
  image: string;
  spreadId: string;
  userUID: string;
  comment: Comment[];
  spread: Spread[];
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
