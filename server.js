const express   = require('express')
const app       = express()

const http = require('http');
const https = require('https');
const request = require('request')

app.use(function(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin': '*'
    })
    next();
})

const readAPI = uri => {
  let promise = new Promise((resolve, reject) => {
    let client = http;
    if (/^https:\/\//.test(uri)) {
      client = https;
    } else if (!/^http:\/\//.test(uri)){
      reject('proxy not supported')
      return promise;
    }
    console.log('in readAPI');
    request({
        url: uri,
        json: true
      }, (err, response, data) => {
        if (!err && response.statusCode === 200) {
          resolve(data);
        } else {
          reject('could not get response');
      }
    });
  });
  return promise;
}

const redirAPI = (req, res) => {
  let uri = req.query.uri;
  console.log(uri);
  readAPI(uri)
    .then(data => {
      console.log(data);
      res.send(data).end();
    })
    .catch(err => err);
}
app.get('/redir', redirAPI);

app.listen(8010, _ => console.log('listen at 8010'));
