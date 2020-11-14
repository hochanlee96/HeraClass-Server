const express = require('express');
const router = express.Router();
const fetch = require('node-fetch')



router.get('/:address', function (req, res) {
    const address = req.params.address;
    fetch('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=' + encodeURI(address), {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': 'httryobi1m',
            'X-NCP-APIGW-API-KEY': 'NuuaE4v1PftZnYOqx5sEcwyFMIZpQXzfJ5WdCCfG',
            'Accept': 'application/json'
        }
    }).then(response => {
        response.json().then(data => res.send(data.addresses))
    }).catch(err => {
        console.log(err)
        res.send({ error: 'eror occured while fetching address' })
    })
})

router.get('/reverse-geolocation/:x&:y', function (req, res) {
    console.log('params : ', req.params);
    fetch(`https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${req.params.y},${req.params.x}&output=json`, {
        headers: {
            'X-NCP-APIGW-API-KEY-ID': 'httryobi1m',
            'X-NCP-APIGW-API-KEY': 'NuuaE4v1PftZnYOqx5sEcwyFMIZpQXzfJ5WdCCfG',
        }
    }).then(response => {
        response.json().then(data => res.send(data.results[0].region))
    }).catch(err => {
        console.log(err)
    })
})


module.exports = router;