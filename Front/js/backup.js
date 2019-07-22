var flag = true;
var feedlist = new Array;

window.onload = function() {
  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
  if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        list(JSON.parse(req.responseText));
      }
    }else{
    //  result.innerHTML = "通信中..."
  }
  };
  req.open('GET', 'https://akgalaxy-rss-reader.herokuapp.com/uho', true);
  req.send(null);
};

function list(text){
  console.log(text);
  var uho = document.getElementsByClassName('come');
  ElementSet(text.length);
  for(var p = 0; p < text.length; p++){
    var tex = text[p];
    console.log(Object.keys(tex).length);

    for(var i = 0; i < Object.keys(tex).length; i++){
      var kizi = document.createElement('div');
      kizi.setAttribute('class', 'container');
      kizi.setAttribute('name', tex[i].link);
      kizi.setAttribute('onclick', 'OpenModal(80, this)');
      kizi.innerHTML += tex[i].image? tex[i].image[0]: `<img src="http://eventsnews.info/wp-content/uploads/2015/12/gazou03318.jpg" />`;
      kizi.innerHTML += `<h3>${tex[i].title}</h3>`;
      var uhp = new Date(tex[i].day);
      console.log(uhp);
      kizi.innerHTML += `<h4>${uhp.getFullYear()}年${uhp.getMonth() + 1}月${uhp.getDate() + 1}日 ${uhp.getHours()}:${uhp.getMinutes() < 10 ? "0" + uhp.getMinutes() : uhp.getMinutes()}</h4>`;

      uho[p].appendChild(kizi);
      uho[p].innerHTML += '<hr>';
    }
  }

  var req = new XMLHttpRequest();

    req.onreadystatechange = function() {
    if (req.readyState == 4) { // 通信の完了時
        if (req.status == 200) { // 通信の成功時
          title(JSON.parse(req.responseText));
        }
      }else{
      //  result.innerHTML = "通信中..."
    }
    };
    req.open('GET', 'https://akgalaxy-rss-reader.herokuapp.com/uhi', true);
    req.send(null);
}

function title(text){
  console.log(text);
  var title = document.getElementsByClassName('title');
  var page = document.getElementsByClassName('page');
  var sort = document.getElementById('sort');
  for(var i = 0; i < text.length; i++){
    feedlist.push({});
    title[i].innerHTML = text[i][0];
    feedlist[i].title = text[i][0];
    feedlist[i].link = text[i][1];
    feedlist[i].color = text[i][2];

    page[i].style.backgroundColor = text[i][2];
    sort.innerHTML += `
    <div class="pagetitle" onclick='OpenModal(80, this)' name='${text[i][1]}'>
      <img src="https://www.google.com/s2/favicons?domain=${text[i][1]}"/>
      <h5>${text[i][0]}</h5>
    </div>
    `;
  }
  var main = document.getElementById('main');
  main.style.width = `${feedlist.length * 425}px`;
}

function ElementSet(val){
  var element = `
    <div class="page">
        <header class="title">Title</header>
        <div class="come"></div>
    </div>
  `;

  var main = document.getElementById('main');
  for(var i = 0; i < val; i++)main.innerHTML += element;
}

function visible(){
  var right = document.getElementById('right');
  close(right, 80);
}

function close(right, position){
  if(position <= 0){
    document.getElementById('main').style.overflow = 'scroll';
    document.getElementById('modal').style.visibility = 'hidden';
    if(document.getElementById("uho"))document.getElementById("uho").remove();
    if(document.getElementById("feedsetting"))document.getElementById("feedsetting").remove();
    flag = true;
    return;
  }

  right.style.right = `${position - 80}%`;

  setTimeout(() => {close(right, position - 2)}, 5);
}

function pageRender(event){
  console.log(event.getAttribute('name'));
  var right = document.getElementById('right');

  var kizi = document.createElement('iframe');
  kizi.setAttribute('src', `${event.getAttribute('name')}`);
  kizi.setAttribute('id', 'uho');
  kizi.setAttribute('onload', "ReRender()");

  right.appendChild(kizi);

  setTimeout(()=>{flag = false;}, 400);
}

function ReRender(){
  if(flag){
    console.log(document.getElementById('uho').src);
    var url = document.getElementById('uho').src;
    document.getElementById("uho").remove();

    var right = document.getElementById('right');

    var kizi = document.createElement('iframe');
    kizi.setAttribute('src', `https://akgalaxy-rss-reader.herokuapp.com/uhu?url=${url}`);
    kizi.setAttribute('id', 'uho');
    right.appendChild(kizi);
  }
}


