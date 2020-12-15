const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')



router.get('/:address', function (req, res) {
    const address = req.params.address;
    fetch(process.env.NAVER_MAP_BASE_URL + '/map-geocode/v2/geocode?query=' + encodeURI(address), {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_API_KEY_ID,
            'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_API_KEY,
            'Accept': 'application/json'
        }
    }).then(response => {
        response.json().then(data => { console.log('data', data); res.send(data.addresses) })
    }).catch(err => {
        console.log(err)
        res.send({ error: 'eror occured while fetching address' })
    })
})

router.get('/reverse-geolocation/:x&:y', function (req, res) {
    console.log('params : ', req.params);
    fetch(`${process.env.NAVER_API_BASE_URL}/map-reversegeocode/v2/gc?coords=${req.params.y},${req.params.x}&output=json`, {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_MAP_API_KEY_ID,
            'X-NCP-APIGW-API-KEY': process.env.NAVER_MAP_API_KEY,
        }
    }).then(response => {
        response.json().then(data => res.send(data.results[0].region))
    }).catch(err => {
        console.log(err)
    })
})


module.exports = router;