(function(w, d, n){

  function DNT () {
      if ('msDoNotTrack' in n) return n.msDoNotTrack;
      if ('doNotTrack' in w)   return w.doNotTrack;
      if ('doNotTrack' in n)   return n.doNotTrack;
      return 0;
  }

  if (DNT() != 1) {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(w,d,'script','https://www.google-analytics.com/analytics.js','ga');
      w.ga('create', 'UA-8714642-2', 'auto');
      w.ga('send', 'pageview');
  }

})(window, document, navigator);