function OpenModal(position, event){
  var right = document.getElementById('right');
  if(position >= 75){
    document.getElementById('modal').style.visibility = 'visible';
  }
  if(position <= 0){
    pageRender(event);
    document.getElementById('main').style.overflow = 'hidden';
    return;
  }

  right.style.right = `-${position}%`;
  setTimeout(() => {OpenModal(position - 2, event)}, 5);
}

function OpenModalSetting(position, fn){
  var right = document.getElementById('right');
  if(position >= 75){
    document.getElementById('modal').style.visibility = 'visible';
  }
  if(position <= 0){
    fn();
    document.getElementById('main').style.overflow = 'hidden';
    return;
  }

  right.style.right = `-${position}%`;
  setTimeout(() => {OpenModalSetting(position - 2, fn)}, 5);
}

function feedSetting(){
  document.getElementById('right').innerHTML += `
  <div id="feedsetting">
    <h3>ふいいどついか</h3>
    <div class='search'>
      <img src="search.png"/>
      <input type="text" id="searchtext" placeholder="しうとくしたいぺえじをにうりよく"/>
    </div>
    <button id="searchbutton" onclick="search()">けんさく</button>
    <div id="total"></div>
    <div id='feedlist' style="margin: 50px 0 0 100px; width:80%;"></div>
  </div>`;

  var title = document.getElementsByClassName('title');
  var sort = document.getElementById('feedlist');
  sort.innerHTML = `<p style="font-size:2vw; font-weight:bold; font-style:italic; color:rgba(0, 0, 0, 1); margin:0 0 20px 0;">ふいいどたち</p>`;

  for(var i = 0; i < feedlist.length; i++){
    sort.innerHTML += `
    <div class="feedtitle">
      <img src="https://www.google.com/s2/favicons?domain=${feedlist[i].link}"/>
      <h5>${feedlist[i].title}</h5>
      <button onclick="deleteing(this)" link="${feedlist[i].title}" name='${i}'>さくじよ</button>
    </div>
    `;
  }
}

function colorSetting(){
  document.getElementById('right').innerHTML += `
  <div id="feedsetting" style="height:100%">
    <p style="font-size:2vw; font-weight:bold; font-style:italic; color:rgba(0, 0, 0, 1); margin:0 0 20px 100px;">からあせんたく</p>
    <div id='feedlist' style="margin: 0 0 0 100px; width:80%; height:80%; overflow:scroll"></div>
  </div>`;

  var title = document.getElementsByClassName('title');
  var sort = document.getElementById('feedlist');

  for(var i = 0; i < feedlist.length; i++){
    sort.innerHTML += `
    <div class="colortitle">
      <img src="https://www.google.com/s2/favicons?domain=${feedlist[i].link}"/>
      <h5>${feedlist[i].title}</h5>
      <div class='examcolor' style='background-color:${feedlist[i].color}'></div>
      <button link="${feedlist[i].title}" onclick="colorsend(this)" name='${i}'>てきおう</button>
      <div class='colorset'>
        <img src="search.png"/>
        <input type="text" class="colorinput" name='${i}' onchange="colorset(this)" placeholder="つかいたいからあをせんたく"/>
      </div>
    </div>
    `;
  }
}

function colorset(event){
  var title = document.getElementsByClassName('examcolor');
  var number = event.getAttribute('name');

  title[number].style.backgroundColor = event.value;
}

function colorsend(event){
  var title = document.getElementsByClassName('examcolor');
  var text = document.getElementsByClassName('colorinput');
  var page = document.getElementsByClassName('page');
  var number = event.getAttribute('name');
  var checkword = text[number].value;
  text[number].value = "";
  if(!(/^#[0-9a-f]{6}/i.test(checkword)) || checkword.length > 7){
    alert("送信できないカラーコード");
    return;
  }

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        page[number].style.backgroundColor = checkword;
      }
    }else{
      //  result.innerHTML = "通信中..."
    }
  };

  req.open('GET', `https://akgalaxy-rss-reader.herokuapp.com/colorupdate?color=${encodeURIComponent(checkword)}&number=${number}`, true);
  req.send(null);


}

function search(){
  var text = document.getElementById('searchtext').value;

  document.getElementById('searchtext').value = "";

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() {
    if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        TotalVisible(JSON.parse(req.responseText), text);
      }else{
        var total = document.getElementById('total');
        total.innerHTML += `<div></div>`;
        total.innerHTML += `<h3>送信エラー</h3>`;
      }
    }else{
      //  result.innerHTML = "通信中..."
    }
  };

  req.open('GET', `https://akgalaxy-rss-reader.herokuapp.com/rsscheck?check=${text}`, true);
  req.send(null);
}

