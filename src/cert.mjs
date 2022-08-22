import * as path from 'path'
import * as fs from 'fs'

/**
 * 
 * @param {string} filePath The path to location where certificate/key information is stored. The private key
 *                          must be named "privatekey.pem", the certificate (public key) must be named "publickey.cer".
 *                          If there is a files named "fingerprint" it is assumed to be in the openssl x509 fingerprint
 *                          format and it will be converted into a base64url X.509 fingerprint
 * @returns Object containing "privateKey", "certificate" and optionally "fingerprint"
 */
export function getCertInfo(filePath) {
    const privPath = path.join(filePath, 'privatekey.pem')
    const certificatePath = path.join(filePath, 'publickey.cer')
    const fpPath = path.join(filePath, 'fingerprint')
    let privateKey
    let certificate
    let fingerprint
    if (fs.existsSync(privPath)) {
        privateKey = fs.readFileSync(privPath, 'utf8')
    }
    if (fs.existsSync(certificatePath)) {
        certificate = fs.readFileSync(certificatePath, 'utf8')
    }
    if (fs.existsSync(fpPath)) {
        // convert file content "SHA1 Fingerprint=E6:F9:...:5D:32" to "E6F9...5D32"
        const buff = Buffer.from(fs.readFileSync(fpPath, 'utf8').split('=')[1].replaceAll(':', ''))
        fingerprint = buff.toString('base64url')
    }
    return {
        'privateKey': privateKey,
        'certificate': certificate,
        'fingerprint': fingerprint,
    }
}