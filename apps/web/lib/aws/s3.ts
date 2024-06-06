"use server";

import {
  awsS3region,
  awsS3accessKeyId,
  awsS3secretAccessKey,
  awsS3publicBucket,
} from "~/lib/myenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: awsS3region,
  credentials: {
    accessKeyId: awsS3accessKeyId,
    secretAccessKey: awsS3secretAccessKey,
  },
});

export const uploadInPublicS3Bucket = async (
  image: File,
  filePath: string
): Promise<string> => {
  const imageFile = Buffer.from(await (image as Blob).arrayBuffer());
  const imageFileName = `${filePath}/${Date.now()}-${(image as File).name}`;

  const params = {
    Bucket: awsS3publicBucket,
    Key: imageFileName,
    Body: imageFile,
    ContentType: (image as File).type,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return `https://${awsS3publicBucket}.s3.${awsS3region}.amazonaws.com/${params.Key}`;
};
