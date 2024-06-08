export const myenv: string = process.env.MYENV || "test";

export const awsS3region = process.env.AWS_S3_REGION;
export const awsS3accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
export const awsS3secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
export const awsS3publicBucket = process.env.AWS_S3_PUBLIC_BUCKET;

export const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
export const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
