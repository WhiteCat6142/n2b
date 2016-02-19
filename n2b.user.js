// ==UserScript==
// @name        ネッブラ
// @namespace   n2b
// @description next産専ブラ
// @include     /http://next2ch.net/[^/]+/\D*$/
// @version     0
// @grant       none
// @require     http://twitter.github.io/hogan.js/builds/3.0.1/hogan-3.0.1.min.js
// @author      WhiteCat6142
// ==/UserScript==
try {
  var css = document.createElement('style');
  css.setAttribute('type', 'text/css');
  css.textContent = '' +
  'table#threads>tbody>tr>td{max-width:250px;}' +
  'tr > :nth-child(3) {display: none;}' +
  '.pop{position: absolute;background-color: lightgray;padding:6px;color:black;}' +
  '#nb{overflow: auto;height:550px;}' +
  '.nb2{overflow: auto;height:550px;margin-left: -20px;}' +
  '#nb > .res > .body > span{color:blue;padding:10px;}' +
  '#nb > .res > .body img{max-width: 300px;max-height: 300px;}' +
  '.container>form{display:none;}.container>h3{display:none;}footer hr{display:none;}';
  document.head.appendChild(css);
  var table = $('table#threads');
  var tr = $('table#threads>tbody>tr');
  table.before('<div id=\'nb\' class=\'pull-right span7\'></div>');
  table.after('<div class=\'nb2 pull-left span4\'></div>');
  table.appendTo('.nb2');
  $('.title').after('<a class=\'pull-right\' onclick="localStorage.clear()">reset</a>');
  var list = JSON.parse(window.localStorage.getItem(location.href) || '{}');
  var ng = JSON.parse(window.localStorage.getItem('ngid') || '[]');
  var ngw = JSON.parse(window.localStorage.getItem('ngw') || '[]');
  var eachFunc = function (index, ele) {
    if (index == 0) return;
    ele = $(ele);
    var children = ele.children();
    if (ng.indexOf(children.eq(2).text()) != - 1) {
      ele.hide();
      return;
    }
    var a = children.eq(0).children('a');
    var text = a.text();
    for (var i = 0; i < ngw.length; i++) {
      if (text.match(ngw[i])) {
        ele.hide();
        return;
      }
    }
    var dat = a.attr('href').match(/\/([0-9]+)/) [1];
    var num = children.eq(1).text() | 0;
    a.attr('data', dat);
    a.attr('href', 'javascript:void(0)');
    if (list[dat]) {
      var p = (num - list[dat][1]);
      if (p > 0) {
        a.css({
          'font-weight': 'bold'
        });
        ele.css({
          color: 'orangered'
        });
        children.eq(1).append('<span>(+' + p + ')</span>');
      } else {
        a.css({
          color: 'gray'
        });
      }
    }
  };
  tr.each(eachFunc);
  if (!String.fromCodePoint) {
    /*!
    * ES6 Unicode Shims 0.1
    * (c) 2012 Steven Levithan <http://slevithan.com/>
    * MIT License
    */
    String.fromCodePoint = function fromCodePoint() {
      var chars = [
      ],
      point,
      offset,
      units,
      i;
      for (i = 0; i < arguments.length; ++i) {
        point = arguments[i];
        offset = point - 65536;
        units = point > 65535 ? [
          55296 + (offset >> 10),
          56320 + (offset & 1023)
        ] : [
          point
        ];
        chars.push(String.fromCharCode.apply(null, units));
      }
      return chars.join('');
    }
  }
  var tmp = '{{#cs}}' +
  '<div class="res" id="res-{{i}}">' +
  '<span class="resnum">{{i}}</span>' +
  '<span class="name">{{name}}</span>' +
  '{{#mail}}<span class="mail">[{{mail}}]</span>{{/mail}}' +
  '<span class="date">{{date}}</span>' +
  '<div class="id">{{id}}</div>' +
  '<div class="body">{{{body}}}</div>' +
  '</div>{{/cs}}';
  var tmpl = Hogan.compile(tmp);
  var form = '<form class="form-horizontal" method="post" action="http://next2ch.net/test/bbs.cgi?guid=ON" accept-charset="Shift_JIS">' +
  '<div class="controls">' +
  '<input id="inputName" name="FROM" placeholder="名前（省略可）" type="text">' +
  '</div>' +
  '<div class="controls">' +
  '<input id="inputEmail" name="mail" placeholder="E-mail（省略可）" type="text">' +
  '</div>' +
  '<div class="control-group">' +
  '<div class="controls">' +
  '<textarea name="MESSAGE"></textarea>' +
  '</div>' +
  '</div>' +
  '<div class="control-group">' +
  '<div class="controls">' +
  '<input class="btn" value="投稿" type="submit">' +
  '</div>' +
  '</div>' +
  '<input name="suka" value="pontan" type="hidden">' +
  '<input name="time" value="1" type="hidden">' +
  '<input name="bbs" value="{{bbs}}" type="hidden">' +
  '<input name="key" value="{{dat}}" type="hidden">' +
  '</form>';
  var post = Hogan.compile(form);
  var showPop = function (a) {
    var id = this.innerText.substr(2);
    var x = id.split(',');
    var content = '';
    x.forEach(function (e) {
      if (e.indexOf('-') == - 1) content += $('#nb > #res-' + e).html() || 'あぼーん';
       else {
        var xs = e.split('-');
        for (var i = xs[0] | 0; i <= xs[1] | 0; i++) {
          content += $('#nb > #res-' + i).html() || 'あぼーん';
        }
      }
    });
    $(this).append('<div class=\'pop\'>' + content + '</div>');
  };
  var hidePop = function (a) {
    $('.pop').fadeOut('normal');
  };
  var th = 300;
  var unveil = function () {
    var n = document.getElementsByClassName('lazy');
    var len = n.length;
    if (len == 0) {
      return;
    }
    var wh = screen.height + th;
    for (var i = 0; i < len; i++) {
      var bound = n[i].getBoundingClientRect();
      if (bound.top > wh || bound.bottom < 0 - th) continue;
      var ele = n[i];
      ele.setAttribute('src', ele.getAttribute('data-src'));
      ele.removeAttribute('data-src');
      ele.removeAttribute('class');
      i--;
      len--;
    }
  }
  var timer = null;
  var listen = function () {
    clearTimeout(timer);
    timer = setTimeout(unveil, 200);
  }
  window.addEventListener('resize', listen);
  $('#nb').get(0).addEventListener('scroll', listen);
  var conv = function (s) {
    var body = s;
    var b1 = body.match(/&gt;&gt;[\d,-]+/g);
    if (b1) {
      b1.forEach(function (ele) {
        body = body.replace(ele, '<span>' + ele + '</span>');
      });
    }
    var b2 = body.match(/&amp;#\d+;/g);
    if (b2) {
      b2.forEach(function (ele) {
        var x = ele.slice(6, - 1) | 0;
        body = body.replace(ele, String.fromCodePoint(x));
      });
    }
    var b3 = body.match(/h?ttps?:\/\/[0-9-_a-zA-Z.\/!#$&+,:;=@~\[\]\?]+/g);
    if (b3) {
      b3.forEach(function (ele) {
        var link = (ele[0] == 'h') ? ele : 'h' + ele;
        if (link.substr( - 4).match(/\.((jpg)|(png)|(gif))/)) body = body.replace(ele, '<img class="lazy" data-src="' + link + '">');
         else body = body.replace(ele, '<a href="' + link + '">' + ele + '</a>');
      });
    }
    return body;
  }
  var nb = $('#nb');
  var onclickX = function (event) {
    var a = event.target;
    if (a.tagName == 'TD') a = a.children[0];
    document.title = a.innerText;
    var dat = a.getAttribute('data');
    $.get(location.href + 'dat/' + dat + '.dat', {
    }, function (data) {
      var x = [
      ];
      var arr = data.split('\n');
      arr.pop();
      var len = arr.length;
      var td = a.parentElement.parentElement;
      td.children[1].innerHTML = len.toString();
      td.setAttribute('style', null);
      a.setAttribute('style', 'color:gray;');
      arr.forEach(function (ele, i) {
        var s = ele.split('<>');
        if (!s[3]) {
          return;
        }
        var ids = s[2].split(' ID:');
        if (ng.indexOf(ids[1]) != - 1) return;
        for (var j = 0; j < ngw.length; j++) {
          if (s[3].match(ngw[j])) return;
        }
        x.push({
          i: i + 1,
          name: s[0],
          mail: s[1],
          date: ids[0],
          id: ids[1],
          body: conv(s[3])
        });
      });
      var bbs = location.href.match(/next2ch\.net\/([^\/]+)\//) [1];
      nb.html(tmpl.render({
        cs: x
      }) + post.render({
        bbs: bbs,
        dat: dat
      }));
      var sp = $('#nb .body span');
      sp.mouseover(showPop);
      sp.mouseout(hidePop);
      listen();
      if (list[dat]) {
        var d = list[dat];
        var p = $('#res-' + d[1]).offset().top - $('#res-1').offset().top + 12;
        nb.scrollTop(p);
      } else {
        nb.scrollTop(0);
      }
      list[dat] = [
        a.innerText,
        len
      ];
      localStorage[location.href] = JSON.stringify(list);
    });
  };
  tr.children('td:nth-child(1)').click(onclickX);
} catch (e) {
  console.log(e);
}
