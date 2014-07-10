'use strict';

let expect = require('expect.js');
let client = require('./');
let co = require('co');

let clientId = process.env.YT_CLIENT_ID
let clientSecret = process.env.YT_CLIENT_SECRET
let accessToken = process.env.YT_ACCESS_TOKEN
let refreshToken = process.env.YT_REFRESH_TOKEN
let apiKey = process.env.YT_API_KEY

describe('basic test', function(){
  it('works', function(done){
    co(function*(){
      let getStats = yield client({
        clientId: clientId,
        clientSecret: clientSecret,
        apiKey: apiKey
      })

      let stats = yield getStats({
        shortName: "jackbox55",
        accessToken: accessToken,
        refreshToken: refreshToken
      })

      expect(stats.analytics).to.be.ok()
      expect(stats.channel).to.be.ok()
      expect(stats.channel.code).to.not.be.ok()

      console.log(stats)
    })(done)
  });
});
