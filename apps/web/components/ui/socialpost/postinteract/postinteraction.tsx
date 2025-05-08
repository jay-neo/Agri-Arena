"use client";
import React, { useEffect, useOptimistic, useState } from "react";
import Image from "next/image";
import { switchLike } from "~/app/server/social/post/action";
import Post from "../post/Post";
// import { getUser } from '~/app/server/user';
const postinteraction = ({
  postId,
  likes,
  commentNumber,
  id,
}: {
  postId: number;
  likes: string[];
  commentNumber: number;
  id: string;
}) => {
  const [likeState, setLikeState] = useState({
    likeCount: likes.length,
    isLiked: id ? likes.includes(id) : false,
  });
  const [optimisticLike, switchOptimisticLike] = useOptimistic(
    likeState,
    (state, value) => {
      return {
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      };
    }
  );
  const likeaction = async () => {
    switchOptimisticLike("");
    try {
      switchLike(postId);
      setLikeState((state) => ({
        likeCount: state.isLiked ? state.likeCount - 1 : state.likeCount + 1,
        isLiked: !state.isLiked,
      }));
    } catch (error) {}
  };

  return (
    <div>
      <div className="flex items-center justify-start gap-12 text-sm my-12">
        {/* like */}
        <div className="flex items-center gap-4 p-2 rounded-xl border">
          <form action={likeaction}>
            <button>
              <Image
                src={
                  optimisticLike.isLiked
                    ? "/socialimg/liked.png"
                    : "/socialimg/like.png"
                }
                alt=""
                width={16}
                height={16}
                className="cursor-pointer"
              />
            </button>
          </form>
          <span className="">|</span>
          <span className="">
            {optimisticLike.likeCount}
            <span className="hidden md:inline"> Likes</span>
          </span>
        </div>
        {/* comment  */}
        <div className="flex items-center gap-4 p-2 rounded-xl border">
          {/* <p>{posttime}</p> */}
          <Image
            src="/socialimg/comment.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
          />
          <span className="">|</span>
          <span className="">
            {commentNumber} <span className="hidden md:inline"> Comment</span>
          </span>
        </div>
        {/*Share  */}
        <div className="">
          <div className="flex items-center gap-4 p-2 rounded-xl border">
            <Image
              src="/socialimg/share.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer"
            />
            <span className="">|</span>
            <span className="">
              <span className="hidden md:inline">Share</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default postinteraction;
// postId={postId}
