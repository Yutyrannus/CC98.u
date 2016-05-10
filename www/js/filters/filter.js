angular.module('cc98.filters', [])

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


