import { useCallback, useState } from "react";
import firebase from "../../../utils/firebase";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
  //TODO: any
  const [userProfile, setUserProfile] = useState<any>();
  const { uid } = useParams();
  const getUserProfile = useCallback(async () => {
    const profile = await firebase.getProfile(uid);
    setUserProfile(profile);
  }, [uid]);

  return { userProfile, setUserProfile, getUserProfile };
};

export default useGetUserProfile;
