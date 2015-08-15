var http=require("http"),
    request = require('request'),
    htmlparser2 = require('htmlparser2'),
    iconvlite = require('iconv-lite'),
    fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio');

//相册首页
var href_index = request.get({url:'http://db.house.qq.com/cd_107891/',encoding:null},function(error,response,body){
    if(!error && response.statusCode==200){
        var charset="utf-8";
        var data = iconvlite.decode(body, charset);
        $ = cheerio.load(data);
        var $a = $('#G1pic1').find('a')[0];
        var href=$a.attribs['href'];
        if(href!=null||href!=""){
            var dataStore = innerFun(href);
        }else{
            return false;
        }
    }
});

//相册列表页面
function innerFun(hf){
   request.get({url:hf,encoding:null},function(error,response,body){
        if(!error && response.statusCode==200){
            var charset="gbk";
            var data = iconvlite.decode(body, charset);
            $ = cheerio.load(data);
            $cnt_list = $('#content').find('.apartment');
            var lg =  $cnt_list.length;
            var dataStore = new Array();
            for(var i=0;i<lg;i++){
                var dataInner = [];
                var txt = $($cnt_list[i]).find('.fl').eq(0).text();
                var start = txt.indexOf('（');
                txt = txt.substring(0,start);
                var hrefimg =  $($cnt_list[i]).find('.bd').find('a')[0].attribs['href'];
                dataInner.push(txt);
                dataInner.push(hrefimg);
                dataStore.push(dataInner);
            }
            if(dataStore != undefined){
                datafun(dataStore);
            }
        }
   });
}
//
function datafun(data){
    var datalength = data.length;
    for(var i=0; i<datalength;++i){
        var path = path+data[i][0]
      //  mkdir(path);
      var filename = data[i][0];
      mkdir('pic/'+filename);
      imgPage(data[i]);
    }
}

//创建文件夹  和路径
function mkdir(dirpath,dirname){ 
    if(typeof dirname === "undefined"){   
        if(fs.existsSync(dirpath)){  
            return;  
        }else{  
            mkdir(dirpath,path.dirname(dirpath)); 
        }  
    }else{  
        if(dirname !== path.dirname(dirpath)){   
            mkdir(dirpath);  
            return;  
        }  
        if(fs.existsSync(dirname)){  
            fs.mkdirSync(dirpath)  
        }else{  
            mkdir(dirname,path.dirname(dirname));  
            fs.mkdirSync(dirpath); 
        }  
    }  
} 

//相册大图页面
function imgPage(data){
    var uri = 'http://photo.house.qq.com/'+data[1];
    request.get({url:uri,encoding:null},function(error,response,body){
        if(!error && response.statusCode==200){
             var charset="gbk";
            var data = iconvlite.decode(body, charset);
            $ = cheerio.load(data);
            var $img = $('.picTd').find('#PicSrc');
           // var uri=$img.attr['src'];
            console.log(data);
        }
    }); 

}