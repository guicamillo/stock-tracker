var express = require("express"),
  request = require("request");

var app = express();

// Forward all requests from /something to something
app.use("/*", function(req, res) {
  req.pipe(request(req.url.substring(1, req.length))).pipe(res);
});

app.listen(process.env.PORT || 3000);
