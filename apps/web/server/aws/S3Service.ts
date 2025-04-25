import "server-only"

import {
    awsS3region,
    awsS3accessKeyId,
    awsS3publicBucket,
    awsS3secretAccessKey,
} from "~/lib/myenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

class S3Service {
    private s3Client: S3Client;
    private bucketName: string;
    private region: string;

    private constructor() {
        this.s3Client = new S3Client({
            region: awsS3region,
            credentials: {
                accessKeyId: awsS3accessKeyId,
                secretAccessKey: awsS3secretAccessKey,
            },
        });
        this.bucketName = awsS3publicBucket;
        this.region = awsS3region;
    }

    private static instance: S3Service;
    public static getInstance(): S3Service {
        if (!S3Service.instance) {
            S3Service.instance = new S3Service();
        }
        return S3Service.instance;
    }

    public async uploadFile(file: File, filePath: string): Promise<string> {
        try {
            const fileBuffer = Buffer.from(await (file as Blob).arrayBuffer());
            const fileName = `${filePath}/${Date.now()}-${(file as File).name}`;

            const params = {
                Body: fileBuffer,
                Key: fileName,
                Bucket: this.bucketName,
                ContentType: (file as File).type,
            };

            const command = new PutObjectCommand(params);
            await this.s3Client.send(command);

            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${params.Key}`;
        } catch (error) {
            return null;
        }
    }
}

export const s3Service = S3Service.getInstance();