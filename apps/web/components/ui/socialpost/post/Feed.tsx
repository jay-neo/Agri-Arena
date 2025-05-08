import React from "react";
import Post from "./Post";

const Feed = ({ posts, id }: { posts: any[]; id: string }) => {
  return (
    <div className="p-4 flex flex-col gap-12">
      {posts.length ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-sm bg-white dark:bg-[#2A2A4F]"
          >
            <Post post={post} id={id} />
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-lg text-gray-600 dark:text-gray-300">
          No posts available...
        </div>
      )}
    </div>
  );
};

export default Feed;