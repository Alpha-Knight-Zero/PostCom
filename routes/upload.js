// AWS KEY: AKIAQ2TJILA4JDB3ERK2
// AWS Secret: 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

// 1. Bucket - Storage for application -> learnflow-resource-bucket
// 2. CDN - https://d1ecyonmvcaoie.cloudfront.net -> Used to view/read any object inside the Bucket
// 3. Policy -> Set of Permissions define that anyone to whom this policy is attached they will have access to Bucket
// 4. User -> Set of credentials / application to which policies are attached

// Pre-signed URL -> URL to our s3 bucket which allows us to upload a specific file

// Choose File -> Make a request to aws to Pre-signed URL for S3 bucket -> use Pre-signed URL to upload the file

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuid } = require("uuid");

const bucket = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: "AKIAQ2TJILA4JDB3ERK2",
    secretAccessKey: "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",
  },
});

// URL -> Associated with a single with a fixed file name and a fixed file type
//     -> Using this URL we are going to make a PUT request to AWS at the pre-signed URL, body -> file

const express = require("express");

const router = express.Router();

router.get("/get/preSignedURL", async (req, res) => {
  //  DP.jpg -> DP-ajndfjhanghijdhgbaihbnga.jpg
  // image/jpg -> [image, jpg]
  const contentType = req.query.contentType;

  const fileName =
    req.query.fileName.split(".")[0] +
    "-" +
    uuid() +
    "." +
    contentType.split("/")[1];

  const command = new PutObjectCommand({
    Bucket: "learnflow-resource-bucket",
    Key: fileName,
    ContentType: contentType,
  });

  const url = await getSignedUrl(bucket, command, { expiresIn: 3600 });
  console.log(url);
  console.log(fileName);
  res.send({
    url,
    fileName,
  });
});

module.exports = router;

/***
 *
 * 1. Pre-signed URL -> Used to upload a file on S3 Bucket
 * 2. Make a PUT Request to the above gen pre-signed url to upload the file to s3 Bucket
 * 3. Take CDN URL (https://d1ecyonmvcaoie.cloudfront.net/Screenshot+2023-04-29+at+4-4565ba4e-b9cd-482b-a3a8-b3a02446e7f8.png) -> Update User Profile in DB (PATCH)
 *
 */
