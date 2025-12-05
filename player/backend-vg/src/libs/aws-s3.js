import AWS from 'aws-sdk'
import config from '../configs/app.config'

const s3Config = config.getProperties().s3

export const s3 = new AWS.S3({
  accessKeyId: s3Config.access_key_id,
  secretAccessKey: s3Config.secret_access_key,
  region: s3Config.region
})
