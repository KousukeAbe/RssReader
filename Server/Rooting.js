var Page = require('./Class');
var FunctionList = require('./FunctionList');
var client = require('cheerio-httpcli');


exports.RootingTable = function(query_parts, RSSList, res){
  switch(true) {
    case /GetArticle/.test(query_parts.path):
      var title = query_parts.query.title;
      FunctionList.SendData(RSSList, title).then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;

    case /GetRSSList/.test(query_parts.path):
      FunctionList.SendTitle(RSSList).then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;

    case /uhi/.test(query_parts.path):
      FunctionList.SendTitle(RSSList).then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;

    case /colorupdate/.test(query_parts.path):
      var color = query_parts.query.color;
      var number = query_parts.query.number;
      RSSList[number].set_color(color);
      res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
      res.write("ok");
      res.end();
      break;

    case /uhu/.test(query_parts.path):
      var url = query_parts.query.url;
      client.fetch(url, "", function (err, $, reo, body) {
        res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
        res.write(body);
        res.end();
      });
      break;

    case /delet/.test(query_parts.path):
      var url = query_parts.query.link;
      FunctionList.DeleteRSS(url, RSSList);
      res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
      res.write("ok");
      res.end();
      break;


    case /insert/.test(query_parts.path):
      var link = query_parts.query.link;
      FunctionList.InsertPage(link, RSSList).then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;

    case /rsscheck/.test(query_parts.path):
      var url = query_parts.query.check;
      FunctionList.RSSCheck(url).then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },function(){
        res.writeHead(400,{'Content-Type':'text/html','charset':'utf-8'});
        res.write("muripo");
        res.end();
      });
      break;

    default:
    res.writeHead(400,{'Content-Type':'text/html','charset':'utf-8'});
    res.write("muripo");
    res.end();
    break;
  }
}
