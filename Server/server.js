var http = require('http');
var fs = require('fs');
var url_parse = require('url');

var Page = require('./Class');
var Rooting = require('./Rooting');

var RSSList = [];
var linklist = [
  'http://lovelivepress.com/?xml',
  'http://blog.livedoor.jp/itsoku/index.rdf',
  'http://feed.rssad.jp/rss/gigazine/rss_2.0',
  'http://imas-cg.net/index.rdf',
  'http://rss.rssad.jp/rss/ascii/rss.xml',
  'http://blog.livedoor.jp/bluejay01-review/index.rdf',
  'http://feeds.feedburner.com/gadget2ch/feed?format=xml'
];

for(var i = 0; i < linklist.length; i++){
  RSSList.push(new Page(linklist[i]));
  RSSList[i].get_page(RSSList[i]);
}

var server = http.createServer();
server.on('request',doRequest);
server.listen(process.env.PORT || 8000);
setTimeout(RegularlyData, 600000);
console.log('うほうほサーバー');

function doRequest(req,res){
  var query_parts = url_parse.parse(req.url, true);
  Rooting.RootingTable(query_parts, RSSList, res);
}

function RegularlyData(){
  for(var i = 0; i < RSSList.length; i++){
    RSSList[i].update_page(RSSList[i]);
  }
  console.log("GO");
  setTimeout(RegularlyData, 600000);
}
