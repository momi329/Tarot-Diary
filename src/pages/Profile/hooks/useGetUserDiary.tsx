import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { DiaryType } from "../../../utils/type";

const useGetUserDiary = () => {
  const [diary, setDiary] = useState<DiaryType[] | null>(null);
  const { uid } = useParams();
  const getDiary = useCallback(async () => {
    const userDiary = (await firebase.getOtherUserDiary(uid)) as DiaryType[];
    userDiary
      .sort((a, b) => {
        return a.time.seconds - b.time.seconds;
      })
      .reverse();
    setDiary(userDiary);
  }, [uid]);

  return { diary, setDiary, getDiary };
};

export default useGetUserDiary;
