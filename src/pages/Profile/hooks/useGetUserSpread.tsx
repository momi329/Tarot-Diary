import { useCallback, useContext, useState } from "react";
import firebase from "../../../utils/firebase";
import { AuthContext } from "../../../context/authContext";
import { useParams } from "react-router-dom";

const useGetUserSpread = () => {
  const [userSpread, setUserSpread] = useState<any>();
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const getUserSpread = useCallback(async (uid) => {
    const spread = await firebase.getOtherUserSpread(uid);
    spread
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();

    setUserSpread(spread);
  }, []);

  return { userSpread, getUserSpread };
};

export default useGetUserSpread;
