"use client";
import { Comment, User } from "@prisma/client";
import React, { useOptimistic, useState, useRef } from "react";
import Image from "next/image";
import { addComment, getComments } from "~/app/server/social/post/action";
type CommentWithUser = Comment & { user: User };
import Link from "next/link";
import { formatDateToDDMMYYYY } from "~/lib/formatters";
interface UserType {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

const CommentList = ({
  user,
  postId,
  comments,
}: {
  user: UserType;
  postId: number;
  comments: CommentWithUser[];
}) => {
  // console.log("from commentlist ",user.image);

  const [cummentState, setCommentState] = useState([...comments].reverse());
  const [desc, setdesc] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const add = async () => {
    if (!user || !desc) return;
    addOptimisticComments({
      id: Math.random(),
      desc,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      userId: user.id,
      postId: postId,
      user: {
        id: user.id,
        image: user.image || "/socialimg/noAvatar.png",
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
        name: "sending please wait....",
        email: "",
        password: "",
        emailVerified: undefined,
      },
    });
    try {
      const createdComment = await addComment(postId, desc);
      setCommentState((prev) => [createdComment, ...prev]);
      setdesc("");
      if (inputRef.current) {
        inputRef.current.value = ""; //clear the input directly
      }
    } catch (error) { }
  };

  const [optimisticComments, addOptimisticComments] = useOptimistic(
    cummentState,
    (state, value: CommentWithUser) => [value, ...state]
  );
  return (
    <div>
      {/* write comments */}
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.image || "/socialimg/noAvatar.png"}
            alt=""
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              add();
            }}
            className="flex-1 flex items-center justify-between rounded-xl text-sm px-6 py-2 w-full border"
          >
            <input
              type="text"
              placeholder="Write a comment"
              className="bg-transparent outline-none flex-1"
              onChange={(e) => setdesc(e.target.value)}
              ref={inputRef}
            />
            <button type="submit">
              <Image
                src="/socialimg/send2.png"
                alt=""
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </button>
          </form>
        </div>
      )}
      {/* All comments */}
      <div className="">
        {optimisticComments.map((comments) => (
          <div className="flex gap-4 justify mt-6" key={comments.id}>
            {/* Avatar */}

            <Link href={`/social/profile/${comments.user.name}`}>
              <Image
                src={comments.user.image || "/socialimg/noAvatar.png"}
                alt=""
                width={40}
                height={40}
                className="w-8 h-8 rounded-full"
              />
            </Link>
            {/* Desc */}
            <div className="flex flex-col gap-2 flex-1">
              {/* Comemts timing */}
              <div className="flex items-center gap-2">
                <Link href={`/social/profile/${comments.user.name}`}>
                  <span className="cursor-pointer hover:underline">
                    {comments.user.name}
                  </span>
                </Link>
                <span
                  className="text-gray-500 text-sm"
                  suppressHydrationWarning={true}
                >
                  {formatDateToDDMMYYYY(new Date(comments.createdAt))}
                </span>
              </div>
              <p>{comments.desc} </p>
              {/* <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
              <div className="flex items-center gap-4">
                <Image
                  src="/socialimg/like.png"
                  alt=""
                  width={12}
                  height={12}
                  className="cursor-pointer w-4 h-4"
                />
                <span className="text-grey-300"> | </span>
                <span className="text-grey-300">1234 Likes</span>
              </div>
              <div>Reply</div>
            </div> */}
            </div>
            {/* Icon */}
            <Image
              src="/socialimg/more.png"
              alt=""
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
