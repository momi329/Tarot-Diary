import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { UserSpreadType } from "../../../utils/type";

const useGetUserSpread = () => {
  const [userSpread, setUserSpread] = useState<UserSpreadType[] | null>(null);
  const { uid } = useParams();
  const getUserSpread = useCallback(async () => {
    const spread = (await firebase.getOtherUserSpread(uid)) as UserSpreadType[];
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
