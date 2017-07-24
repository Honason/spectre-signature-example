const NodeRSA = require('node-rsa');
const request = require('request-promise-native');
const express = require('express');
const router = express.Router();

const SERVICE_SECRET = 'YOUR_SERVICE_SECRET';
const CLIENT_ID = 'YOUR_CLIENT_ID';
const PRIVATE_KEY = 'YOUR_PRIVATE_KEY';

const key = new NodeRSA();

key.importKey(PRIVATE_KEY);

key.setOptions({
    signingScheme: 'pkcs1-sha1'
});

router.get('/', function(req, res, next) {
  const method = 'GET';
  const url = 'https://www.saltedge.com/api/v3/categories';
  const expiresAt = (Date.now() / 1000 | 0) + 120;

  const signatureText = `${expiresAt}|${method}|${url}|`;
  const signature = key.sign(signatureText, 'base64');

  const options = {
    method,
    url,
    headers: {
      Accept: 'application/json',
      Signature: signature,
      'Service-secret': SERVICE_SECRET,
      'Client-id': CLIENT_ID,
      'Content-type': 'application/json',
      'Expires-at': expiresAt
    }
  };

  return request(options)
    .then(response => {
      res.send(response);
    });
});

module.exports = router;
