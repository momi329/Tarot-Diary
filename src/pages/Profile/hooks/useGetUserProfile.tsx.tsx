import { useCallback, useContext, useState } from "react";
import firebase from "../../../utils/firebase";
import { AuthContext } from "../../../context/authContext";
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
  const [userProfile, setUserProfile] = useState<any>();
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const getUserProfile = useCallback(async () => {
    const profile = await firebase.getProfile(uid);

    setUserProfile(profile);
  }, []);

  return { userProfile, getUserProfile };
};

export default useGetUserProfile;
