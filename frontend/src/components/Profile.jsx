import useGetUserProfile from "@/hooks/useGetUserProfile ";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { toggleFollowUser } from "@/redux/followUnfollowSlice";
import { setUserProfile } from "@/redux/authSlice";
const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  const navigate = useNavigate()

  useGetUserProfile(userId);

  const { userProfile, user } = useSelector((store) => store.auth);
  const { loading } = useSelector((store) => store.follow);

  const isLonggedInUserProfile = user._id === userProfile._id;
  const isFollowing = userProfile?.followers?.includes(user?._id);

  const [activeTab, setActiveTab] = useState("posts");
  const displayedPost =
    activeTab === "posts" ? userProfile.posts : userProfile.bookmarks;

  const handleToggleFollow = async () => {
    const res = await dispatch(toggleFollowUser(userProfile._id));
  if (res.meta.requestStatus === "fulfilled") {
    const currentUserId = user._id;
    const isNowFollowing = !userProfile.followers.includes(currentUserId);

    // Real-time update followers list
    const updatedFollowers = isNowFollowing
      ? [...userProfile.followers, currentUserId]
      : userProfile.followers.filter((id) => id !== currentUserId);

    dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
  }
  };
  const messagePage = () =>{
    navigate('/chat')
  }
  if (!user || !userProfile) {
  return <div className="p-4 text-center text-gray-500">Loading profile...</div>;
}
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback>Profile</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile.username}</span>
                {isLonggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View Archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
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
                      <Button onClick={messagePage} variant="secondary" className="h-8">
                        Message
                      </Button>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile.posts.length}
                  </span>{" "}
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile.followers.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile.following.length}
                  </span>{" "}
                  following
                </p>
              </div>

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

        <div className="border-t border-t-gray-300">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {displayedPost.map((post) => {
              return (
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
