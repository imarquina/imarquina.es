// JavaScript Document
var Comun = {
    /* Recupera el valor de QueryString indicado en en el argumento */
    queryStringParamGet: function(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = Comun.htmlUnescape(sPageURL).split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    },
    /* Evalua si el valor de QueryString es válido */
    queryStringParamValue: function(sParam) {
        if (sParam != undefined && sParam != App.Config.cadenaVacia && sParam != '%C3%B1%C3%B1') {
            return true;
        } else return false;
    },
    /* Elimina los caracteres problemáticos para textos */
    htmlReplace: function(text) {
        while (text.toString().indexOf(' ') != -1) {
            text = text.toString().replace(' ', '_');
        }
        while (text.toString().indexOf('+') != -1) {
            text = text.toString().replace('+', '_');
        }
        return $.md5(text);
    },
    /* Elimina los caracteres problemáticos para web */
    htmlEscape: function(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/ñ/g, '&#241;')
            .replace(/á/g, '&aacute;')
            .replace(/é/g, '&eacute;')
            .replace(/í/g, '&iacute;')
            .replace(/ó/g, '&oacute;')
            .replace(/ú/g, '&uacute;');
    },
    /* Restablece los caracteres problemáticos para textos */
    htmlUnescape: function(value) {
        return String(value)
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;amp;/g, '&')
            .replace(/&amp;/g, '&');
    },
    /* Formatea la fecha pasada en el argumento */
    dateFormat: function(sText) {
        if (sText != undefined && sText != App.Constantes.cadenaVacia && sText.length == 8 && $.isNumeric(sText)) {
            return sText.substr(6, 2) + '/' + sText.substr(4, 2) + '/' + sText.substr(0, 4);
        } else {
            return '--';
        }
    },
    /* Devuelve el año del valor pasado en el argumento */
    dateAnno: function(sText) {
        if (sText != undefined && sText != App.Constantes.cadenaVacia && sText.length == 8 && $.isNumeric(sText)) {
            return sText.substr(0, 4);
        } else {
            return '1900';
        }
    },
    /* Devuelve el mes del valor pasado en el argumento */
    dateMes: function(sText) {
        if (sText != undefined && sText != App.Constantes.cadenaVacia && sText.length == 8 && $.isNumeric(sText)) {
            return sText.substr(4, 2);
        } else {
            return '01';
        }
    },
    /* Devuelve el día dle valor pasado en el argumento */
    dateDia: function(sText) {
        if (sText != undefined && sText != App.Constantes.cadenaVacia && sText.length == 8 && $.isNumeric(sText)) {
            return sText.substr(6, 2);
        } else {
            return '01';
        }
    },
    /* Función de ordenación por fechas para array */
    arrayDateSort: function(a, b) {
        var dateA = new Date(Comun.dateAnno(a[0].public), Comun.dateMes(a[0].public), Comun.dateDia(a[0].public));
        var dateB = new Date(Comun.dateAnno(b[0].public), Comun.dateMes(b[0].public), Comun.dateDia(b[0].public));

        return dateB - dateA; //sort by date descending	
    }
}
Cookies = {
    /* Establece la capa de la ley de cookies */
    bannerCookies: function() {
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
}