import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_PUBLIC_BUCKET!;

export async function uploadInPublicS3Bucket(file: File, path: string) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileKey = `${path}/${uuidv4()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: fileKey,
    Body: buffer,
    ContentType: file.type,
    ACL: "public-read",
  });

  await s3.send(command);

  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;
}
