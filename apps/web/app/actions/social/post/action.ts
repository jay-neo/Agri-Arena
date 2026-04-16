"use server";

import { z } from "zod";
import { getUser } from "../../user";
import { db } from "~/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";

export const switchLike = async (postId: number) => {
  const user = await getUser();
  const userId = user?.id;

  if (!userId) throw new Error("User is not authenticated!");

  try {
    const existingLike = await db.like.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingLike) {
      await db.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await db.like.create({
        data: {
          postId,
          userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in like");
  }
};

export const getComments = async (postId: number) => {
  if (!postId) throw new Error("Post ID is required");

  try {
    const comments = await db.comment.findMany({
      where: { postId },
      include: { user: true },
    });

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

export const addComment = async (postId: number, desc: string) => {
  const user = await getUser();
  const userId = user?.id;

  if (!userId) throw new Error("User Not authenticated!!!");

  try {
    const createdComment = await db.comment.create({
      data: {
        desc,
        userId,
        postId,
      },
      include: {
        user: true,
      },
    });
    return createdComment;
  } catch (error) {
    console.log("Isnide addcomment error is ", error);

    throw new Error("something went wrong!!");
  }
};

/////////////Add post

export const addPosts = async (formData: FormData) => {
  const desc = formData.get("desc") as string;
  const user = await getUser();

  const Desc = z.string().min(1).max(255);

  const validdesc = Desc.safeParse(desc);

  if (!validdesc.success) {
    return { success: false };
  }
  try {
    await db.post.create({
      data: {
        desc: validdesc.data,
        userId: user.id,
        img: user.image,
      },
    });
    revalidatePath("/social/posts");
    return { success: true };
  } catch (error) {}
};

//// Delete post options------------------------------

export const deletePost = async (postId: number) => {
  const user = await getUser();
  const id = user?.id;
  if (!id) throw new Error("User is not Authenticated...");

  try {
    await db.post.delete({
      where: {
        id: postId,
        userId: id,
      },
    });
    revalidatePath("/social/pagees");
  } catch (error) {
    console.log(error);
  }
};

export const acceptfollowRequest = async (userId: string) => {
  const user = await getUser();
  const id = user?.id;
  if (!id) throw new Error("User is not Authenticated...");

  try {
    const existingfollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: id,
      },
    });

    if (existingfollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingfollowRequest.id,
        },
      });
    }

    await db.follower.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong acceptfollowRequest");
  }
};

export const declinefollowRequest = async (userId: string) => {
  const user = await getUser();
  const id = user?.id;
  if (!id) throw new Error("User is not Authenticated...");

  try {
    const existingfollowRequest = await db.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: id,
      },
    });

    if (existingfollowRequest) {
      await db.followRequest.delete({
        where: {
          id: existingfollowRequest.id,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw new Error("Something went wrong acceptfollowRequest");
  }
};

export const switchfollow = async (userId: string) => {
  const user = await getUser();
  const id = user?.id;
  if (!id) throw new Error("User is not Authenticated...");

  try {
    const existingFollow = await db.follower.findFirst({
      where: {
        followerId: id,
        followingId: userId,
      },
    });

    if (existingFollow) {
      await db.follower.delete({
        where: {
          id: existingFollow.id,
        },
      });
    } else {
      const existingfollowRequest = await db.followRequest.findFirst({
        where: {
          senderId: id,
          receiverId: userId,
        },
      });

      if (existingfollowRequest) {
        await db.followRequest.delete({
          where: {
            id: existingfollowRequest.id,
          },
        });
      } else {
        await db.followRequest.create({
          data: {
            senderId: id,
            receiverId: userId,
          },
        });
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in switchfollow");
  }
};

export const switchBlock = async (userId: string) => {
  const user = await getUser();
  const id = user?.id;
  if (!id) throw new Error("User is not Authenticated...");

  try {
    const existingBlock = await db.block.findFirst({
      where: {
        blockedId: userId,
        blockerId: id,
      },
    });
    if (existingBlock) {
      await db.block.delete({
        where: {
          id: existingBlock.id,
        },
      });
    } else {
      await db.block.create({
        data: {
          blockerId: id,
          blockedId: userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong in switchBlock");
  }
};

export async function getFriendRequests(loginid: string) {
  try {
    const requests = await db.followRequest.findMany({
      where: {
        receiverId: loginid,
      },
      include: {
        sender: true,
      },
    });
    return requests;
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }
}
