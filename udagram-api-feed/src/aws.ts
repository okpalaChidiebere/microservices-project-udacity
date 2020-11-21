import AWS = require('aws-sdk');
import { config } from './config/config';

const c = config.dev;

//Configure AWS
if(c.aws_profile !== "DEPLOYED") {
var credentials = new AWS.SharedIniFileCredentials({profile: c.aws_profile});
AWS.config.credentials = credentials;
}

export const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: c.aws_region,
  params: {Bucket: c.aws_media_bucket}
});


/* getGetSignedUrl generates an aws signed url to retreive an item
 * @Params
 *    key: string - the filename to be put into the s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getGetSignedUrl( key: string ): string{

  const signedUrlExpireSeconds = 60 * 5

    const url = s3.getSignedUrl('getObject', {
        Bucket: c.aws_media_bucket,
        Key: key,
        Expires: signedUrlExpireSeconds
      });

    return url;
}

/* getPutSignedUrl generates an aws signed url to put an item
 * @Params
 *    key: string - the filename to be retreived from s3 bucket
 * @Returns:
 *    a url as a string
 */
export function getPutSignedUrl( key: string ){

    const signedUrlExpireSeconds = 60 * 5

    const url = s3.getSignedUrl('putObject', {
      Bucket: c.aws_media_bucket,
      Key: key,
      Expires: signedUrlExpireSeconds
    });

    //eg https://udagram-okpala-dev.s3.ca-central-1.amazonaws.com/xander0.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIASF5Q3TKKMGD5HBGO%2F20200907%2Fca-central-1%2Fs3%2Faws4_request&X-Amz-Date=20200907T192936Z&X-Amz-Expires=300&X-Amz-Signature=2e63ad49ecea7f18e33b369f484fc50520853bb6442f64d495dd32b3ba0fc870&X-Amz-SignedHeaders=host
    //you cannot view this url directory.
    return url;
}
