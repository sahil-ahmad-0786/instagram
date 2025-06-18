import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`https://instagram-5-u9yd.onrender.com`+`/api/v1/user/${userId}/profile`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        } else {
          dispatch(setUserProfile(null)); // set to null explicitly on fail
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        dispatch(setUserProfile(null)); // also set null on catch
      }
    };

    if (userId) fetchUserProfile();
  }, [userId, dispatch]);
};

export default useGetUserProfile;
