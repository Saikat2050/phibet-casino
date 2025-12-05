import crypto from 'crypto'

// Example client secret
const clientSecret = '12345678-1234-1234-1234-123456789012'

/**
 * @type {import('express').RequestHandler}
 */
export function verifySignature (req, res, next) {
  try {
    const signatureBase64 = req.headers['x-signature']
    if (!signatureBase64) return res.status(400).json({ error: 'Signature is missing' })

    // Convert body to string and append '\n' if necessary
    const body = JSON.stringify(req.body) + '\n'

    const hmac = crypto.createHmac('sha256', clientSecret)
    hmac.update(body)
    const generatedSignature = hmac.digest()

    // Decode the base64 signature from the request
    const signature = Buffer.from(signatureBase64, 'base64url')

    // Compare the signatures
    if (!crypto.timingSafeEqual(generatedSignature, signature)) {
      return res.status(401).json({ error: 'Signatures do not match' })
    }

    next()
  } catch (error) {
    next(error)
  }
}
