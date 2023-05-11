import { useCallback, useContext, useState } from "react";
import firebase from "../../../utils/firebase";
import { AuthContext } from "../../../context/authContext";
import { useParams } from "react-router-dom";
import { Timestamp } from "firebase/firestore";
type Diary = {
  description: string;
  secret: boolean;
  image: string;
  spreadId: string;
  comment: {
    comment: string;
    user: string;
    userName: string;
    userImage: string;
  }[];
  askGpt: string;
  docId: string;
  question: string;
  title: string;
  content: string;
  time: Timestamp;
  like: string[];
  userUID: string;
  spread: (
    | number
    | {
        order: number;
        disabled?: boolean;
        value: string;
        name: string;
        card: number;
        reverse: boolean;
      }
  )[];
  user: string;
  userImg: string;
  userName: string;
};
const useGetUserDiary = () => {
  const [diary, setDiary] = useState<Diary[] | null>(null);
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const getDiary = useCallback(async () => {
    const diary = (await firebase.getOtherUserDiary(uid, user)) as Diary[];
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
