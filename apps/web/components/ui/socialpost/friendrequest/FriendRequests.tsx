"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react"; // Import useEffect

import FriendRequestModal from "./FriendRequestModal";
import { getFriendRequests } from "~/app/server/social/post/action";
import FriendRequestList from "./FriendRequestList";

export const FriendRequests = ({
  loginid,
  viewid,
}: {
  loginid: string;
  viewid: string;
}) => {
  if (loginid !== viewid) return null;

  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getFriendRequests(loginid);
      setRequests(data);
    }
    fetchData();
  }, [loginid]);

  if (requests.length === 0) return null;

  const limitedRequests = requests.slice(0, 3);

  return (
    <div className="p-4 rounded-lg shadow-md text-md flex flex-col border mt-6 w-3/4 mx-auto">
      <div className="flex justify-between items-center font-medium gap-4">
        <span className="text-violet-400 font-bold">Friend Requests</span>
        <button onClick={() => setIsModalOpen(true)} className="text-blue-500 text-md">
          See all
        </button>
      </div>
      <FriendRequestList requests={isModalOpen ? requests : limitedRequests} />
      {isModalOpen && (
        <FriendRequestModal requests={requests} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default FriendRequests;