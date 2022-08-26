import jwt from 'jsonwebtoken' // https://www.npmjs.com/package/jsonwebtoken

const expiresIn = 5 * 60  // must expire within 5 minutes for Salesforce
const algorithm = "RS256" // Salesforce only supports RS256

/**
 * 
 * @abstract Generate and sign JWT for Salesforce
 * 
 * @param {string} subject The username of the user in Salesforce we're requesting an access token for (whom the token refers to)
 * @param {string} issuer The client id / consumer key defined in Connected App
 * @param {string} audience What (or who) the token is intended for 
 * @param {object} keyInfo Object containing private key for signing JWT, certificate for verifying signing,
 *                         and optionally thumbprint/fingerprint of certificate
 * @param {object} payload Additional data (defaults to empty object) to add to the standard payload parameters
 *                         iat (issued at), exp (expiration time), aud (audience, what or who the token is intended for),
 *                         iss (issuer, who created or signed the token), sub (whom the token refers to)
 * @returns Object containg token (string) verify information (object)
 */
 export function getJwt(subject, issuer, audience, keyInfo, payload = {}) {
    // standard/main payload
    const signOptions = {
        issuer,
        subject,
        audience,
        expiresIn,
        algorithm,
    };

    // optionally add thumbprint of certificate (needed if using with azure) to the JWT header
    if (keyInfo.fingerprint) {
        signOptions.header = {
            "x5t": keyInfo.fingerprint // x5t = X.509 certificate SHA-1 thumbprint
        }
    }

    // sign the token with private key
    const token = jwt.sign(payload, keyInfo.privateKey, signOptions);

    let verify = {
        "validated": false,
        "info": undefined,
        "error": undefined
    }
    // verify that it was signed correctly with a private key that matches the public certificate
    const verifyOptions = {
        issuer,
        subject,
        audience,
        expiresIn,
        algorithm
    };
    try {
        const info = jwt.verify(token, keyInfo.certificate, verifyOptions);
        verify.validated = true
        verify.info = info
    } catch (e) {
        verify.error = e.message
    }
    return {
        token,
        verify
    }
}