var client = require('cheerio-httpcli');
var Page = require('./Class');

function SendTitle(RSSList){
  return new Promise(function(resolve, reject){
    var senddata = [];
    for(var i = 0; i < RSSList.length; i++){
      senddata.push(RSSList[i].get_title());
      senddata[i][2] = RSSList[i].get_color();
    }
    resolve(senddata);
  });
}

function SendData(RSSList, title){
  return new Promise(function(resolve, reject){
    var senddata = [];
    for(var i = 0; i < RSSList.length; i++){
      if(RSSList[i].get_title()[0] == title){
        senddata.push(RSSList[i].get_article());
        break;
      }
    }
    resolve(senddata);
  });
}

function RSSCheck(url){
  return new Promise(function(resolve, reject){
    client.fetch(url, "", function (err, $, reo, body) {
      if(err){
        reject();
        return;
      }
      if(!body.match(/type\=[\"|\']application\/(rss|atom|rdf)\+xml[\"|\'].*?href=[\"|\'][^<>\"\']+[\"|\']/gi)){
        reject();
        return;
      }
      var resdata = [{}];
      resdata[0].link = body.match(/type\=[\"|\']application\/(rss|atom|rdf)\+xml[\"|\'].*?href=[\"|\'][^<>\"\']+[\"|\']/gi)[0];
      resdata[0].title = body.match(/title.*?<\/title>/gi)[0];
      resdata[0].info = body.match(/name\=[\"|\']description[\"|\'].*?content=[\"|\'][^<>\"\']+[\"|\']/gi)[0];
      resolve(resdata);
    });
  });
};

function InsertPage(link, RSSList){
  return new Promise(function(resolve, reject){
    RSSList.push(new Page(link));
    RSSList[RSSList.length - 1].get_page(RSSList[RSSList.length - 1]);
    setTimeout(() => {resolve(RSSList[RSSList.length - 1].get_title())}, 1000);
  });
}

function DeleteRSS(url, RSSList){
  for (var i = 0; i < RSSList.length; i++) {
    var target = RSSList[i].get_title();
    if(target[0] == url){
      RSSList.splice(i, 1);
      break;
    }
  }
}

exports.SendTitle = SendTitle;
exports.SendData = SendData;
exports.RSSCheck = RSSCheck;
exports.InsertPage = InsertPage;
exports.DeleteRSS = DeleteRSS;
