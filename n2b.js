// ==UserScript==
// @name        ネッブラ
// @namespace   n2b
// @description next産専ブラ
// @include     /http://next2ch.net/[^/]+//
// @version     0
// @grant       none
// @require     
// @author      WhiteCat6142
// ==/UserScript==
try {
  var table = $('table#threads');
  table.after('<div class=\'clearfix\'></div>');
  table.css({
    width: '35%',
    float: 'left'
  });
  table.before('<div id=\'nb\' class=\'pull-right span6\'></div>');
  var css = document.createElement('link');
  css.setAttribute('rel', 'stylesheet');
  css.textContent = 'table#threads>tbody>tr>td>a{max-width:300px}';
  document.head.appendChild(css);
  $('.title').after('<a onclick="localStorage.clear()">reset</a>');
  var b = {
  };
  var list = JSON.parse(window.localStorage.getItem(location.href) || '{}');
  var eachFunc = function (index, ele) {
    if (index == 0) return;
    ele = $(ele);
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
      '<span class="mail">{{mail}}</span>' +
      '<div class="ids">{{ids}}</div>' +
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
      var list = JSON.parse(localStorage[location.href] || '{}');
      var onclickX = function (event) {
        var a = event.target;
        document.title = a.innerText;
        var dat = a.getAttribute('data');
        $.get(location.href + 'dat/' + dat + '.dat', {
        }, function (data) {
          var x = data.split('\n').map(function (x, i) {
            var s = x.split('<>');
            if (!s[3]) {
              return null;
            }
            var body = s[3].replace('<br>', '\n');
            /*var b1 = body.match(/&gt;&gt;\d+/g);
            if(b1){
                b1.forEach(function(ele){
                    body=body.replace(ele,"&gt;&gt;"+index);
                });
            }
            */
            var b2 = body.match(/&amp;#\d+;/g);
            if (b2) {
              b2.forEach(function (ele) {
                var x = ele.slice(6, - 1) | 0;
                body = body.replace(ele, String.fromCodePoint(x));
              });
            }
            return {
              i: i + 1,
              name: s[0],
              mail: s[1],
              ids: s[2],
              body: body
            };
          });
          x.pop();
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
