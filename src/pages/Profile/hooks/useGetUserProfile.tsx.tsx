import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "../../../utils/firebase";
import { ProfileType } from "../../../utils/type";

const useGetUserProfile = () => {
  const [userProfile, setUserProfile] = useState<ProfileType>();
  const { uid } = useParams();
  const getUserProfile = useCallback(async () => {
    const profile = await firebase.getProfile(uid);
    if (!profile) return;
    setUserProfile(profile);
  }, [uid]);

  return { userProfile, setUserProfile, getUserProfile };
};

export default useGetUserProfile;
