import { S3 } from '@aws-sdk/client-s3'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import { Upload } from '@aws-sdk/lib-storage'
import { appConfig } from '@src/configs'
import path from 'path'
import { Logger } from './logger'
/**
 * @typedef {object} FileOpts
 * @property {string} name
 * @property {string} mimetype
 * @property {string} filePathInS3Bucket
 */

const bucket = new S3({
  // credentials: {
  //   accessKeyId: appConfig.aws.accessKey,
  //   secretAccessKey: appConfig.aws.secretAccessKey
  // }
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
    const [extension1, extension2] = fileOpts.mimetype.split('/')
    fileOpts.name = `${fileOpts.name.toLowerCase().replaceAll(' ', '_')}.${extension2 ?? extension1}`
    const parallelUpload = new Upload({
      client: bucket,
      params: {
        Bucket: appConfig.aws.bucket,
        Key: path.join(fileOpts.filePathInS3Bucket, fileOpts.name),
        Body: file,
        ACL: 'public-read'
      }
    })

    const data = await parallelUpload.done()
    return data.Location
  } catch (error) {
    throw Error(error)
  }
}

export async function sendEmail ({ subject, htmlContent, fromEmail, toEmail }) {
  const sesClient = new SESClient({ region: appConfig.aws.region })

  const parameters = {
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlContent
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromEmail
  }

  const command = new SendEmailCommand(parameters)
  try {
    const response = await sesClient.send(command)
    Logger.info(`Email sent successfully. ${response}`)
    return response
  } catch (error) {
    Logger.error(`Error sending Email. ${error}`)
    throw error
  }
}

export async function sendSms ({ phone, otp }) {
  const snsClient = new SNSClient({ region: appConfig.aws.region })
  const message = `Your verification code for Phibet is: ${otp}`

  const command = new PublishCommand({
    Message: message,
    PhoneNumber: phone,
    Origination: '+12065551234'
  })

  try {
    const response = await snsClient.send(command)
    Logger.info(`OTP sent successfully. ${response}`)
    console.log(response, response?.data, 'response from the sns service')
    return response
  } catch (error) {
    console.log(error, 'error in sending otp by sns service')
    Logger.error(`Error sending OTP. ${error}`)
    throw error
  }
}
