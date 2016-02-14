// ==UserScript==
// @name        ネッブラ
// @namespace   n2b
// @description next産専ブラ
// @include     http://next2ch.net/*
// @version     0
// @grant       none
// @require     
// @author      WhiteCat6142
// ==/UserScript==

try{
  
function contentEval(source) {
  source = '(' + source + ')();'
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;
  document.body.appendChild(script);
}
  
    if (!String.fromCodePoint) {
    /*!
    * ES6 Unicode Shims 0.1
    * (c) 2012 Steven Levithan <http://slevithan.com/>
    * MIT License
    */
    String.fromCodePoint = function fromCodePoint () {
        var chars = [], point, offset, units, i;
        for (i = 0; i < arguments.length; ++i) {
            point = arguments[i];
            offset = point - 0x10000;
            units = point > 0xFFFF ? [0xD800 + (offset >> 10), 0xDC00 + (offset & 0x3FF)] : [point];
            chars.push(String.fromCharCode.apply(null, units));
        }
        return chars.join("");
    }
}

$.getScript("http://twitter.github.io/hogan.js/builds/3.0.1/hogan-3.0.1.min.js",function(){
  contentEval(function(){
   var tmp = '{{#cs}}'+
    '<div class="res">'+
        '<span class="resnum">{{i}}</span>'+
        '<span class="name">{{name}}</span>'+
        '<span class="mail">{{mail}}</span>'+
        '<div class="ids">{{ids}}</div>'+
        '<div class="body">{{{body}}}</div>'+
    '</div>{{/cs}}';
    var tmpl = Hogan.compile(tmp);
  var onclickX = function(event){
    var a=event.target;
    document.title=a.innerText;
    $.get(location.href+"dat/"+a.getAttribute("data")+".dat",{},function(data){
      var x=data.split("\n").map(function(x,i){
        var s= x.split("<>");
        if(!s[3]){return null;}
        var body = s[3].replace("<br>","\n");
        /*var b1 = body.match(/&gt;&gt;\d+/g);
            if(b1){
                b1.forEach(function(ele){
                    body=body.replace(ele,"&gt;&gt;"+index);
                });
            }
            */
       var b2 = body.match(/&amp;#\d+;/g);
            if(b2){
                b2.forEach(function(ele){
                  var x = ele.slice(6,-1)|0;
                    body=body.replace(ele,String.fromCodePoint(x));
                });
            }
        //
        //>>1
        //
        return {i:i+1,name:s[0],mail:s[1],ids:s[2],body:body};
      });
      x.pop();
      $("#nb").html(tmpl.render({cs:x}));
      //window.localStorage.setItem(location.href,JSON.stringify(b));
    });
  };
  $("table#threads>tbody>tr").each(function(i,e){
    if(i==0)return;
    var a = e.children[0].children[0];
    a.addEventListener("click",onclickX,true);
  });
  //onclickX.list=window.localStorage.getItem(location.href);
});
});

  var b = {};
  var list = JSON.parse(window.localStorage.getItem(location.href)|"");
  var eachFunc=function(index, ele) {
    if(index==0)return;
    ele=$(ele);
    var a = ele.children("td:first").children("a");
    var dat = a.attr("href").match(/\/([0-9]+)/)[1];
    var num = ele.children("td:nth-child(2)").text()|0;
    a.attr("data",dat);
    a.attr("href","javascript:void(0)");
    b[dat]=[a.text(),num];
    if(list[dat]){
      a.css({ 'font-weight': 'bold' });
      ele.children("td:nth-child(2)").append("<span>+"+(num-list[dat][1])+"</span>");
    }
  };
  $("table#threads>tbody>tr").each(eachFunc);
  window.localStorage.setItem(location.href,JSON.stringify(b));
  $("table#threads>tbody>tr>td:first").css({"max-width":"300px"});
  $("table#threads").css({width:"35%",float:"left"});
  var main = $("<div id='nb'></div>");
  main.insertBefore("table#threads");
  main.css({float:"right","max-width":"600px"});
  var c = $("<div></div>");
  c.insertAfter("table#threads");
  c.css({clear:"both"});
}catch(e){console.log(e);}