function TotalVisible(text, url){
  var infotext = text[0].info.match(/content=\"(((\\\\\")|[^\"])*)\"/);
  var linktext = text[0].link.match(/href=\"(((\\\\\")|[^\"])*)\"/);
  var titletext = text[0].title.match(/>(.*?)</);
  console.log(titletext);
  var total = document.getElementById('total');
  total.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${url}" />`;
  total.innerHTML += `<h3>${titletext[1]}</h3>`;
  total.innerHTML += `<button id="insertbutton" onclick='insert(this)' link="${linktext[1]}" name="${titletext[1]}" value="${url}">追加</button>`;
  total.innerHTML += `<h4>${infotext[1]}</h4>`;
}

function insert(event){
  console.log(event);
  var sort = document.getElementById('feedlist');
  var feedsort = document.getElementById('sort');

  feedlist.push({link:event.getAttribute('value'), title: event.getAttribute('name')});
  sort.innerHTML += `
    <div class="feedtitle">
      <img src="https://www.google.com/s2/favicons?domain=${event.getAttribute('value')}"/>
      <h5>${event.getAttribute('name')}</h5>
      <button onclick="deleteing(this)" link="${event.getAttribute('name')}" name='${feedlist.length - 1}'>さくじよ</button>
      </div>`;

  feedsort.innerHTML += `
    <div class="pagetitle" onclick='OpenModal(80, this)' name='${event.getAttribute('value')}'>
      <img src="https://www.google.com/s2/favicons?domain=${event.getAttribute('value')}"/>
      <h5>${event.getAttribute('name')}</h5>
    </div>`;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        var data = JSON.parse(req.responseText);
        var tex = data[0];

        var element = `
          <div class="page">
              <header class="title">Title</header>
              <div class="come"></div>
          </div>
        `;

        var main = document.getElementById('main');
        main.innerHTML += element;
        main.style.width = `${feedlist.length * 425}px`;

        var title = document.getElementsByClassName('title');
        var page = document.getElementsByClassName('come');
        title[feedlist.length - 1].innerHTML = data[1][0];

        for(var i = 0; i < Object.keys(tex).length; i++){
          var kizi = document.createElement('div');
          kizi.setAttribute('class', 'container');
          kizi.setAttribute('name', tex[i].link);
          kizi.setAttribute('onclick', 'OpenModal(80, this)');
          kizi.innerHTML += tex[i].image? tex[i].image[0]: `<img src="http://eventsnews.info/wp-content/uploads/2015/12/gazou03318.jpg" />`;
          kizi.innerHTML += `<h3>${tex[i].title}</h3>`;
          var uhp = new Date(tex[i].day);
          console.log(uhp);
          kizi.innerHTML += `<h4>${uhp.getFullYear()}年${uhp.getMonth() + 1}月${uhp.getDate() + 1}日 ${uhp.getHours()}:${uhp.getMinutes() < 10 ? "0" + uhp.getMinutes() : uhp.getMinutes()}</h4>`;

          page[page.length - 1].appendChild(kizi);
          page[page.length - 1].innerHTML += '<hr>';
        }
      }
    }else{
      //  result.innerHTML = "通信中..."
    }
  };

  req.open('GET', `https://akgalaxy-rss-reader.herokuapp.com/insert?link=${event.getAttribute('link')}`, true);
  req.send(null);
}

function deleteing(event){
  var number = event.getAttribute('name');
  var link = event.getAttribute('link');

  var pagetitle = document.getElementsByClassName('pagetitle');
  var page = document.getElementsByClassName('page');

  console.log(number);
  feedlist.splice(number, 1);
  event.parentNode.parentNode.removeChild(event.parentNode);
  pagetitle[number].parentNode.removeChild(pagetitle[number]);
  page[number].parentNode.removeChild(page[number]);

  var title = document.getElementsByClassName('feedtitle');
  for(var i = 0; i < title.length; i++){
    title[i].lastElementChild.name = i;
  }

  var main = document.getElementById('main');
  main.style.width = `${feedlist.length * 425}px`;

  var req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) { // 通信の完了時
      if (req.status == 200) { // 通信の成功時
        console.log('ok');
      }
    }else{
      //  result.innerHTML = "通信中..."
    }
  };

  req.open('GET', `https://akgalaxy-rss-reader.herokuapp.com/delet?link=${link}`, true);
  req.send(null);
};
