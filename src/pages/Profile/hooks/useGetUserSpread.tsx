import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { UserSpread } from "../../../utils/type";

const useGetUserSpread = () => {
  const [userSpread, setUserSpread] = useState<UserSpread[] | null>(null);
  const { uid } = useParams();
  const getUserSpread = useCallback(async () => {
    const spread = (await firebase.getOtherUserSpread(uid)) as UserSpread[];
    spread
      .sort((a, b) => {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();

    setUserSpread(spread);
  }, [uid]);

  return { userSpread, getUserSpread };
};

export default useGetUserSpread;
