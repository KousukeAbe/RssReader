class ColorSetting{
  constructor(list){
    document.getElementById('right').innerHTML += `
    <div id="colorsetting">
      <p style="font-size:2vw; font-weight:bold; font-style:italic;  color: rgba(0, 0, 0, 0.50); margin:0 0 20px 100px;">からあせんたく</p>
      <div id='feedlist'></div>
    </div>`;

    var title = document.getElementsByClassName('title');
    var sort = document.getElementById('feedlist');

    for(var i = 0; i < list.length; i++){
      sort.innerHTML += `
      <div class="colortitle">
        <img src="https://www.google.com/s2/favicons?domain=${list[i].url}"/>
        <h5>${list[i].title}</h5>
        <div class='examcolor' style='background-color:${list[i].color}'></div>
        <div id="colorform">
          <div class='colorset'>
            <img src="img/search.png"/>
            <input type="text" class="colorinput" name='${i}' placeholder="つかいたいからあをせんたく"/>
          </div>
          <button link="${list[i].title}" onclick="ColorSet(this)" name='${i}'>てきおう</button>
        </div>
      </div>
      <hr>
      `;
    }
  };

  ColorVisible(event){
    var title = document.getElementsByClassName('examcolor');
    var color = document.getElementsByClassName('colorinput');
    var number = event.getAttribute('name');

    title[number].style.backgroundColor = color[number].value;
  };

  ColorSet(event){
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

    req.open('GET', `鯖のURLcolorupdate?color=${encodeURIComponent(checkword)}&number=${number}`, true);
    req.send(null);
  };
}
