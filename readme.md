
# youtube-channel-stats

  Get youtube channel stats from YouTube's analytics and data api. 
  
  This module is pretty tailored to our usage, but we're open to PRs to
  make it a bit easier to use, etc.

## Installation

  Install with npm

    $ npm install youtube-channel-stats

## API

```js
'use strict'

let client = require('youtube-channel-stats')
let co = require('co')

co(function*() {
  let getStats = yield client({
    // for OAuth analytics requests
    clientId: "",
    clientSecret: "",

    // for public channel stat requests to prevent rate limiting
    apiKey: ""
  })
  let stats = yield getStats({
    shortName: "monstercatmedia",

    // OR
    channelId: "channelId",

    // per-channel analytics auth
    accessToken: "",
    refreshToken: "",

    // analytics range if you have analytics tokens
    "start-date": "2014-04-01"
    "end-date": "2014-04-01",
  })
})()
```

stats generated:

```json
{
    "analytics": {
        "annotationClickThroughRate": "0.0001858045",
        "annotationCloseRate": "0",
        "averageViewDuration": "132",
        "comments": "75",
        "dislikes": "12",
        "estimatedMinutesWatched": "66575",
        "favoritesAdded": "188",
        "favoritesRemoved": "21",
        "likes": "536",
        "month": "2014-04",
        "shares": "25",
        "subscribersGained": "604",
        "subscribersLost": "158",
        "uniques": "9481",
        "views": "30139"
    },
    "channel": {
        "statistics": {
            "commentCount": "4",
            "hiddenSubscriberCount": "",
            "subscriberCount": "8913",
            "videoCount": "118",
            "viewCount": "310474"
        }
    }
}
```


## License

  The MIT License (MIT)

  Copyright (c) 2014 William Casarin

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
