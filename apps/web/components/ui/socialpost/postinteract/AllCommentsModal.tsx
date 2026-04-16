import React from "react";
import CommentList from "./CommentList";

interface AllCommentsModalProps {
  comments: any[];
  onClose: () => void;
  user: any;
  postId: number;
}

const AllCommentsModal = ({
  comments,
  onClose,
  user,
  postId,
}: AllCommentsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#2A2A4F] p-6 rounded-lg shadow-lg w-3/4 max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            All Comments
          </h2>
          <button
            onClick={onClose}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
        <div className="items-center justify-center">
          <CommentList user={user} postId={postId} comments={comments} />
        </div>
      </div>
    </div>
  );
};

export default AllCommentsModal;
