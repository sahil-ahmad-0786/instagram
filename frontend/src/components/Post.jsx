import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialoge from "./CommentDialoge";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [comment, setComment] = useState(post.comments);
  const [postLike, setPostLike] = useState(post.likes.length);

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://instagram-5-u9yd.onrender.com`+`/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.messsage);
    }
  };
  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://instagram-5-u9yd.onrender.com`+`/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-5-u9yd.onrender.com`+`/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://instagram-5-u9yd.onrender.com`+`/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full max-w-full px-2 sm:px-0 sm:max-w-md mx-auto my-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <Avatar className="w-6 h-6">
            <AvatarImage src={post.author.profilePicture} alt="@shadcn" />
            <AvatarFallback>😎</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1>{post.author.username}</h1>
            {user._id === post.author._id && (
              <Badge variant="secondry">Author</Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger aschild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post.author._id !== user._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button
              onClick={bookmarkHandler}
              variant="ghost"
              className="cursor-pointer w-fit"
            >
              Add to Favorite
            </Button>
            {user && user._id === post.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post.image}
        alt=""
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="text-red-600"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart size={"22px"} onClick={likeOrDislikeHandler} />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="font-medium block mb-2">{post.likes.length} Likes</span>
      <p>
        <span className="font-medium mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setOpen(true);
          }}
          className="cursor-pointer text-gray-400 text-sm"
        >
          View All {comment.length} Comments
        </span>
      )}

      <CommentDialoge open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a Comment"
          className="outline-none text-sm w-full placeholder:text-gray-300"
        />
        {text && (
          <span className="text-[#3BADF8]" onClick={commentHandler}>
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
