'use strict';

var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Menu = electron.Menu;

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  createWindow();
  setAppMenu();
});

function setAppMenu(){
  const template = [
    {
      label: "ふあいる",  //label...メニューの表示名をいじれる
      submenu: [ // 項目をいじれる。
        // accelerator... ショートカットキーを設定できる
        // click ... クリック時実行する関数を設定できる
        { label: "あたらしいういんどう", accelerator: "CmdOrCtrl+N", click: createWindow },
        { type: "separator" },  // type... メニューの種別。separatorで仕切り線が出来たりする
        { label: "とじる", accelerator: "CmdOrCtrl+Q", role: "close"} //このロールには様々な一般的な常用機能が提供されている
      ]
    },
    {
      label: "そうさ",
      submenu: [
        { label: "こぴい", accelerator: "CmdOrCtrl+C", role: "copy"},
        { label: "ぺえすと", accelerator: "CmdOrCtrl+V", role: "paste"},
        { label: "かつと", accelerator: "CmdOrCtrl+X", role: "cut"},
        { label: "ぜんせんたく", accelerator: "CmdOrCtrl+A", role: "selectall"}
      ]
    },
    {
      label: "びいう",
      submenu: [
        {
          label: "りろおど",
          accelerator: "CmdOrCtrl+R",
          click: (item, focusedWindow) => focusedWindow && focusedWindow.reload()
        },
        {
          label: "でべろつぱあつうる",
          accelerator: process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          click: (item, focusedWindow) => focusedWindow && focusedWindow.toggleDevTools()
        },
        {type: 'separator'},
        {
          label: "ずうむいん",
          accelerator:"CmdOrCtrl+K",
          role:'zoomin'
        },
        {
          label: "ずうむあうと",
          accelerator:"CmdOrCtrl+L",
          role:'zoomout'
        }
      ]
    }
  ];

  //mac用
  if(process.platform === "darwin"){
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: "あばうと", role: "about"}, //roleでもここらはMac限定の機能達
        { type: "separator"},
        { label: "さあびす", role: "services", submenu: []},
        { type: "separator"},
        { label: "らべる",role: "hide"},
        { label: "はいどあざあず",role: "hideothers"},
        { label:"あんはいど", role: "unhide"},
        { type: "separator"},
        { label: "くいと",role: "quit"}
      ]
    });

    template.push({
      role: "window",
      submenu: [
        { role: "minimize"},
        { role: "zoom"}
      ]
    });
  }
  const appMenu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(appMenu);
}

function createWindow(){
  // ブラウザ(Chromium)の起動, 初期画面のロード
  mainWindow = new BrowserWindow({width: 800, height: 600});
  mainWindow.maximize();
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}
