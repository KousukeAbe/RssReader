var request = require('request');
var xmlparser = require('xmljson').to_json;
var http = require('http');
var fs = require('fs');
var url_parse = require('url');
var client = require('cheerio-httpcli');

var json;
var RSSkun = [];
var linklist = [
  'http://lovelivepress.com/?xml',
  'http://blog.livedoor.jp/itsoku/index.rdf',
  'http://feed.rssad.jp/rss/gigazine/rss_2.0',
  'http://imas-cg.net/index.rdf',
  'http://rss.rssad.jp/rss/ascii/rss.xml',
  'http://blog.livedoor.jp/bluejay01-review/index.rdf',
  'http://feeds.feedburner.com/gadget2ch/feed?format=xml'
];

class Page {
  constructor(url){
    this.option = {
      url: url,
      method : 'GET',
      headers : { 'Content-Type' : 'application/rss+xml' }
    }

    this.article = new Array;
    this.title = new Array;
    this.color = '#FF9900';
  }

  get_page(page){
    request(this.option, function (error, response, body) {
      xmlparser(body, function(err,jsn){
        page.push_article(jsn);
        page.push_title(jsn);
      });
    });
  }

  update_page(page){
    request(this.option, function (error, response, body) {
      xmlparser(body, function(err,jsn){
        page.update_article(jsn);
      });
    });
  }

  push_title(body){
    if(body['rdf:RDF']){
      var items = body['rdf:RDF'];
      this.title.push(items.channel.title);
      this.title.push(items.channel.link);
    }else{
      var items = body.rss;
      this.title.push(items.channel.title);
      this.title.push(items.channel.link);
    }
  }

  push_article(body){
    if(body['rdf:RDF']){
      var items = body['rdf:RDF'].item;

      for(var i = 0; i < Object.keys(items).length; i++){
        var obj = {};
        var flag = true;

        obj.title = items[i].title;
        obj.day = items[i]['dc:date'];
        obj.link = items[i].link;
        obj.image = items[i]['content:encoded'].match(/<img.*?>/gi);

        this.article.push(obj);
      }
    }else{
      var items = body.rss.channel.item;

      for(var i = 0; i < Object.keys(items).length; i++){
        var obj = {};
        var flag = true;
        obj.title = items[i].title;
        obj.day = items[i]['dc:date']? items[i]['dc:date']: items[i].pubDate;
        obj.link = items[i].link;
        obj.image = items[i].description.match(/<img.*?>/gi);

        this.article.push(obj);
      }
    }
    while(10 < this.article.length){
      this.article.pop();
    }
  }

  update_article(body){
    if(body['rdf:RDF']){
      var items = body['rdf:RDF'].item;

      for(var i = Object.keys(items).length - 1; i >= 0; i--){
        var obj = {};
        var flag = true;

        obj.title = items[i].title;
        obj.day = items[i]['dc:date'];
        obj.link = items[i].link;
        obj.image = items[i]['content:encoded'].match(/<img.*?>/gi);

        for(var p = 0; p < this.article.length; p++){
          if(this.article[p].title == obj.title){
            flag = false;
            break;
          }
        }

        if(flag)this.article.unshift(obj);
      }
    }else{
      var items = body.rss.channel.item;

      for(var i = Object.keys(items).length - 1; i >= 0; i--){
        var obj = {};
        var flag = true;
        obj.title = items[i].title;
        obj.day = items[i]['dc:date']? items[i]['dc:date']: items[i].pubDate;
        obj.link = items[i].link;
        obj.image = items[i].description.match(/<img.*?>/gi);

        for(var p = 0; p < this.article.length; p++){
          if(this.article[p].title == obj.title){
            flag = false;
            break;
          }
        }

        if(flag)this.article.unshift(obj);
      }
    }
    while(10 < this.article.length){
      this.article.pop();
    }
  }

  get_article(){
    return this.article;
  }

  get_title(){
    return this.title;
  }

  set_color(color){
    this.color = color;
    return;
  }

  get_color(){
    return this.color;
  }
}

for(var i = 0; i < linklist.length; i++){
  RSSkun.push(new Page(linklist[i]));
  RSSkun[i].get_page(RSSkun[i]);
}

