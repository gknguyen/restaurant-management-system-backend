import aws from 'aws-sdk';
import express, { Router } from 'express';
import { Results } from '../../commons/constants/interfaces';
import errorHandler from '../../commons/error.handler/errorHandler';
import { STATUS_CODE, AWS } from '../../commons/constants/keyValues';

const awsS3Router = Router();

awsS3Router.get('/getSignedUrl', getSignedUrl_API());

aws.config.update({
  accessKeyId: AWS.AUTH_KEY.ACCESS_KEY_ID,
  secretAccessKey: AWS.AUTH_KEY.SECRET_ACCESS_KEY,
});

/* ================================================================================== */
/*
get signed URL
*/
export const getSignedUrl = async (requestQuery: any) => {
  const results = {
    code: 0,
    message: '',
    values: {},
  } as Results;

  try {
    const fileName: string | null = requestQuery.fileName;
    const fileType: string | null = requestQuery.fileType;
    let folderName: string | null = requestQuery.folderName;

    const s3 = new aws.S3();

    if (!fileName) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'fileName is missing';
      return results;
    }
    if (!fileType) {
      results.code = STATUS_CODE.NOT_FOUND;
      results.message = 'fileType is missing';
      return results;
    }

    if (folderName) {
      folderName = '/' + folderName;
    }

    const data = s3.getSignedUrl('putObject', {
      Bucket: AWS.S3.BUCKET + folderName,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read',
    });

    results.code = STATUS_CODE.SUCCESS;
    results.message = 'signed URL found';
    results.values = data;
    return results;
  } catch (err) {
    results.code = STATUS_CODE.SERVER_ERROR;
    results.message = '/getSignedUrl : ' + err.toString();
    return results;
  }
};

function getSignedUrl_API() {
  return errorHandler(
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const requestQuery: any = req.query;
      const results = await getSignedUrl(requestQuery);

      res.status(results.code).send(results);
      if (results.code !== STATUS_CODE.SUCCESS) {
        throw results.message;
      }
    },
  );
}

export default awsS3Router;
