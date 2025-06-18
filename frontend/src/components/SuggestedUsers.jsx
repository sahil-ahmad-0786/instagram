import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toggleFollowUser } from "@/redux/followUnfollowSlice";
import { updateSuggestedUsers } from "@/redux/authSlice";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, user } = useSelector((store) => store.auth);

  // 🧠 local loading state per user
  const [loadingUserId, setLoadingUserId] = useState(null);

  const handleFollow = async (targetUserId, isFollowing) => {
    setLoadingUserId(targetUserId); // 👈 start loading for this user
    const res = await dispatch(toggleFollowUser(targetUserId));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(
        updateSuggestedUsers({
          targetUserId,
          currentUserId: user._id,
          isNowFollowing: !isFollowing,
        })
      );
    }
    setLoadingUserId(null); // 👈 stop loading after response
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((userItem) => {
        const isFollowing = userItem.followers.includes(user._id);

        return (
          <div
            key={userItem._id}
            className="flex items-center justify-between my-5 flex-wrap sm:flex-nowrap gap-y-2"
          >
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link to={`/profile/${userItem._id}`}>
                <Avatar>
                  <AvatarImage src={userItem.profilePicture} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${userItem._id}`}>
                    {userItem.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {userItem.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <div className="w-full sm:w-auto text-right">
              <span
                onClick={() => handleFollow(userItem._id, isFollowing)}
                className={`text-xs font-bold cursor-pointer hover:opacity-80 ${
                  isFollowing ? "text-red-500" : "text-[#3BADF8]"
                }`}
              >
                {loadingUserId === userItem._id
                  ? "Processing..."
                  : isFollowing
                  ? "Unfollow"
                  : "Follow"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
