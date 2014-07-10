'use strict';

let gapi        = require('googleapis')
let moment      = require('moment')
let thunk       = require('thunkify')
let debug       = require('debug')('youtube-analytics:simple')
let inspect     = require('util').inspect;
let recParser   = require('csv-record-parser')
let tableParser = require('tableize-csv-parser')()
let xtend       = require('xtend')

function formatDate (d) {
  moment(d).format("YYYY-MM-DD")
}

let defaultMetrics = [
  "annotationClickThroughRate",
  "annotationCloseRate",
  "averageViewDuration",
  "comments",
  "dislikes",
//"earnings",
  "estimatedMinutesWatched",
  "favoritesAdded",
  "favoritesRemoved",
  "likes",
  "shares",
  "subscribersGained",
  "subscribersLost",
//"viewerPercentage",
  "views",
  "uniques",
]

function auth(req, options) {
  if (hasOAuth(options))
    return req.withAuthClient(newAuth(options))
  else
    return req.withApiKey(options.apiKey)
}

function hasOAuth(opts) {
  return !!opts.oauth || 
    ( opts.clientId 
   && opts.clientSecret 
   && opts.accessToken 
   && opts.refreshToken
    )
}

function newAuth(data) {
  if (data.oauth) return data.oauth;
  if (!data.clientId) throw new Error("clientId required")
  if (!data.clientSecret) throw new Error("clientSecret required")

  let credentials = {}
  let oauth = new gapi.OAuth2Client(data.clientId, data.clientSecret)

  oauth.credentials = {
    access_token: data.accessToken,
    refresh_token: data.refreshToken
  }

  return oauth;
}

// youtube shortname to channel id lookup
function getChannelData(client, options){
  return function(done){
    debug("shortName %s", options.shortName)
    let q = { part: "statistics" }

    // use channelId or channel shortName
    if (options.channelId)
      q.id = options.channelId
    else if (options.shortName)
      q.forUsername = options.shortName

    let req = client.youtube.channels.list(q).withApiKey(options.apiKey)

    req.execute(function(err, res){
      if (err) return done(null, err)
      let item = res.items[0] || {};
      return done(null, item)
    });
  };
}

function formatResponse(res) {
  let record = recParser();
  if (!res[0].rows) res[0].rows = [[]];
  let stats = res[0];

  record.header(stats.columnHeaders.map(function(x){ return x.name; }))
  record.row(stats.rows[0])
  debug("res %j", stats)
  return tableParser(record);
}

function* getAnalytics(client, options) {
  let date = options["start-date"];
  let channel = options.channelId
  let metrics = options.metrics || defaultMetrics;

  let q = {
    metrics: metrics.join(",") || "views",
    "start-date": date,
    "end-date": options["end-date"] || date,
    ids: "channel==" + channel,
    fields: "columnHeaders/name,rows",
    dimensions: "month"
  }

  if (options.analyticsQuery)
    q = xtend(q, options.analyticsQuery)

  let req = auth(client.youtubeAnalytics.reports.query(q), options)
  let execute = thunk(req.execute).bind(req)

  var res;
  try {
    res = yield execute()
  } catch(e) {
    return e;
  }

  let formatted = formatResponse(res)
  debug("formatted %j", formatted)
  return formatted
}

var exports = module.exports = function*(clientOpts){
  debug("getting client")
  try {
    var api = gapi.discover('youtubeAnalytics', 'v1')
                  .discover('youtube', 'v3')
    var execute = thunk(api.execute).bind(api)
    var client = yield execute()
  }
  catch (e) {
    throw new Error(inspect(e))
  }

  return function* (options){
    options.clientId = options.clientId || clientOpts.clientId;
    options.clientSecret = options.clientSecret || clientOpts.clientSecret;
    options.apiKey = options.apiKey || clientOpts.apiKey;

    try {
      var channel = yield getChannelData(client, options)
      options.channelId = options.channelId || channel.id;
      var analytics = yield getAnalytics(client, options)
    } catch (e) {

      debug("got err")
      throw new Error(inspect(e))
    }
    debug("returning %j %j", analytics, channel)

    return {
      analytics: analytics,
      channel: channel
    }
  }
};

