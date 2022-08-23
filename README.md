# Salesforce Silent Login

## Generate Crypto Keys

Create folder for public/private key pair
```bash
mkdir cert
cd cert
```

Generate private key and certificate 

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

## Tools

* https://oauthdebugger.com/debug
* https://jwt.io/

