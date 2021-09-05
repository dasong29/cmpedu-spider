const fs = require('fs')
var moment = require('moment');
moment.locale('zh-CN')
var Crawler = require("crawler");

var regForMp4 = /.*var mp4 = (\[.*\]);.*mp4\.length.*/gms;
var windowsFileNameReg = /[\/\\\*\?\<\>\|\:]/g;
var aria2BaseDir = 'E:/aria2Data/'
var accessLog = './aria2/access.log'

var c = new Crawler({
    maxConnections : 10,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            var resourceTitle = $('p.title').first().text().trim();
            var scriptText = $('script').text();
            var comment = '# ' + moment().format('MMMM Do YYYY, h:mm:ss a') + ' ' + resourceTitle + ' ' + res.options.uri + '\n';
            var aria2File = './aria2/aria2-cmpedu-'+ res.options.cmpPid + '-' + resourceTitle.replace(windowsFileNameReg, ' ') +'.txt';
            fs.writeFileSync(accessLog, comment, { flag: 'a+' }, err => {})

            // 获取 Mp4
            var mp4JsonStr =scriptText.replace(regForMp4, '$1');
            if (!!mp4JsonStr && mp4JsonStr.length>2) {
                var mp4Json = JSON.parse(mp4JsonStr);
                try {fs.unlinkSync(aria2File)} catch {};
                fs.writeFileSync(aria2File, comment, { flag: 'a+' }, err => {})
                for(var i=0;i<mp4Json.length;i++){
                    var videoInfo = mp4Json[i].objectUrl;
                    videoInfo += "\n";
                    videoInfo += '\t'+'out=' + mp4Json[i].itemName + '.mp4';
                    videoInfo += "\n";
                    videoInfo += '\t'+'dir=' + aria2BaseDir + resourceTitle.replace(windowsFileNameReg, ' ');
                    videoInfo += "\n";
                    fs.writeFile(aria2File, videoInfo, { flag: 'a+' }, err => {})
                }

            }


        }
        done();
    }
});

try {fs.unlinkSync(accessLog)} catch {};

var start = 1165;
var len = 1;
for (let index = 0; index < len; index++) {
    var pid = start + index;
    c.queue({uri:'http://qr.cmpedu.com/CmpBookResource/show_project.do?pid='+pid,
        cmpPid:pid
    });
}

