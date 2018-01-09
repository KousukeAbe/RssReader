var RSSList = [];
var req = new XMLHttpRequest();
var page, setting;

window.onload = function(){
  req.onreadystatechange = function(){
    if(req.readyState == 4){ // 通信の完了時
      if(req.status == 200){ // 通信の成功時
        RegistrationRSS(JSON.parse(req.responseText));
      }
    }
  };
  req.open('GET', 'https://akgalaxy-rss-reader.herokuapp.com/GetRSSList', true);
  req.send(null);
};

function RegistrationRSS(list){
  for(var i = 0; i < list.length; i++){
    RSSList[i] = new RSS(list[i]);
  }
}

function OpenArticle(article){
  page = new Page;
  var link = article.getAttribute('name');
  page.ArticleRender(link);
}

function visible(){
  page.PageClose(page);
}

function OpenModalSetting(){
  page = new Page;
  var rsslist = [];
  for(var i = 0; i < RSSList.length; i++){
    rsslist.push(RSSList[i].GetList());
  }
  setting = new RssSetting(rsslist);
}

function OpenColorSetting(){
  page = new Page;
  var rsslist = [];
  for(var i = 0; i < RSSList.length; i++){
    rsslist.push(RSSList[i].GetList());
  }
  setting = new ColorSetting(rsslist);
}

function ColorSet(event){
  setting.ColorVisible(event);
  setting.ColorSet(event);
}
