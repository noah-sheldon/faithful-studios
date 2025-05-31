import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// === HARDCODED VALUES ===
const accessKeyId = "23C0HCJBLS87YL6KRXGW";
const secretAccessKey = "KrTiR9XXDXMRHUlBbiqyI8t1dRTZEbOgQqe2Yl63";
const endpoint = "https://nbg1.your-objectstorage.com"; // adjust if different
const bucket = "cdn-fcn";
const region = "us-east-1"; // required, dummy for Hetzner
const filePath = "/Users/noahsheldon/Downloads/fstd-test/avatar.png"; // <-- change this
const fileKey = "uploads/avatar.png"; // path in the bucket

// === S3 CLIENT ===
const s3 = new S3Client({
    region: "us-east-1", // dummy value, Hetzner ignores it
    endpoint: "https://nbg1.your-objectstorage.com", // Nuremberg endpoint
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    forcePathStyle: true,
    // ✅ Helps avoid XAmzContentSHA256Mismatch errors
    defaultsMode: "legacy",
  });
  

async function upload() {
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileKey,
    Body: fileStream,
    ContentType: "image/png",
    ACL: "public-read",
  });

  try {
    await s3.send(command);
    console.log("✅ Uploaded to:", `${endpoint}/${fileKey}`);
  } catch (err) {
    console.error("❌ Upload failed:", err);
  }
}

upload();
