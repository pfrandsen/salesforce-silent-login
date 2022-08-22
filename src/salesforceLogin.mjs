import fetch from "node-fetch"

function fetchTokenRequest(token) {
    return {
        "method": "post",
        "headers": {
            "content-type": "application/x-www-form-urlencoded"
        },
        "body": `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
    }
}

export const TOKEN_PATH = '/services/oauth2/token'

/**
 * 
 * @abstract Helper to exchange signed JWT for access token
 * 
 * @param {string} token JWT to be exchanged for access token
 * @param {string} tokenUrl The Salesforce token endpoint. For Experience Cloud login this is the site url including context path.
 * @returns Salesforce token response or error information object. <response-object>.ok is set to true if token request succeeded,
 *          else it is set to false.
 */
export async function getAccessToken(token, tokenUrl) {
    const response = await fetch(tokenUrl, fetchTokenRequest(token))
    // check if response is ok
    if (!response.ok) {
        return {
            "ok": false,
            "errorType": "http",
            "status": response.status,
            "responseBody": await response.text()
        }
    }
    // get the json response body and return it
    try {
        const data = await response.json()
        data.ok = true
        return data
    } catch(e) {
        return {
            "ok": false,
            "errorType": "data",
            "message": e.message
        }
    }
}