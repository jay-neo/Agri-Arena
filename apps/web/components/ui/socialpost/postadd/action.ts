"use server";

import { db } from "~/lib/prisma";
import { getUser } from "~/app/server/user";
import { uploadInPublicS3Bucket } from "~/lib/aws/s3";

export async function addPostsWithImage(formData: FormData) {
  const { id, email } = await getUser();
  const desc = formData.get("desc") as string;
  const image = formData.get("image") as File;

  let imageUrl = null;

  if (image && image.size > 0) {
    const filePath = `${email}/posts`;
    imageUrl = await uploadInPublicS3Bucket(image, filePath);
  }

  await db.post.create({
    data: {
      desc,
      img: imageUrl,
      userId: id,
    },
  });

  return { success: true };
}

