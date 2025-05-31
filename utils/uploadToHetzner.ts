import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  endpoint: "https://nbg1.your-objectstorage.com",
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.HETZNER_ACCESS_KEY!,
    secretAccessKey: process.env.HETZNER_SECRET_KEY!,
  },
});

export async function uploadToHetzner(
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const key = `uploads/${uuidv4()}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: "cdn-fcn",
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    })
  );

  return `https://cdn-fcn.nbg1.your-objectstorage.com/${key}`;
}
