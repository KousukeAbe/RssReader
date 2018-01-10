class Page {
  constructor(data){
    document.getElementById('modal').style.visibility = 'visible';
    this.position = 80;
    this.flag = true;
    this.PageOpen();
  };

  PageOpen(){
    var right = document.getElementById('right');
    if(this.position >= 75){
      document.getElementById('modal').style.visibility = 'visible';
    }
    if(this.position <= -4){
    //  fn();
      document.getElementById('main').style.overflow = 'hidden';
      return;
    }

    right.style.right = `-${this.position}%`;
    this.position -= 2;
    setTimeout(() => {this.PageOpen()}, 5);
  };

  PageClose(page){
    var right = document.getElementById('right');
    if(this.position <= -80){
      document.getElementById('modal').style.visibility = 'hidden';
      if(document.getElementById("uho"))document.getElementById("uho").remove();
      if(document.getElementById("feedsetting"))document.getElementById("feedsetting").remove();
      if(document.getElementById("colorsetting"))document.getElementById("colorsetting").remove();
      return;
    }

    this.position -= 2;
    right.style.right = `${this.position}%`;
    setTimeout(() => {page.PageClose(page)}, 5);
  };

  ArticleRender(link){
    var right = document.getElementById('right');
    var kizi = document.createElement('iframe');
    kizi.setAttribute('src', link);
    kizi.setAttribute('id', 'uho');
    kizi.setAttribute('onload', "page.ArticleReRender()");

    right.appendChild(kizi);

    setTimeout(()=>{this.flag = false;}, 500);
  };

  ArticleReRender(){
    if(!this.flag)return;
    console.log("uho" + this.flag);
    var url = document.getElementById('uho').src;
    document.getElementById("uho").remove();
    var right = document.getElementById('right');
    var kizi = document.createElement('iframe');
    kizi.setAttribute('src', `鯖のURLuhu?url=${url}`);
    kizi.setAttribute('id', 'uho');
    right.appendChild(kizi);
  };
};
