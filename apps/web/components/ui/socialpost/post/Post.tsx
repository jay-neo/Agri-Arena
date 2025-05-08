import Image from "next/image";
import React, { Suspense } from "react";
import Postinteraction from "../postinteract/postinteraction";
import { Post as postType, User } from "@prisma/client";
import Postinfo from "./Postinfo";
import Comment from "../postinteract/Comment";
import Link from "next/link";
import Spinner from "../loading/Spinner";
import { formatDateToDDMMYYYY } from "~/lib/formatters";

type Feedposttype = postType & { user: User } & {
  likes: [{ userId: string }];
} & { _count: { comments: number } };

const Post = ({ post, id }: { post: Feedposttype; id: string }) => {
  const formattedTime = formatDateToDDMMYYYY(new Date(post.createdAt));

  return (
    <div className="flex flex-col gap-4">
      {/* User */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.image || "/socialimg/noAvatar.png"}
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />{" "}
          <Link href={`/social/profile/${post.user.name}`}>
            <span className="cursor-pointer hover:underline">
              {post.user.name}
            </span>
          </Link>
          {/* Post Time */}
          <div className="text-sm text-gray-500">{formattedTime}</div>
        </div>
        {id === post.userId && <Postinfo postId={post.id} />}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4">
        <p>{post.desc}</p>
        <div className="flex justify-center">
          {post.img && (
            <div className="w-96 h-96 relative">
              <Image
                src={post.img}
                alt=""
                fill
                className="object-cover rounded-md"
              />
            </div>
          )}
        </div>
      </div>

      {/* Interaction */}
      <div>
        <Suspense fallback={<Spinner />}>
          <Postinteraction
            postId={post.id}
            likes={post.likes.map((like) => like.userId)}
            commentNumber={post._count.comments}
            id={id}
          />
        </Suspense>
        <Suspense fallback={<Spinner />}>
          <Comment id={id} postId={post.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default Post;
