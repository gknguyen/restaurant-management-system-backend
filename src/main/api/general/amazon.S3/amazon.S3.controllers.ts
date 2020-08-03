import STATUS_CODE from 'http-status';
import { AWS_S3_BUCKET_NAME } from '../../../../commons/constants/env';
import { Results } from '../../../../commons/constants/interfaces';
import s3 from '../../../../configs/aws-S3';

class AmazonS3nController {
  /** ================================================================================== */
  /**
  get signed URL
  */
  getSignedUrl = async (
    fileName: string | null | undefined,
    fileType: string | null | undefined,
    folderName: string | null | undefined,
  ) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      // const fileName: string | null = requestQuery.fileName;
      // const fileType: string | null = requestQuery.fileType;
      // let folderName: string | null = requestQuery.folderName;

      if (!fileName || !fileType) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input is missing';
        return results;
      }

      if (folderName) {
        folderName = '/' + folderName;
      }

      const data = s3.getSignedUrl('putObject', {
        Bucket: AWS_S3_BUCKET_NAME + folderName,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read',
      });

      results.code = STATUS_CODE.OK;
      results.message = 'signed URL found';
      results.values = data;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  get file metadata
  */
  headObject = async (key: string | null | undefined, versionId: string | null | undefined) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!key || !versionId) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const file = await s3
        .headObject({
          Bucket: AWS_S3_BUCKET_NAME,
          Key: key,
          VersionId: versionId,
        })
        .promise();

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = file;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };

  /** ================================================================================== */
  /**
  upload files to S3
  */
  uploadFileToS3 = async (files: Express.Multer.File[]) => {
    const results = {
      code: 0,
      message: '',
      values: null,
    } as Results;

    try {
      if (!files || (files && files.length === 0)) {
        results.code = STATUS_CODE.NOT_FOUND;
        results.message = 'input missing';
        return results;
      }

      const S3Files: any[] = [];
      for (let x in files) {
        const S3File = await s3
          .upload({
            Bucket: AWS_S3_BUCKET_NAME,
            Body: files[x]['buffer'],
            Key: files[x]['originalname'],
            ContentType: files[x]['mimetype'],
            ACL: 'public-read',
          })
          .promise();
        S3Files.push(S3File);
      }

      results.code = STATUS_CODE.OK;
      results.message = 'successfully';
      results.values = S3Files;
      return results;
    } catch (err) {
      results.code = STATUS_CODE.INTERNAL_SERVER_ERROR;
      results.message = err.toString();
      results.values = err;
      return results;
    }
  };
}

const amazonS3nController = new AmazonS3nController();

export default amazonS3nController;
