import xml2js from 'xml2js'
import CryptoJS from 'crypto-js'
import ServiceBase from '@src/libs/serviceBase'
import { APIError } from '@src/errors/api.error'
import { geoComply } from '@src/configs'

export default class DecodeToken extends ServiceBase {
  async run () {
    const { token } = this.args

    const parser = new xml2js.Parser()
    const t = decodeURIComponent(token)

    try {
      const key = CryptoJS.enc.Hex.parse(geoComply.decryptionKey)
      const iv = CryptoJS.enc.Hex.parse(geoComply.decryptionIV)

      const xml = CryptoJS.AES.decrypt(t, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        keySize: 128 / 16,
        padding: CryptoJS.pad.Pkcs7
      }).toString(CryptoJS.enc.Utf8)
      const data = await parser.parseStringPromise(xml)
      return { success: true, data }
    } catch (err) {
      throw new APIError(err)
    }
  }
}
