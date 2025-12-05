import config from '../configs/app.config'
import { s3 } from '../libs/aws-s3'
import AWS from 'aws-sdk'
import { LOGICAL_ENTITY } from '../utils/constants/constant'
export async function uploadFiles (files, user) {
  const s3Config = config.getProperties().s3

  try {
    const awaitedFiles = await Promise.all(files)
    const dataToInsert = []
    for (const ele of awaitedFiles) {
      const element = {}
      const key = `${config.get('env')}/assets/${LOGICAL_ENTITY.USER_PROFILE}/${new Date().valueOf()}/${user.userId}.${ele.mimetype.split('/')[1]}`

      const s3Params = {
        ACL: 'public-read',
        Bucket: s3Config.bucket,
        Key: key,
        Body: ele.buffer
      }
      const uploadedFile = await s3.upload(s3Params).promise()
      element.userId = user.userId
      element.documentUrl = uploadedFile.Location
      element.documentName = ele.fieldname
      element.isVerified = false
      element.status = 0
      element.key = key
      dataToInsert.push(element)
    }
    return dataToInsert
  } catch (e) {
    return ('DocumentUploadError')
  }
}

const s3Client = () => {
  // configuring the AWS environment
  AWS.config.update({
    region: config.get('s3.region')
  })

  return new AWS.S3()
}

export const uploadDoc = (file, filename, key = undefined) => {
  filename = filename.split(' ').join('')

  const bucketParams = {
    Bucket: config.get('s3.bucket'),
    Key: filename,
    Body: file.buffer,
    ACL: 'public-read',
    ContentType: file.mimetype
  }

  if (key) {
    const deleteParams = {
      Bucket: config.get('s3.bucket'),
      Key: key
    }
    s3Client().deleteObject(deleteParams).promise()
  }

  const s3File = s3.upload(bucketParams).promise()
  return s3File
}
