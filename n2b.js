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
function contentEval(name,source) {
  if(!name)source = '(' + source + ')();'
  source=source.toString().replace("function","function "+name);
  var script = document.createElement('script');
  script.setAttribute("type", "application/javascript");
  script.textContent = source;
  document.body.appendChild(script);
}
  
$.getScript("http://twitter.github.io/hogan.js/builds/3.0.1/hogan-3.0.1.min.js");

  contentEval("onclickX",function(event){
    var a=event.target;
    document.title=a.innerText;
    $.get(location.href+"dat/"+a.getAttribute("data")+".dat",{},function(data){
      var x=data.split("\n").map(function(x,i){
        var s= x.split("<>");
        if(!s[3]){return null;}
        return {i:i+1,name:s[0],mail:s[1],ids:s[2],body:s[3].replace("<br>","\n")};
      });
      x.pop();
      var tmp = '{{#cs}}'+
    '<div class="res">'+
        '<span class="resnum">{{i}}</span>'+
        '<span class="name">{{name}}</span>'+
        '<span class="mail">{{mail}}</span>'+
        '<div class="ids">{{ids}}</div>'+
        '<div class="body">{{{body}}}</div>'+
    '</div>{{/cs}}';
      var html = Hogan.compile(tmp).render({cs:x});
      $("#nb").html(html);
    });
  });

  var b = [];
  var eachFunc=function(index, ele) {
    if(index==0)return;
    ele=$(ele);
    var a = ele.children("td:first").children("a");
    var dat = a.attr("href").match(/\/([0-9]+)/)[1];
    a.attr("data",dat);
    a.attr("href","javascript:void(0)");
    b.push([a.text(),
            ele.children("td:nth-child(2)").text(),
           dat]);
  };
  $("table#threads>tbody>tr").each(eachFunc);
  $("table#threads>tbody>tr>td").css({"max-width":"300px"});
  $("table#threads").css({width:"35%",float:"left"});
  var main = $("<div id='nb'></div>");
  main.insertBefore("table#threads");
  main.css({float:"right","max-width":"60%"});
  var c = $("<div></div>");
  c.insertAfter("table#threads");
  c.css({clear:"both"});
  var last=window.localStorage.getItem(location.href);
  window.localStorage.setItem(location.href,JSON.stringify(b));

contentEval("",function(){
  $("table#threads>tbody>tr").each(function(i,e){
    if(i==0)return;var ele=$(e);
    var a = ele.children("td:first").children("a");
    a.get(0).addEventListener("click",onclickX,true);});
});
}catch(e){console.log(e);}
