import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AtSign, Heart, MessageCircle } from "lucide-react";

import useGetUserProfile from "@/hooks/useGetUserProfile";
import { toggleFollowUser } from "@/redux/followUnfollowSlice";
import { setUserProfile } from "@/redux/authSlice";

import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

const Profile = () => {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.follow);

  const [activeTab, setActiveTab] = useState("posts");

  if (!user || !userProfile) {
    return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  }

  const isCurrentUser = user?._id === userProfile?._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);
  const displayedPost = activeTab === "posts" ? userProfile?.posts || [] : userProfile?.bookmarks || [];

  const handleToggleFollow = async () => {
    const res = await dispatch(toggleFollowUser(userProfile._id));
    if (res.meta.requestStatus === "fulfilled") {
      const currentUserId = user._id;
      const isNowFollowing = !userProfile.followers.includes(currentUserId);
      const updatedFollowers = isNowFollowing
        ? [...userProfile.followers, currentUserId]
        : userProfile.followers.filter((id) => id !== currentUserId);

      dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
    }
  };

  const goToChat = () => navigate("/chat");

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        {/* Profile Info */}
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>

                {isCurrentUser ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="h-8 hover:bg-gray-200">Edit Profile</Button>
                    </Link>
                    <Button variant="secondary" className="h-8 hover:bg-gray-200">View Archive</Button>
                    <Button variant="secondary" className="h-8 hover:bg-gray-200">Ad tools</Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleToggleFollow}
                      disabled={loading}
                      className={`h-8 ${
                        isFollowing
                          ? "bg-red-100 text-red-500 hover:bg-red-200"
                          : "bg-[#0095F6] text-white hover:bg-[#3192d2]"
                      }`}
                    >
                      {loading ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                    {isFollowing && (
                      <Button onClick={goToChat} variant="secondary" className="h-8">Message</Button>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <p><span className="font-semibold">{userProfile?.posts?.length || 0}</span> posts</p>
                <p><span className="font-semibold">{userProfile?.followers?.length || 0}</span> followers</p>
                <p><span className="font-semibold">{userProfile?.following?.length || 0}</span> following</p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1">
                <span>{userProfile?.bio}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
                <span>Follow for more</span>
                <span>Collaboration</span>
                <span>💖💗</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs */}
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            {["posts", "saved", "reels", "tags"].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${activeTab === tab ? "font-bold" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Posts */}
          <div className="grid grid-cols-3 gap-3">
            {displayedPost.map((post) => (
              <div key={post._id} className="relative group cursor-pointer">
                <img
                  src={post.image}
                  alt="Post"
                  className="rounded-sm my-2 w-full aspect-square object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
