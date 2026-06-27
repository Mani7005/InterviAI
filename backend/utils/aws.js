const AWS = require('aws-sdk');

// Log to verify credentials are loaded
console.log('AWS Config:', {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Missing',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Missing',
  region: process.env.AWS_REGION
});

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

exports.uploadToS3 = async (fileBuffer, fileName) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `resumes/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: 'application/pdf',
    // Make file accessible
    ACL: 'private'  // Private by default, access through signed URLs
  };

  try {
    console.log(`Uploading to S3: ${params.Key}`);
    const result = await s3.upload(params).promise();
    console.log(`✓ Upload successful: ${result.Location}`);
    return result.Location;
  } catch (error) {
    console.error(`✗ S3 upload error:`, error);
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Optional: Generate signed URL for downloading resume
exports.generateSignedUrl = async (key) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 3600 // URL valid for 1 hour
  };

  try {
    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;
  } catch (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};