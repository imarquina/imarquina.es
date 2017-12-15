window.fbAsyncInit = function() {
    FB.init({
        appId: '527161537634692',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11'
    });
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

lnkHrefImage = function(param) {
    FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: param,
        },
        function(response) {});
};

lnkHrefPage = function(param){
    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.likes',
        action_properties: JSON.stringify({
          object: param,
        })
      }, function(response){});
};