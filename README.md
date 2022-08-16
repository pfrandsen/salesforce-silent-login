# salesforce-silent-login

## Generate Certifikate

Create folder for public/private key pair
```bash
mkdir jwt
cd jwt
mkdir cert
cd cert
```

Generate certificate and get public key
```bash
openssl req -newkey rsa:2048 -nodes -keyout private_key.pem -x509 -days 365 -out certificate.pem \
        -subj "/C=DK/ST=Aalborg/L=Aalborg/O=pfrandsen/OU=Development/CN=pfrandsen.dk"
openssl x509 -outform der -in certificate.pem -out public_key.der
openssl x509 -in certificate.pem -pubkey > public_key.pem         
```

Use this instead?
```bash
openssl genrsa -out privatekey.pem 1024
openssl req -new -x509 -key privatekey.pem -out publickey.cer -days 3650 \
        -subj "/C=DK/ST=Aalborg/L=Aalborg/O=pfrandsen/OU=Development/CN=pfrandsen.dk"
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

Set OAuth policies (users are pre-authorized etc.) and add Connected App to relevant profiles.

## Tools

https://oauthdebugger.com/debug
https://jwt.io/

