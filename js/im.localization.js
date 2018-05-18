// JavaScript Document
var cultureHash = new Hashtable();
var etiquetasHash = new Hashtable();
var Localization = {
    Culture: (function () {
        /* FUNCIONES PRIVADAS */
        var cultureDefault = function () {
            return App.Config.cultures[0].id;
        }
        var propertiesLoad = function () {
            var properties = Database.Property.load('etiquetas.' + this.Culture.languageGet() + App.Config.extProperties);
            var tmpEtiquetas = new Hashtable();
            properties.split("\n").forEach(function (item, index) {
                var line = item.split("=");
                tmpEtiquetas.put(line[0], line[1]);
            });
            return tmpEtiquetas;
        }
        var buildCulture = function () {
            var sEtiquetas = "";
            sEtiquetas = "<div class='popover-idioma'><ul class='culture'>";
            cultureHash.each(function (key, value) {
                if (value.id != Culture.languageGet()) {
                    sEtiquetas += "<li><a href=\"#\" onclick=\"Localization.Culture.changeCulture(\'" + value.id + "\')\">" + value.id + "</a></li>";
                }
            });
            sEtiquetas += "</ul></div>";

            $("#lnkIdioma").popover({
                content: sEtiquetas
            });
            $("#lnkIdioma").text(Culture.languageGet());
        }
        Culture = {
            /* FUNCIONES PUBLICAS */
            localeLoad: function () {
                for (var i = 0; App.Config.cultures[i] != undefined; i++) {
                    cultureHash.put(App.Config.cultures[i].id, App.Config.cultures[i]);
                }
                etiquetasHash = propertiesLoad();
                buildCulture();
            },
            languageGet: function () {
                if ($.cookie('language') == undefined) {
                    $.cookie('language', cultureDefault());
                }
                return $.cookie('language');
            },
            culturaGet: function () {
                return cultureHash.get(this.languageGet());
            },
            /* Recupera el término para el idioma activo */
            getResource: function (property) {
                var sResult = etiquetasHash.get(property);
                return sResult;
            },
            changeCulture: function (culture) {
                $.cookie('language', culture);
                buildCulture();
                location.reload();
            }
        }
        return Culture;
    })()
}