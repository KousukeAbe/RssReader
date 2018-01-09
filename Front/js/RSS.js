class RSS {
  constructor(data){
    this.title = data[0];
    this.url = data[1];
    this.color = data[2];

    this.LeftListUp();
    this.ServerCommunication(this.RightListUp, 'GetArticle');
  };

  LeftListUp(){
    document.getElementById('sort').innerHTML += `
    <div class="pagetitle" onclick='OpenArticle(this)' name='${this.url}'>
      <img src="https://www.google.com/s2/favicons?domain=${this.url}"/>
      <h5>${this.title}</h5>
    </div>
    `;
  };

  RightListUp(data, rss){
    console.log(data[0]);
    var element = document.createElement('div');
    element.setAttribute('class', 'page');
    element.innerHTML = `<header class="title">${rss.title}</header>`;
    element.style.backgroundColor = rss.color;
    var come = document.createElement('div');
    come.setAttribute('class', 'come');
    element.appendChild(come);

    for(var i = 0; i < data[0].length; i++){
      var kizi = document.createElement('div');
      kizi.setAttribute('class', 'container');
      kizi.setAttribute('name', data[0][i].link);
      kizi.setAttribute('onclick', 'OpenArticle(this)');
      kizi.innerHTML += data[0][i].image ? data[0][i].image[0]: `<img src="http://eventsnews.info/wp-content/uploads/2015/12/gazou03318.jpg" />`;
      kizi.innerHTML += `<h3>${data[0][i].title}</h3>`;
      var uhp = new Date(data[0][i].day);
      kizi.innerHTML += `<h4>${uhp.getFullYear()}年${uhp.getMonth() + 1}月${uhp.getDate() + 1}日 ${uhp.getHours()}:${uhp.getMinutes() < 10 ? "0" + uhp.getMinutes() : uhp.getMinutes()}</h4>`;
      come.appendChild(kizi);
      come.innerHTML += '<hr>';
    }
    var main = document.getElementById('main');
    main.appendChild(element);
    main.style.width = `${RSSList.length * 425}px`;
  };

  ServerCommunication(fn, query){
    var req = new XMLHttpRequest();
    var rss = this;
    req.onreadystatechange = function(){
      if(req.readyState == 4) { // 通信の完了時
        if(req.status == 200) { // 通信の成功時
          console.log(req.responseText);
          fn(JSON.parse(req.responseText), rss);
        }
      }else{
        //  result.innerHTML = "通信中..."
      }
    };
    req.open('GET', `https://akgalaxy-rss-reader.herokuapp.com/${query}?title=${this.title}`, true);
    req.send(null);
  }

  GetList(){
    return {title: this.title, url: this.url, color: this.color};
  }
}
