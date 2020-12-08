const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');



router.get('/test', function (req, res) {
    var space = " ";
    var newLine = "\n";
    var method = "POST";
    var url = "/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages";
    var timestamp = Date.now().toString();
    var accessKey = "1F3CEFD02EB39173D187";
    var secretKey = "04D3A9A2DC9C417A16C3119C8ACBA621C3446B6D";

    var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(accessKey);

    var hash = hmac.finalize();
    var signature = hash.toString(CryptoJS.enc.Base64);

    fetch("https://sens.apigw.ntruss.com/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages", {
        method: 'POST',
        headers: {
            'x-ncp-apigw-signature-v2': signature,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': '1F3CEFD02EB39173D187',
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "type": "SMS",
            "from": "01063905146",
            "content": "테스트입니다",
            "messages": [
                {
                    "to": "01063905146"
                }
            ],
        })
    }).then(response => {
        response.json().then(data => res.send(data))
    }).catch(err => {
        console.log(err)
        res.send({ error: 'eror occured while fetching address' })
    })
})

module.exports = router;