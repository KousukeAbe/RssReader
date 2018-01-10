class RssSetting{
  constructor(list){
    document.getElementById('right').innerHTML += `
    <div id="feedsetting">
      <h3>ふいいどついか</h3>
      <div class='search'>
        <img src="img/search.png"/>
        <input type="text" id="searchtext" placeholder="しうとくしたいぺえじをにうりよく"/>
      </div>
      <button id="searchbutton" onclick="setting.RssSearch()">けんさく</button>
      <div id="total"></div>
      <p style="font-size:2vw; font-weight:bold; font-style:italic;color: rgba(0, 0, 0, 0.50); margin:20px 0 20px 100px;">ふいいどたち</p>
      <div id='feedlist' style="margin: 0 0 0 100px; width:80%;"></div>
    </div>`;

    var title = document.getElementsByClassName('title');
    var sort = document.getElementById('feedlist');

    for(var i = 0; i < list.length; i++){
      sort.innerHTML += `
      <div class="feedtitle">
        <img src="https://www.google.com/s2/favicons?domain=${list[i].url}"/>
        <h5>${list[i].title}</h5>
        <button onclick="setting.DeleteRss(this)" link="${list[i].title}" name='${i}'>さくじよ</button>
      </div>
      `;
    }
  };

  RssSearch(event){
    var text = document.getElementById('searchtext').value;
    document.getElementById('searchtext').value = "";
    document.getElementById('total').style.display = "grid";
    this.ServerCommunication(this.TotalVisible, 'rsscheck', text);
  };

  ServerCommunication(fn, query, ...data){
    var req = new XMLHttpRequest();
    var rss = this;
    req.onreadystatechange = function(){
      if(req.readyState == 4) { // 通信の完了時
        if(req.status == 200) { // 通信の成功時
          if(query == "rsscheck"){
            fn(JSON.parse(req.responseText));
          }else if(query == "insert"){
            fn(JSON.parse(req.responseText));
          }else{
            return;
          }
        }
      }else{
        //  result.innerHTML = "通信中..."
      }
    };
    if(query == "rsscheck"){
      req.open('GET', `鯖のURL${query}?check=${data[0]}`, true);
      req.send(null);
    }else if(query == "insert"){
      req.open('GET', `鯖のURL${query}?link=${data[0]}`, true);
      req.send(null);
    }else{
      req.open('GET', `鯖のURL${query}?link=${data[0]}`, true);
      req.send(null);
    }

  };

  TotalVisible(text){
    var infotext = text[0].info.match(/content=\"(((\\\\\")|[^\"])*)\"/);
    var linktext = text[0].link.match(/href=\"(((\\\\\")|[^\"])*)\"/);
    var titletext = text[0].title.match(/>(.*?)</);
    var total = document.getElementById('total');
    total.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${linktext[1]}" />`;
    total.innerHTML += `<h3>${titletext[1]}</h3>`;
    total.innerHTML += `<button id="insertbutton" onclick='setting.InsertRss(this)' link="${linktext[1]}" name="${titletext[1]}" value="${linktext[1]}">追加</button>`;
    total.innerHTML += `<h4>${infotext[1]}</h4>`;
  };

  InsertRss(event){
    var sort = document.getElementById('feedlist');
    var feedsort = document.getElementById('sort');
    sort.innerHTML += `
      <div class="feedtitle">
        <img src="https://www.google.com/s2/favicons?domain=${event.getAttribute('value')}"/>
        <h5>${event.getAttribute('name')}</h5>
        <button onclick="setting.DeleteRss(this)" link="${event.getAttribute('name')}" name='${feedlist.length - 1}'>さくじよ</button>
        </div>`;
    this.ServerCommunication(this.NewPage, 'insert', event.getAttribute('link'), event.getAttribute('name'));
  };

  NewPage(...data){
    console.log(data);
    RSSList.push(new RSS([data[0][0], data[0][1], '#FF9900']));
  };

  DeleteRss(event){
    var number = event.getAttribute('name');
    var link = event.getAttribute('link');

    var pagetitle = document.getElementsByClassName('pagetitle');
    var page = document.getElementsByClassName('page');

    RSSList.splice(number, 1);
    event.parentNode.parentNode.removeChild(event.parentNode);
    pagetitle[number].parentNode.removeChild(pagetitle[number]);
    page[number].parentNode.removeChild(page[number]);

    var main = document.getElementById('main');
    main.style.width = `${RSSList.length * 425}px`;

    var title = document.getElementsByClassName('feedtitle');
    for(var i = 0; i < title.length; i++){
      title[i].lastElementChild.name = i;
    }

    this.ServerCommunication("", 'delet', link);
  }

}
