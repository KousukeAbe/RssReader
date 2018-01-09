var request = require('request');
var xmlparser = require('xmljson').to_json;

module.exports = class Page {
  constructor(url){
    this.option = {
      url: url,
      method : 'GET',
      headers : { 'Content-Type' : 'application/rss+xml' }
    }
    this.article = new Array;
    this.title = new Array;
    this.color = '#FF9900';
  };

  get_page(page){
    request(this.option, function (error, response, body) {
      xmlparser(body, function(err,jsn){
        page.push_article(jsn);
        page.push_title(jsn);
      });
    });
  };

  update_page(page){
    request(this.option, function (error, response, body) {
      xmlparser(body, function(err,jsn){
        page.update_article(jsn);
      });
    });
  };

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
  };

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
  };

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
  };

  set_color(color){
    this.color = color;
    return;
  };

  get_article(){return this.article};
  get_title(){return this.title};
  get_color(){return this.color};
}