var server = http.createServer();
server.on('request',doRequest);
server.listen(process.env.PORT || 8000);//(process.env.PORT || 8000);
setTimeout(RegularlyData, 600000);
console.log('うほうほサーバー');

function doRequest(req,res){
  //readfile・・・ファイルの読み込みができる。
  //第一引数・・・ファイルのパス
  //第二引数・・・エンコード名
  //第三引数・・・コールバック関数
  var query_parts = url_parse.parse(req.url, true);
  switch(true) {
    case /uho/.test(query_parts.path):
      SendData().then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;


    case /uhi/.test(query_parts.path):
      SendTitle().then(function(data){
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(data));
        res.end();
      },{});
      break;

    case /colorupdate/.test(query_parts.path):
      console.log(query_parts);
      var color = query_parts.query.color;
      var number = query_parts.query.number;
      console.log(number);

      RSSkun[number].set_color(color);
      res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
      res.write("ok");
      res.end();
      break;

    case /uhu/.test(query_parts.path):
      console.log(query_parts.query);
      var url = query_parts.query.url;
      client.fetch(url, "", function (err, $, reo, body) {
        console.log(body);
        res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
        res.write(body);
        res.end();
      });
      break;

    case /delet/.test(query_parts.path):
      console.log(query_parts.query);
      var url = query_parts.query.link;

      for (var i = 0; i < RSSkun.length; i++) {
        var target = RSSkun[i].get_title();
        if(target[0] == url){
          RSSkun.splice(i, 1);
          linklist.splice(i, 1);
          break;
        }
      }
      res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
      res.write("ok");
      res.end();
      break;


    case /insert/.test(query_parts.path):
      console.log(query_parts.query);
      var link = query_parts.query.link;
      RSSkun.push(new Page(link));
      RSSkun[RSSkun.length - 1].get_page(RSSkun[RSSkun.length - 1]);
      var respon = [];
      setTimeout(() => {
        respon.push(RSSkun[RSSkun.length - 1].get_article());
        respon.push(RSSkun[RSSkun.length - 1].get_title());
        res.writeHead(200,{'Content-Type':'text/json','charset':'utf-8'});
        res.write(JSON.stringify(respon));
        res.end();
      }, 2000);
      break;

    case /rsscheck/.test(query_parts.path):
      console.log(query_parts.query);
      var url = query_parts.query.check;

      client.fetch(url, "", function (err, $, reo, body) {
        if(err){
          res.writeHead(400,{'Content-Type':'text/html','charset':'utf-8'});
          res.write("muripo");
          res.end();
          return;
        }
        var resdata = [{}];
        resdata[0].link = body.match(/type\=[\"|\']application\/(rss|atom|rdf)\+xml[\"|\'].*?href=[\"|\'][^<>\"\']+[\"|\']/gi)[0];
        resdata[0].title = body.match(/title.*?<\/title>/gi)[0];
        resdata[0].info = body.match(/name\=[\"|\']description[\"|\'].*?content=[\"|\'][^<>\"\']+[\"|\']/gi)[0];
        res.writeHead(200,{'Content-Type':'text/html','charset':'utf-8'});
        res.write(JSON.stringify(resdata));
        res.end();
      });
      break;
  }
}

function SendTitle(){
  return new Promise(function(resolve, reject){
    var senddata = [];

    for(var i = 0; i < RSSkun.length; i++){
      console.log(senddata[i]);
      senddata.push(RSSkun[i].get_title());
      console.log(senddata[i]);
      senddata[i][2] = RSSkun[i].get_color();
    }

    resolve(senddata);
  });
}

function SendData(){
  return new Promise(function(resolve, reject){
    var senddata = [];

    for(var i = 0; i < RSSkun.length; i++){
      senddata.push(RSSkun[i].get_article());
    }

    resolve(senddata);
  });
}

function RegularlyData(){
  for(var i = 0; i < RSSkun.length; i++){
    RSSkun[i].update_page(RSSkun[i]);
  }
  console.log("GO");
  setTimeout(RegularlyData, 600000);
}
