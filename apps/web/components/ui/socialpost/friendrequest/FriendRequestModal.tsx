// FriendRequestModal.tsx
import React from "react";
import FriendRequestList from "./FriendRequestList";

interface FriendRequestModalProps {
  requests: any[];
  onClose: () => void;
}

const FriendRequestModal = ({ requests, onClose }: FriendRequestModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#2A2A4F] p-6 rounded-lg shadow-lg w-3/4 max-w-xl ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            All Friend Requests
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
            aria-label="Close friend requests modal"
          >
            Close
          </button>
        </div>
        <div className="items-center justify-center">
          <FriendRequestList requests={requests} />
        </div>
      </div>
    </div>
  );
};

export default FriendRequestModal;
