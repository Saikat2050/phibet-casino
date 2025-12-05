import { S3 } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { appConfig } from '@src/configs'
import path from 'path'

/**
 * @typedef {object} FileOpts
 * @property {string} name
 * @property {string} mimetype
 * @property {string} filePathInS3Bucket
 */

const bucket = new S3({
  region: appConfig.aws.region
})

/**
 * @param {string} fileName
 * @param {string} filePath
 */
export async function deleteFile (fileName, filePath) {
  try {
    await bucket.deleteObject({
      Bucket: appConfig.aws.bucket,
      Key: path.join(filePath, fileName)
    })

    return true
  } catch (error) {
    throw Error(error)
  }
}

/**
 * @param {Buffer} file
 * @param {FileOpts} fileOpts
 */
export async function uploadFile (file, fileOpts) {
  try {
    const [fileType, extension] = fileOpts.mimetype.split('/')
    fileOpts.name = `${fileOpts.name.toLowerCase().replaceAll(' ', '_')}.${extension ?? fileType}`
    const parallelUpload = new Upload({
      client: bucket,
      params: {
        Bucket: appConfig.aws.bucket,
        Key: path.join(fileOpts.filePathInS3Bucket, fileOpts.name),
        Body: file,
        ACL: 'public-read',
        ContentType: fileOpts.mimetype
      }
    })

    const data = await parallelUpload.done()
    return data.Location
  } catch (error) {
    throw Error(error)
  }
}
