angular.module('cc98.filters', [
  'hc.marked'])

  //判断性别，输出图标
  .filter('gender', function () {
    return function (gender) {
      if (gender == 0)
        return "<i class=\"icon ion-male positive\"></i>";
      else if (gender == 1)
        return "<i class=\"icon ion-female pink\"></i>";
      else
        return undefined;
    };
  })

  //UBB代码解析,并信任
  .filter('ubb', ['$sce', function ($sce) {
    return function (content) {
      var j;
      content = content.replace(/\r\n/g, "<BR>").replace(/\n/g, "<BR>");
      var currubb = content;
      var preubb = currubb;
      for (j = 0; j < 10; j++) {
        if ((currubb = ubbcode(preubb)) != preubb) {
          preubb = currubb;
        }
        else
          break;
      }
      return $sce.trustAsHtml(currubb);
    };
  }])

  //显示时间
  .filter('time', function () {
    return function (time) {
      if (time)
        return time.replace("T", " ");
    };
  })

  //显示生日
  .filter('birthday', function () {
    return function (time) {
      if (time)
        return time.replace("T00:00:00", "");
      else
        return "未填";
    };
  })

  .config(['markedProvider', function (markedProvider) {
    /*
    markedProvider.setRenderer({
      link: function (href, title, text) {
        return href;
      }
    });
    
    markedProvider.setRenderer({
      paragraph: function (text) {
        return text;
      }
    });
*/
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      highlight: function (code, lang) {
        if (lang) {
          if (lang != "shell")
            return hljs.highlight(lang, code, true).value;
          else return hljs.highlightAuto(code).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  }])
  .filter('markdown', ['marked', function (marked) {
    return function (content) {
      return marked(content);
    }
  }])
