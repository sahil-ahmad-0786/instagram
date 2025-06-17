import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { toggleFollowUser } from "@/redux/followUnfollowSlice";
import { setUserProfile } from "@/redux/authSlice";

const Profile = () => {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch the profile
  useGetUserProfile(userId);

  // Redux state
  const { userProfile = null, user = null } = useSelector((state) => state.auth) || {};
  const { loading } = useSelector((state) => state.follow);

  // Guard clause to avoid accessing null values
  if (!user || !userProfile || !user._id || !userProfile._id) {
    return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
  }

  const isCurrentUser = user._id === userProfile._id;
  const isFollowing = userProfile.followers.includes(user._id);
  const [activeTab, setActiveTab] = useState("posts");

  const displayedPost =
    activeTab === "posts" ? userProfile.posts : userProfile.bookmarks;

  const handleToggleFollow = async () => {
    const res = await dispatch(toggleFollowUser(userProfile._id));
    if (res.meta.requestStatus === "fulfilled") {
      const isNowFollowing = !userProfile.followers.includes(user._id);
      const updatedFollowers = isNowFollowing
        ? [...userProfile.followers, user._id]
        : userProfile.followers.filter((id) => id !== user._id);
      dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
    }
  };

  const handleMessage = () => {
    navigate("/chat");
  };

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        {/* Top Section */}
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </section>

          <section>
            <div className="flex flex-col gap-5">
              {/* Username + Actions */}
              <div className="flex items-center gap-2">
                <span>{userProfile.username}</span>
                {isCurrentUser ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant="secondary" className="h-8">
                        Edit Profile
                      </Button>
                    </Link>
                    <Button variant="secondary" className="h-8">
                      View Archive
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Ad Tools
                    </Button>
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
                      {loading
                        ? "Processing..."
                        : isFollowing
                        ? "Unfollow"
                        : "Follow"}
                    </Button>
                    {isFollowing && (
                      <Button onClick={handleMessage} variant="secondary" className="h-8">
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">{userProfile.posts.length}</span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">{userProfile.followers.length}</span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">{userProfile.following.length}</span>{" "}
                  following
                </p>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1">
                <span>{userProfile.bio}</span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />
                  <span className="pl-1">{userProfile.username}</span>
                </Badge>
                <span>Follow for more</span>
                <span>Collaboration</span>
                <span>💖💗</span>
              </div>
            </div>
          </section>
        </div>

        {/* Tabs Section */}
        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            {["posts", "saved", "reels", "tags"].map((tab) => (
              <span
                key={tab}
                className={`py-3 cursor-pointer ${
                  activeTab === tab ? "font-bold" : ""
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.toUpperCase()}
              </span>
            ))}
          </div>

          {/* Posts Grid */}
          {["posts", "saved"].includes(activeTab) && (
            <div className="grid grid-cols-3 gap-3">
              {displayedPost?.map((post) => (
                <div key={post._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    alt="Posts"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
