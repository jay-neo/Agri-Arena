"use client";
import React, { useState } from "react";
import CommentList from "./CommentList";
import AllCommentsModal from "./AllCommentsModal";
import { Comment, User } from "@prisma/client";

type CommentWithUser = Comment & { user: User };

interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const CommentClient = ({
  user,
  postId,
  comments,
}: {
  user: UserType;
  postId: number;
  comments: CommentWithUser[];
}) => {
  const [showAllComments, setShowAllComments] = useState(false);
  const limitedComments = comments.slice(0, 2);

  return (
    <div>
      <CommentList user={user} postId={postId} comments={limitedComments} />
      {comments.length > 2 && (
        <button
          onClick={() => setShowAllComments(true)}
          className="text-blue-500 mt-2"
        >
          See All Comments ({comments.length})
        </button>
      )}

      {showAllComments && (
        <AllCommentsModal
          comments={comments}
          onClose={() => setShowAllComments(false)}
          user={user}
          postId={postId}
        />
      )}
    </div>
  );
};

export default CommentClient;
