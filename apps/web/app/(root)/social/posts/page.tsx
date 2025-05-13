import Feed from "~/components/ui/socialpost/post/Feed";
import { getUser } from "~/app/actions/user";
import { db } from "~/lib/prisma";
import AddPost from "~/components/ui/socialpost/postadd/AddPost";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Spinner from "~/components/ui/socialpost/loading/Spinner";
import LoadingWrapper from "~/components/ui/socialpost/loading/LoadingWrapper";

export default async function Page() {
  const user = await getUser();
  const id = user?.id;

  if (!id) return notFound();
  let posts: any[] = [];
  let followingIds: string[] = [];
  // Fetch the IDs of users the current user is following
  const followingUsers = await db.follower.findMany({
    where: {
      followerId: id, // The user making the request is the follower
    },
    select: {
      followingId: true,
    },
  });

  followingIds = followingUsers.map((f) => f.followingId);

  // 1. Fetch Followed Users' Posts
  const followedPosts = await db.post.findMany({
    where: { userId: { in: followingIds } },
    include: {
      user: true,
      likes: { select: { userId: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch User's Posts
  const userPosts = await db.post.findMany({
    where: { userId: id },
    include: {
      user: true,
      likes: { select: { userId: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Fetch Other Users' Posts
  const otherPosts = await db.post.findMany({
    where: { NOT: { userId: { in: [...followingIds, id] } } },
    include: {
      user: true,
      likes: { select: { userId: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 4. Recent User Posts (1 minute)
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 60000); // 1 minute ago

  const recentUserPosts = userPosts.filter(
    (post) => post.createdAt > oneMinuteAgo,
  );

  // 5. Construct First Section (Recent User Posts)
  posts = [...recentUserPosts];

  // 6. Construct Second Section (Followed 5/8 + 4-5 Other Posts Shuffled)
  const recentFollowedPosts = followedPosts.slice(
    0,
    Math.floor(followedPosts.length * (5 / 8)),
  );
  const selectedOtherPosts = otherPosts.slice(0, 5); // get first 5 other posts.

  const combinedFollowedAndOther = [
    ...recentFollowedPosts,
    ...selectedOtherPosts,
  ];
  const shuffledFollowedAndOther = combinedFollowedAndOther.sort(
    () => Math.random() - 0.5,
  );

  posts = [...posts, ...shuffledFollowedAndOther];

  // 7. Construct Third Section (Followed 3/8 + Remaining User + Other Shuffled)
  const remainingFollowedPosts = followedPosts.slice(
    Math.floor(followedPosts.length * (5 / 8)),
  );
  const remainingUserPosts = userPosts.filter(
    (post) => post.createdAt <= oneMinuteAgo,
  );
  const remainingOtherPosts = otherPosts.slice(5); //get the rest of the other posts.

  const combinedRemaining = [
    ...remainingFollowedPosts,
    ...remainingUserPosts,
    ...remainingOtherPosts,
  ];
  const shuffledRemaining = combinedRemaining.sort(() => Math.random() - 0.5);

  posts = [...posts, ...shuffledRemaining];

  // console.log("Insidee feed pagee -- post is ", posts);

  return (
    <div className="flex justify-center">
      <div className="w-4/5 rounded-lg flex flex-col space-y-6">
        {id ? (
          <>
            <AddPost user={user} />
            <LoadingWrapper delay={500}>
              <Feed posts={posts} id={id} />
            </LoadingWrapper>
          </>
        ) : (
          <div className="text-center">Logged in to see the posts</div>
        )}
      </div>
    </div>
  );
}
