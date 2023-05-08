import { useCallback, useContext, useState } from "react";
import firebase from "../../../utils/firebase";
import { AuthContext } from "../../../context/authContext";
import { useParams } from "react-router-dom";

const useGetUserDiary = () => {
  const [diary, setUserDiary] = useState<any>(null);
  const { user } = useContext(AuthContext);
  const { uid } = useParams();

  const getDiary = useCallback(async () => {
    const diary = await firebase.getOtherUserDiary(uid, user);
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    // TODO: useMemo
    setUserDiary(diary);
  }, []);

  return { diary, getDiary };
};

export default useGetUserDiary;
