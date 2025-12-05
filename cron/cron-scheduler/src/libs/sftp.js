import { config } from '../configs/config'
const Client = require('ssh2-sftp-client')

class SFTPClient {
  constructor () {
    if (!SFTPClient.instance) {
      this.client = new Client()
      this.isConnected = false
      SFTPClient.instance = this
    }

    return SFTPClient.instance
  }

  async connect () {
    if (!this.isConnected) {
      try {
        const options = {
          host: config.get('optimove.host'),
          username: config.get('optimove.user'),
          port: config.get('optimove.port'),
          password: config.get('optimove.password')
        }
        await this.client.connect(options)
        this.isConnected = true
        console.log('Connected to SFTP')
      } catch (err) {
        console.log('Failed to connect:', err)
        this.isConnected = false
      }
    }
  }

  async disconnect () {
    if (this.isConnected) {
      try {
        await this.client.end()
        this.isConnected = false
        console.log('Disconnected from SFTP')
      } catch (err) {
        console.log('Failed to disconnect:', err)
      }
    }
  }

  async uploadFile (localFile, remoteFile) {
    await this.ensureConnection()
    const startTime = new Date()
    console.log(`File '${remoteFile}' started uploading at ${startTime.toISOString()}`)
    try {
      await this.client.put(localFile, remoteFile)
      const endTime = new Date()
      const timeTaken = (endTime - startTime) / 1000
      console.log(`File '${remoteFile}' uploaded successfully in ${timeTaken} seconds at ${endTime.toISOString()}`)
    } catch (err) {
      console.error(`Uploading failed for file '${remoteFile}':`, err)
      throw err
    }
  }

  async checkAllFiles () {
    await this.ensureConnection()
    try {
      const files = await this.client.list('/')
      if (files) return true
    } catch (error) {
      console.error('Reading Error: ', error)
    }
  }

  async deleteFile (remoteFile) {
    await this.ensureConnection()
    try {
      await this.client.delete(remoteFile)
      console.log('File deleted successfully')
    } catch (err) {
      console.error('Deleting failed:', err)
    }
  }

  async ensureConnection () {
    if (!this.isConnected) {
      await this.connect()
    }
  }
}

const sftpInstance = new SFTPClient()

export default sftpInstance
