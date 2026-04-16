"use client";
import { FollowRequest, User } from "@prisma/client";
import Image from "next/image";
import React, { use, useOptimistic, useState } from "react";
import {
  acceptfollowRequest,
  declinefollowRequest,
} from "~/app/actions/social/post/action";

type Requests = FollowRequest & {
  sender: User;
};

const FriendRequestList = ({ requests }: { requests: Requests[] }) => {
  const [requestState, setRequestState] = useState(requests);

  const accept = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await acceptfollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id != requestId));
    } catch (error) {}
  };

  const decline = async (requestId: number, userId: string) => {
    removeOptimisticRequest(requestId);
    try {
      await declinefollowRequest(userId);
      setRequestState((prev) => prev.filter((req) => req.id != requestId));
    } catch (error) {}
  };

  const [optimisticRequest, removeOptimisticRequest] = useOptimistic(
    requestState,
    (state, value: number) => state.filter((req) => req.id !== value),
  );

  return (
    <div className="space-y-4">
      {optimisticRequest.map((request) => (
        <div className="flex items-center justify-between" key={request.id}>
          <div className="flex items-center gap-4">
            <Image
              src={request.sender.image}
              alt=""
              width={40}
              height={40}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold">{request.sender.name}</span>
            <div className="flex gap-6 justify-end">
              <form action={() => accept(request.id, request.sender.id)}>
                <button>
                  <Image
                    src="/socialimg/accept.png"
                    alt=""
                    width={22}
                    height={22}
                    className="cursor-pointer"
                  />
                </button>
              </form>

              <form action={() => decline(request.id, request.sender.id)}>
                <button>
                  <Image
                    src="/socialimg/reject.png"
                    alt=""
                    width={22}
                    height={22}
                    className="cursor-pointer border-red-500 border-2 rounded-full"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendRequestList;
