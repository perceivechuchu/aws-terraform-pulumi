import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

const logFiles = new aws.s3.Bucket("logFiles");
const logArchive = new aws.s3.Bucket("logArchive");

logFiles.onObjectCreated("archiveLogs", async (e) => {
    const admZip = require("adm-zip");
    const s3 = new aws.sdk.S3();
    for (const rec of e.Records || []) {
        const zip = new admZip();
        const [ bucket, key ] = [ rec.s3.bucket.name, rec.s3.object.key ];
        console.log(`Zipping ${bucket}/${key} into ${logArchive.bucket.get()}/${key}.zip`);
        const data = await s3.getObject({ Bucket: bucket, Key: key }).promise();
        zip.addFile(key, data.Body);
        await s3.putObject({
            Bucket: logArchive.bucket.get(),
            Key: `${key}.zip`,
            Body: zip.toBuffer(),
        }).promise();
    }
});
