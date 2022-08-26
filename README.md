# Salesforce Silent Login

This module provides functionality to generate a signed JWT and use this JWT to login to Salesforce using
the Salesforce JWT OAuth Flow. It can be used to login as a normal Salesforce user or a Experience Cloud user.

To use the module you must first
* Generate public/private keypair (crypto keys) for signing the JWT and verifying the signature
* Create a Connected App that uses the public key (certificate) to verify JWT signature
* Configure Salesforce users to enable access to the Connected App
## Generate Crypto Keys

Create folder for public/private key pair
```bash
mkdir cert
cd cert
```

Generate private key and certificate 

See [docs/cert](docs/cert) for example.

```bash
openssl genrsa -out privatekey.pem 1024
openssl req -new -x509 -key privatekey.pem -out publickey.cer -days 3650 \
        -subj "/C=DK/ST=Aalborg/L=Aalborg/O=pfrandsen/OU=Development/CN=pfrandsen.dk"
# optionally generate fingerprint
openssl x509 -in publickey.cer -noout -fingerprint > fingerprint
```

| Field    | Meaning             | Example      |
|----------|:-------------------:|--------------|
| /C=      |  Country            | DK           |
| /ST=     |  State              | Aalborg      |
| /L=      |  Location           | Aalborg      |
| /O=      |  Organization       | pfrandsen    |
| /OU=     | Organizational Unit | Development  |
| /CN=     | Common Name         | pfrandsen.dk |

## Create Connected App

Go to: Setup -> Apps -> App Manager and click the New Connected App button.


Setup -> Apps -> Connected Apps -> Mange Connected Apps and click edit next to the apps name.

## User Setup

Set OAuth policies (users are pre-authorized etc.) and add Connected App to relevant permission sets and/or profiles.

## Example Code

The example below get access token for an Experience Cloud user in a Sandbox environment.
```javascript
import * as sfLogin from 'salesforce-silent-login'

const clientId = '<consumer-key-from-Connected-App>' // clientId
const audience = 'https://<sandbox-name>.sandbox.my.site.com/<experience-cloud-site>'
const subject = '<experience-cloud-username>'
const data = sfLogin.getJwt(subject, clientId, audience, sfLogin.getCertInfo('<path-to-crypto-keys>'))
const tokenUrl = `https://<sandbox-name>.sandbox.my.site.com/<experience-cloud-site>${sfLogin.TOKEN_PATH}`
const tokenResponse = await sfLogin.getAccessToken(data.token, tokenUrl)
console.log('tokenResponse', tokenResponse)
```

The response will look like
```json
{
  "access_token": "00D2...S9C",
  "sfdc_community_url": "https://<sandbox-name>.sandbox.my.site.com/<experience-cloud-site>",
  "sfdc_community_id": "0DB5p000000k9n9GAA",
  "scope": "web api",
  "instance_url": "https://<sandbox-name>.sandbox.my.salesforce.com",
  "id": "https://test.salesforce.com/id/00...AS/00...AK",
  "token_type": "Bearer",
  "ok": true
}
```

To access the Experience Cloud site open url like the ones given below.
```javascript
const retUrl = '<relative-site-path>
// use this to deep link into the Experience Clod site
const url = `${tokenResponse.sfdc_community_url}/secur/frontdoor.jsp?sid=${tokenResponse.access_token}&retURL=${retUrl}`
// use this to go to the default start page in the Experience Clod site
const main = `${tokenResponse.sfdc_community_url}/secur/frontdoor.jsp?sid=${tokenResponse.access_token}`
```
## Tools

* https://oauthdebugger.com/debug
* https://jwt.io/