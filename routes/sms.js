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
    var accessKey = process.env.NAVER_API_ACCESS_KEY;
    var secretKey = process.env.NAVER_API_SECRET_KEY;

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

    fetch(process.env.NAVER_API_BASE_URL + "/sms/v2/services/ncp:sms:kr:260838663750:heraclass/messages", {
        method: 'POST',
        headers: {
            'x-ncp-apigw-signature-v2': signature,
            'x-ncp-apigw-timestamp': timestamp,
            'x-ncp-iam-access-key': process.env.NAVER_API_ACCESS_KEY,
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({
            "type": "SMS",
            "from": process.env.BUSINESS_PHONE_NUMBER,
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