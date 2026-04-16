import Feed from "~/components/ui/socialpost/post/Feed";
import { getProfile, getUser } from "~/app/actions/user";
import { db } from "~/lib/prisma";
import Userinfo from "~/components/ui/socialpost/profile/Userinfo";
import Userdetails from "~/components/ui/socialpost/profile/Userdetails";
import { notFound } from "next/navigation";
import { FriendRequests } from "~/components/ui/socialpost/friendrequest/FriendRequests";
import { Suspense } from "react";
import LoadingWrapper from "~/components/ui/socialpost/loading/LoadingWrapper";

const profilepage = async ({ params }: { params: { username: string } }) => {
  const prof = await getProfile();
  const currentuser = await getUser();
  const id = currentuser?.id;
  // let currentUsername: string;

  // if (id) {
  //   // Fetch the current user's details, including the username
  //   const user = await db.user.findUnique({
  //     where: { id },
  //     select: { name: true },
  //   });

  //   currentUsername = user?.name;

  //   const userData = await db.user.findUnique({
  //     where: { id: id },
  //     select: {
  //         _count: {
  //             select: {
  //                 posts: true,
  //                 arenas: true,
  //             },
  //         },
  //     },
  // });

  const username = params.username;
  const user = await db.user.findFirst({
    where: {
      id: username,
    },
    include: {
      _count: {
        select: {
          followers: true,
          followings: true,
          posts: true,
          arenas: true,
        },
      },
      profile: true,
    },
  });

  if (!user) return notFound();

  let isBlocked = false;

  if (id) {
    const res = await db.block.findFirst({
      where: {
        blockerId: user.id,
        blockedId: id,
      },
    });

    if (res) isBlocked = true;
  } else {
    isBlocked = false;
  }

  if (isBlocked) return notFound();

  const posts = await db.post.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex justify-center">
      <div className="w-4/5  rounded-lg  flex-col">
        {user.name ? (
          <>
            <div className="flex flex-col justify-center">
              <Userinfo userData={user} />
              <Userdetails
                loginid={id}
                viewid={user.id}
                prof={prof}
                currentuser={"others"}
              />
              <div className="">
                <LoadingWrapper delay={500}>
                  <div className="items-center">
                    <FriendRequests loginid={id} viewid={user.id} />
                  </div>
                  <div className="mt-12">
                    <Feed posts={posts} id={id} />
                  </div>
                </LoadingWrapper>
              </div>{" "}
            </div>
          </>
        ) : (
          <div className="text-center">User {username} not found !!</div>
        )}
      </div>
    </div>
  );
  // }
};
export default profilepage;
