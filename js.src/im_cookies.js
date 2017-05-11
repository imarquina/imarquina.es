// JavaScript Document
/* Establece la capa de la ley de cookies 
  ================================================== */
bannerCookies = function() {
    //Capa cookies
    if ($.cookie('banner') != 'hide') {
        $("<div id='banner-cookie-bottom-overlay'><div class='banner-cookie-texto'>Como muchas p&aacute;ginas web utilizo <a href='http://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)' target='_blank'>cookies</a> para mejorar mediante el an&aacute;lisis de tu navegaci&oacute;n en el sitio. <a href='http://www.google.es/intl/es/policies/technologies/cookies/' target='_blank'>M&aacute;s informaci&oacute;n.</a><br>Si sigues navegando entiendo que aceptas el uso de cookies. En todo caso mejor activar la Navegaci&oacute;n Privada de tu navegador ;)</div><div class='banner-cookie-vinculos'><a id='banner-cookie-submit' href='#'>Lo entiendo</a><a id='banner-cookie-cancel' href='#'>Cerrar</a></div></div>").appendTo("#banner-cookie-bottom");
        $("#banner-cookie-bottom").show();
        $("#banner-cookie-submit").click(function(e) {
            e.preventDefault();
            $('#banner-cookie-bottom').hide();
            $.cookie('banner', 'hide');
        });
        $("#banner-cookie-cancel").click(function(e) {
            e.preventDefault();
            $('#banner-cookie-bottom').hide();
        });
    }
}
bannerCookies();