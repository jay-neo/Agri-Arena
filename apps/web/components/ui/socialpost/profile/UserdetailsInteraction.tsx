"use client";
import { log } from "console";
import React, { useOptimistic, useState } from "react";
import { switchBlock, switchfollow } from "~/app/server/social/post/action";

const Userdetailsinteraction = ({
  loginid,
  viewid,
  isUserBlocked,
  isFollowing,
  isFollowingSent,
}: {
  loginid: string;
  viewid: string;
  isUserBlocked: boolean;
  isFollowing: boolean;
  isFollowingSent: boolean;
}) => {
  const [userState, setUserState] = useState({
    following: isFollowing,
    blocked: isUserBlocked,
    followingRequestSent: isFollowingSent,
  });


  console.log("inside userdetailsinteraction follow state  ",isFollowingSent)
  const follow = async () => {
    switchOptimisticState("follow");
    try {
      await switchfollow(viewid);
      setUserState((prev) => ({
        ...prev,
        following: prev.following && false,
        followingRequestSent:
          !prev.following && !prev.followingRequestSent ? true : false,
      }));
    } catch (error) {}
  };

  const block = async () => {
    switchOptimisticState("block");
    try {
      await switchBlock(viewid);
      setUserState((prev) => ({
        ...prev,
        blocked: !prev.blocked,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const [optimisticState, switchOptimisticState] = useOptimistic(
    userState,
    (state, value: "follow" | "block") =>
      value === "follow"
        ? {
            ...state,
            following: state.following && false,
            followRequestSent:
              !state.following && !state.followingRequestSent ? true : false,
          }
        : { ...state, blocked: !state.blocked }
  );
  return (
    <div>
      <div className="flex item-center justify-center gap-12 mt-4">
        <form action={follow}>
          <button className="bg-blue-500 p-2 rounded-md">
            {optimisticState.following
              ? "following"
              : optimisticState.followingRequestSent
                ? "friend request sent"
                : "follow"}
          </button>
        </form>
        <form action={block}>
          <button>
            <span className="text-red-600 text-sm cursor-pointer self-end">
              {optimisticState.blocked ? "unblock user" : "block user"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Userdetailsinteraction;
