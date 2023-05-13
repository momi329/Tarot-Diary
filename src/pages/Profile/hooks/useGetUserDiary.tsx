import { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/authContext";
import firebase from "../../../utils/firebase";
import { DiaryType } from "../../../utils/type";

const useGetUserDiary = () => {
  const [diary, setDiary] = useState<DiaryType[] | null>(null);
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const getDiary = useCallback(async () => {
    const diary = (await firebase.getOtherUserDiary(uid, user)) as DiaryType[];
    diary
      .sort(function (a, b) {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    setDiary(diary);
  }, [uid]);

  return { diary, setDiary, getDiary };
};

export default useGetUserDiary;
