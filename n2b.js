// ==UserScript==
// @name        ネッブラ
// @namespace   n2b
// @description next産専ブラ
// @include     /http://next2ch.net/[^/]+/$/
// @version     0
// @grant       none
// @require     
// @author      WhiteCat6142
// ==/UserScript==
try {
  var table = $('table#threads');
  table.after('<div class=\'clearfix\'></div>');
  table.before('<div id=\'nb\' class=\'pull-right span6\'></div>');
  table.after('<div class=\'nb2\'></div>');
  $('.nb2').css({
    width: '45%',
    height: '500px',
    float: 'left',
    overflow: 'auto'
  });
  table.appendTo('.nb2');
  var css = document.createElement('style');
  css.setAttribute('type', 'text/css');
  css.textContent = 'table#threads>tbody>tr>td>a{max-width:300px}' +
  'tr > :nth-child(3) {display: none;}' +
  '.pop{position: absolute;background-color: lightgray;padding:6px;color:black;}' +
  '#nb > .res > .body > span{color:blue;}' +
  '#nb > .res > .body img{max-width:200px;heigth:200px;}';
  document.head.appendChild(css);
  $('.title').after('<a onclick="localStorage.clear()">reset</a>');
  var b = {
  };
  var list = JSON.parse(window.localStorage.getItem(location.href) || '{}');
  var ng = JSON.parse(window.localStorage.getItem('ngid') || '[]');
  var eachFunc = function (index, ele) {
    if (index == 0) return;
    ele = $(ele);
    if (ng.indexOf(ele.children('td:nth-child(3)').text()) != - 1) {
      ele.hide();
      return;
    }
    var a = ele.children('td:first').children('a');
    var dat = a.attr('href').match(/\/([0-9]+)/) [1];
    var num = ele.children('td:nth-child(2)').text() | 0;
    a.attr('data', dat);
    a.attr('href', 'javascript:void(0)');
    b[dat] = [
      a.text(),
      num
    ];
    if (list[dat]) {
      var p = (num - list[dat][1]);
      if (p > 0) {
        a.css({
          'font-weight': 'bold'
        });
        ele.css({
          color: 'orangered'
        });
        ele.children('td:nth-child(2)').append('<span>+' + p + '</span>');
      } else {
        a.css({
          color: 'gray'
        });
      }
    }
  };
  $('table#threads>tbody>tr').each(eachFunc);
  var contentEval = function (source) {
    source = '(' + source + ')();'
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = source;
    document.body.appendChild(script);
  }
  $.getScript('http://twitter.github.io/hogan.js/builds/3.0.1/hogan-3.0.1.min.js', function () {
    contentEval(function () {
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
      '<div class="res">' +
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
          if (e.indexOf('-') == - 1) content += $('#nb > div:nth-child(' + e + ')').html();
           else {
            var xs = e.split('-');
            for (var i = xs[0] | 0; i <= xs[1] | 0; i++) {
              content += $('#nb > div:nth-child(' + i + ')').html();
            }
          }
        });
        $(this).append('<div class=\'pop\'>' + content + '</div>');
      };
      var hidePop = function (a) {
        $('.pop').fadeOut('normal');
      };
              var th = 600;
        var unveil = function() {
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
        var listen = function() {
          clearTimeout(timer);
          timer = setTimeout(unveil, 75);
        }
        window.addEventListener('resize', listen);
        window.addEventListener('scroll', listen);
        listen();
      var list = JSON.parse(localStorage[location.href] || '{}');
      var ng = JSON.parse(window.localStorage.getItem('ngid') || '[]');
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
        var b3 = body.match(/h?ttps?:\/\/[0-9-_a-zA-Z.\/!#$&+,:;=@\[\]\?]+/g);
        if (b3) {
          b3.forEach(function (ele) {
            var link = (ele[0] == 'h') ? ele : 'h' + ele;
            if (link.substr( - 4).match(/.[(jpg)(png)(gif)]/)) body = body.replace(ele, '<img class="lazy" data-src="' + link + '">');
             else body = body.replace(ele, '<a href="' + link + '">' + ele + '</a>');
          });
        }
        return body;
      }
      var onclickX = function (event) {
        var a = event.target;
        document.title = a.innerText;
        var dat = a.getAttribute('data');
        $.get(location.href + 'dat/' + dat + '.dat', {
        }, function (data) {
          var x = [
          ];
          data.split('\n').forEach(function (ele, i) {
            var s = ele.split('<>');
            if (!s[3]) {
              return null;
            }
            var ids = s[2].split(' ID:');
            if (ng.indexOf(ids[1]) != - 1) return null;
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
          $('#nb').html(tmpl.render({
            cs: x
          }) + post.render({
            bbs: bbs,
            dat: dat
          }));
          list[dat] = [
            a.innerText,
            x.length
          ];
          $('#nb .body span').mouseover(showPop);
          $('#nb .body span').mouseout(hidePop);
          listen();
          localStorage[location.href] = JSON.stringify(list);
          var td = a.parentElement.parentElement;
          td.children[1].innerHTML = x.length.toString();
          td.setAttribute('style', '');
          a.setAttribute('style', 'color:gray;');
        });
      };
      $('table#threads>tbody>tr').each(function (i, e) {
        if (i == 0) return;
        var a = e.children[0].children[0];
        a.addEventListener('click', onclickX, true);
      });
    });
  });
} catch (e) {
  console.log(e);
}
