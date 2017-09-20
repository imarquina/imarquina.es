// JavaScript Document
var typesHash = new Hashtable();
var dataXml;

/** Eventos */
$(window).ready(function() {
    View.General.initialize();

    //Carga colección elementos
    var photoXml = Database.Photos.load();
    typesHash = Controller.Photos.load(photoXml);
    //Carga album elementos
    dataXml = Database.Config.load();

    if (document.URL.toLowerCase().indexOf("banner.html") > 0) {
        View.Index.bannerSet(dataXml);
    } else {
        View.General.menuSet(dataXml);
        View.General.sloganSet(dataXml);

        if (document.URL.toLowerCase().indexOf("sequence.html") > 0) {
            var sGallery = Comun.queryStringParamGet('gallery');
            if (Comun.queryStringParamValue(sGallery)) {
                View.Detail.gallerySet(dataXml, sGallery, Comun.queryStringParamGet('news'));
            } else {
                var sNews = Comun.queryStringParamGet('news');
                if (Comun.queryStringParamValue(sNews)) {
                    View.Detail.newsSet(dataXml, sNews, Comun.queryStringParamGet('news'))
                }
            }
        } else if (document.URL.toLowerCase().indexOf("detail.html") > 0) {
            var sGallery = Comun.queryStringParamGet('gallery');
            if (Comun.queryStringParamValue(sGallery)) {
                View.Detail.imageSet(dataXml, sGallery, Comun.queryStringParamGet('news'),
                    Comun.queryStringParamGet('photo'));
            }
        } else {
            var sGallery = Comun.queryStringParamGet('gallery');
            if (Comun.queryStringParamValue(sGallery)) {
                View.Index.gallerySet(dataXml, sGallery, Comun.queryStringParamGet('news'));
            } else {
                var sFolder = Comun.queryStringParamGet('folder');
                if (Comun.queryStringParamValue(sFolder)) {
                    View.Index.folderSet(dataXml, sFolder, Comun.queryStringParamGet('news'));
                } else {
                    var sMultiMed = Comun.queryStringParamGet('multimedia');
                    if (Comun.queryStringParamValue(sMultiMed)) {
                        View.Index.multimediaSet(dataXml, sMultiMed, Comun.queryStringParamGet('news'));
                    } else {
                        var sNews = Comun.queryStringParamGet('news');
                        if (Comun.queryStringParamValue(sNews)) {
                            View.Index.newsSet(dataXml, sNews);
                        } else {
                            View.Index.lastCargar(dataXml);
                            View.Index.homeSet(dataXml);
                        }
                    }
                }
            }
        }
    }
});

$(function() {
    var $win = $(window);
    var $pos = 20;
    $win.scroll(function() {
        if ($win.scrollTop() <= $pos)
            $('.bar-goHead').addClass('hidden');
        else {
            $('.bar-goHead').removeClass('hidden');
        }
    });
});

/** */
var View = {
    General: (function() {
        /* FUNCIONES PRIVADAS */
        /* Genera el vínculo según clave, y si la navegación viene por 'Lo nuevo' */
        var hrefSet = function(clave, valor, urlnews, ishref) {
            var sResult;

            if (urlnews != undefined) {
                if (clave.toLowerCase() == ("lo último").toLowerCase()) {
                    if (ishref == 1) {
                        sResult = "<li class='breadcrumb-item'><a href='./index.html?news=" + urlnews + "'>" +
                            ("Lo &uacute;ltimo").toLowerCase() + "</a></li>"
                    } else { sResult = "<li class='breadcrumb-item active'>" + clave.toLowerCase() + "</li>" };
                } else {
                    if (ishref == 1) {
                        sResult = "<li class='breadcrumb-item'><a href='./index.html?" + clave + "=" + Comun.htmlReplace(valor) +
                            "&news=" + urlnews + "'>" + valor.toLowerCase() + "</a></li>"
                    } else { sResult = "<li class='breadcrumb-item active'>" + valor.toLowerCase() + "</li>" };
                }
            } else {
                if (ishref == 1) {
                    sResult = "<li class='breadcrumb-item'><a href='./index.html?" + clave + "=" + Comun.htmlReplace(valor) + "'>" +
                        valor.toLowerCase() + "</a></li>"
                } else { sResult = "<li class='breadcrumb-item active'>" + valor.toLowerCase() + "</li>" };
            }
            return sResult;
        }
        General = {
            /* FUNCIONES PUBLICAS */
            initialize: function() {
                var lightbox = lity();

                if (App.Config.developer == 1) {
                    $("#lnkstyledev").attr("href", "./css/im.developer.css")
                }

                View.General.pageTitleSet(App.Config);
            },
            /* Encuentra los elementos de primer nivel y los incluye en el elemento del menu */
            menuSet: function(data) {
                var colElementos = Controller.Config.menuLoad(data);

                var iCnt = 0;
                for (var i = 0; i < colElementos.length; i++) {
                    var sType = colElementos[i].type;

                    switch (sType) {
                        case 'folder':
                            var sName = colElementos[i].texto;

                            $("<li><span class='fa " + App.Constantes.iconGalleries + "' /><a href='./index.html?folder=" +
                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                            break;
                        case 'gallery':
                            var sName = colElementos[i].texto;

                            $("<li><span class='fa " + App.Constantes.iconGallery + "' /><a href='./index.html?gallery=" +
                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                            break;
                        case 'multimedia':
                            var sName = colElementos[i].texto;

                            $("<li><span class='fa " + App.Constantes.iconVideo + "' /><a href='./index.html?multimedia=" +
                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                            break;
                    }
                }
            },
            sloganSet: function(data) {
                var elemento = Controller.Config.sloganLoad(data);

                var sTexto = elemento.texto;
                $(sTexto).appendTo('#slogan');
            },
            /* Evalua si el objeto imagen es válido */
            imageValidate: function(oImagen) {
                if (oImagen != undefined) return true;
                else return false;
            },
            generalGet: function(data) {
                var elemento = Controller.Config.generalLoad(data);

                return elemento;
            },
            seoValuesSet: function(elemento) {
                var elemento = Controller.Config.seoValoresLoad(elemento);

                var sNews = '';
                if (Comun.queryStringParamGet('news')) sNews = " (Lo último)";
                document.title = elemento.title + sNews;
                $('meta[name="description"]').attr("content", elemento.infoText);
                $('meta[name="keywords"]').attr("content", elemento.keywords);

                $('meta[itemprop="name"]').attr("content", App.Config.author);
                $('meta[itemprop="description"]').attr("content", elemento.infoText);
                $('meta[name="author"]').attr("content", App.Config.author);
                $('meta[name="copyright"]').attr("content", '@' + App.Config.annio + ' ' +
                    App.Config.author + " v" + App.Config.version);
            },
            pageTitleSet: function(elemento) {
                $("<p class='card-text'><small>@<span id='annio'>" + elemento.annio + "</span> " +
                    elemento.author + " v<span id='version'>" + elemento.version +
                    "</span></small></p>").prependTo("#copyright");
            },
            infoLinkGet: function(infolink) {
                if (infolink != 'about:blank' && infolink != App.Constantes.cadenaVacia && infolink != undefined) {
                    var aVinculos = infolink.split("|");
                    var sResult = App.Constantes.cadenaVacia;
                    for (var iCnt = 0; iCnt < aVinculos.length; iCnt++) {
                        var aInfo = aVinculos[iCnt].split("*");
                        switch (aInfo[0]) {
                            case App.Constantes.appFlickr:
                                sResult += "<a href='" + aInfo[1] + "' target='_blank'><img src='resources/flickr.png' style='width:14px!important;' title='publicado en flicr'/></a>";
                                break;
                            case App.Constantes.appPinterest:
                                sResult += "<a href='" + aInfo[1] + "' target='_blank'><img src='resources/pinterest.png' style='width:14px!important;' title='publicado en pinterest'/></a>";
                                break;
                            case App.Constantes.app500px:
                                sResult += "<a href='" + aInfo[1] + "' target='_blank'><img src='resources/500px.png' style='width:14px!important;' title='publicado en 500px'/></a>";
                                break;
                            default:
                                break;
                        }
                    }
                    return sResult;
                } else return App.Constantes.cadenaVacia;
            },
            breadcrumGet: function(oNode, urlNews) {
                var oTemp = oNode;
                var sResult = '';

                if (oTemp == undefined && urlNews == undefined) {
                    sResult = "<li class='breadcrumb-item'><a href='./index.html'>inicio</a></li>"
                    sResult += "<li class='breadcrumb-item active'>lo último</li>"

                } else {
                    if (document.URL.toLowerCase().indexOf("sequence.html") > 0) {
                        sResult = "<li class='breadcrumb-item active'>secuencia</li>";
                        if (oTemp != '') {
                            sResult = hrefSet(oTemp[0].nodeName, oTemp.attr("name"), urlNews, 1) + sResult;
                        }
                    } else if (document.URL.toLowerCase().indexOf("detail.html") > 0) {
                        sResult = "<li class='breadcrumb-item active'>imagen</li>";
                        if (oTemp != '') {
                            sResult = hrefSet(oTemp[0].nodeName, oTemp.attr("name"), urlNews, 1) + sResult;
                        }
                    } else {
                        sResult += hrefSet(oTemp[0].nodeName, oTemp.attr("name"), urlNews, 0)
                    }

                    if (oTemp != '') {
                        while ((oTemp.parent()).attr("name") != undefined) {
                            oTemp = oTemp.parent();
                            sResult = hrefSet(oTemp[0].nodeName, oTemp.attr("name"), urlNews, 1) + sResult;
                        }
                    }
                    if (urlNews != undefined) sResult = hrefSet("lo último", urlNews, urlNews, 1) + sResult;
                    sResult = "<li class='breadcrumb-item'><a href='./index.html'>inicio</a></li>" + sResult;
                }

                return sResult;
            },
            bannerCookiesLoad: function(data) {
                if ($.cookie('banner') != 'hide') {
                    var elemento = Controller.Config.bannerCookiesLoad(data);
                    var sTexto = elemento.texto;

                    $("<div id='banner-cookie-bottom-overlay'><div class='banner-cookie-texto'>" + sTexto + "</div></div>").appendTo("#banner-cookie-bottom");
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
        return General;
    })(),
    Index: (function() {
        /** FUNCIONES PRIVADAS */
        var pageBuild = function(data, colImages, nodo, sNews) {
            //breadcrump                    
            var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
            $(View.General.breadcrumGet(nodo, sNews)).appendTo(panBreadCrumb);

            var node_name = '';

            if (nodo != undefined && nodo != '') {
                node_name = $(this).attr("name");

                //vinculos social-media
                var dataText = '';
                if ((nodo.parent()).attr("name") != undefined) {
                    dataText = App.Config.dataTextTitle + (nodo.parent()).attr("name") + ":" + node_name;
                } else {
                    dataText = App.Config.dataTextTitle + node_name;
                }
                $('#shareme').attr("data-url", window.location.href);
                $('#shareme').attr("data-text", App.Config.dataTextTitle + dataText);

                //establecer valores para SEO
                View.General.seoValuesSet(nodo);
            }
            View.General.bannerCookiesLoad(data);
        };
        /** FUNCIONES PUBLICAS */
        Index = {
            homeSet: function(data) {
                //vinculos social-media
                $('#shareme').attr("data-url", App.Config.home);
                $('#shareme').attr("data-text", App.Config.dataTextTitle + App.Config.dataTextHome);

                var colElementos = Controller.Config.allLoad(data);

                var iCnt = 0;
                for (var i = 0; i < colElementos.length; i++) {
                    var sType = colElementos[i][0].type;

                    switch (sType) {
                        case 'gallery':
                            var sName = colElementos[i][0].titulo;
                            var imgName = colElementos[i][0].id.replace(".jpg", "");
                            var sUpdate = colElementos[i][0].update;

                            var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                            var divImage = $("<div class='card-image'>").appendTo(divCard);
                            $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                imgName + ".jpg' title='" + sName + "' alt='imagen " + sName + "' />").appendTo(divImage);
                            var divBlock = $("<div class='card-block'>").appendTo(divCard);
                            var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                            $("<span class='fa " + App.Constantes.iconGallery + "'></span>").appendTo(panTitulo);
                            $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                            var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                            $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);

                            //Crear vínculo carpeta
                            $(divCard).wrap("<a href='./index.html?gallery=" + Comun.htmlReplace(sName) + "'>");
                            break;
                        case 'multimedia':
                            var sName = colElementos[i][0].titulo;
                            var imgName = colElementos[i][0].id.replace(".jpg", "");
                            var sUpdate = colElementos[i][0].update;

                            var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                            var divImage = $("<div class='card-video'>").appendTo(divCard);
                            $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                imgName + ".jpg' title='" + sName + "' alt=' " + sName + "' />").appendTo(divImage);
                            var divBlock = $("<div class='card-block'>").appendTo(divCard);
                            var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                            $("<span class='fa " + App.Constantes.iconVideo + "'></span>").appendTo(panTitulo);
                            $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                            var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                            $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);

                            //Crear vínculo carpeta
                            $(divCard).wrap("<a href='./index.html?multimedia=" + Comun.htmlReplace(sName) + "'>");
                            break;
                        case 'folderImages':
                            var sName = colElementos[i][0].titulo;
                            var imgName = colElementos[i][0].id.replace(".jpg", "");
                            var sUpdate = colElementos[i][0].update;
                            var colThumbs = colElementos[i][0].thumbs;

                            var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                            var divImage = $("<div class='card-image'>").appendTo(divCard);
                            $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                imgName + ".jpg' title='" + sName + "' alt=' " + sName + "' />").appendTo(divImage);
                            var divBlock = $("<div class='card-block'>").appendTo(divCard);
                            var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                            $("<span class='fa " + App.Constantes.iconGalleries + "'></span>").appendTo(panTitulo);
                            $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                            //Capa de thumbs de galeria
                            if (colThumbs.length > 0) {
                                var panThumbs = $("<div class='row thumbs'>").appendTo(divBlock);

                                var j;
                                for (j = 0; j < colThumbs.length && j < 4; j++) {
                                    var divThumb = $("<div class='col-3'>").appendTo(panThumbs);
                                    $("<img class='img-fluid' src='" + App.Config.rutaThumb +
                                        colThumbs[j].id + "' title='" + colThumbs[j].titulo +
                                        "' alt='" + colThumbs[j].titulo + "'>").appendTo(divThumb);
                                }
                                while (j < 4) {
                                    var divThumb = $("<div class='col-3'>").appendTo(panThumbs);
                                    $("<img class='img-fluid' src='resources/000000000.png' alt='no imagen'>").appendTo(divThumb);
                                    j++;
                                }
                            }
                            var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                            $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) +
                                "</small>").appendTo(panDate);

                            //Crear vínculo carpeta
                            $(divCard).wrap("<a href='./index.html?folder=" + Comun.htmlReplace(sName) + "'>");
                            break;
                        case 'folderText':
                            var sName = colElementos[i][0].titulo;
                            var sUpdate = colElementos[i][0].update;
                            var colThumbs = colElementos[i][0].thumbs;

                            var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                            var divBlock = $("<div class='card-block'>").appendTo(divCard);
                            var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                            $("<span class='fa " + App.Constantes.iconText + "'></span>").appendTo(panTitulo);
                            $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);

                            //Capa de thumbs de galeria
                            if (colThumbs.length > 0) {
                                var lstSec = $("<ul>").appendTo(divBlock);

                                for (var j = 0; j < colThumbs.length; j++) {
                                    var sNameS = colThumbs[j].titulo;
                                    var elmLst = $("<li>" + sNameS + "</li>").appendTo(lstSec);
                                    //Crear vínculo
                                    $(elmLst).wrap("<a href='#' data-toggle='modal' data-target='." +
                                        Comun.htmlReplace(sNameS) + "'>");
                                    //Modal
                                    View.Index.modalSet(data, Comun.htmlReplace(sNameS));
                                }
                            }
                            var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                            $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);
                            break;
                        case 'section':
                            var sName = colElementos[i][0].titulo;
                            var sUpdate = colElementos[i][0].update;

                            var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                            var divBlock = $("<div class='card-block'>").appendTo(divCard);
                            var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                            $("<span class='fa " + App.Constantes.iconInfo + "'></span>").appendTo(panTitulo);
                            $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                            var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                            $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);

                            //Crear vínculo
                            $(divCard).wrap("<a href='#' data-toggle='modal' data-target='." + Comun.htmlReplace(sName) + "'>");

                            //Modal
                            View.Index.modalSet(data, Comun.htmlReplace(sName));
                            break;
                    }
                }
                View.General.seoValuesSet(Controller.Config.generalNodeGet(data));
                View.General.bannerCookiesLoad(data);
            },
            /* Crea la lista de elementos de una galería */
            gallerySet: function(data, sParam, sNews) {
                var colImages = Controller.Config.galleryLoad(data, sParam);

                var iCnt = 0;
                for (var i = 0; i < colImages.length; i++) {
                    var imgName = colImages[i][0].id.replace(".jpg", "");
                    var sName = colImages[i][0].titulo;
                    var sInfT = colImages[i][0].infoimagen;
                    var sFormat = colImages[i][0].format;
                    var sStock = colImages[i][0].stock;
                    var sPrice = colImages[i][0].price;
                    var sLnkUrl = colImages[i][0].linkurl;
                    var sUpdate = colImages[i][0].update;

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");

                    /** imagen */
                    var divImage = $("<div class='card-image' title='ver imagen'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                        imgName + ".jpg' alt='imagen " + sName + "' />").appendTo(divImage);

                    //vinculo
                    if (sNews != undefined) {
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + i + "&news=" + sNews + "'>");
                    } else {
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + i + "'>");
                    }
                    /** bloque */
                    var divBlock = $("<div class='card-block' title='ver imagen'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconImage + "'></span>").appendTo(panTitulo);
                    $("<span class='col-10'>" + sName + "</span>").appendTo(panTitulo);
                    //Marcador de secuencia                            
                    var divSecuencia = $("<div title='ver secuencia'>").appendTo(panTitulo);
                    $("<span class='fa fa-chevron-left'>").appendTo(divSecuencia);
                    $("<span class='fa fa-chevron-right'>").appendTo(divSecuencia);
                    //vinculo marcador secuencia
                    if (sNews != undefined) {
                        $(divSecuencia).wrap("<a class='secuencia' href='./sequence.html?gallery=" + sParam + "&photo=" + i + "&news=" + sNews + "'>");
                    } else {
                        $(divSecuencia).wrap("<a class='secuencia' href='./sequence.html?gallery=" + sParam + "&photo=" + i + "'>");
                    }
                    //Texto
                    var panTexto = $("<p class='card-text '>" + sInfT + "</p>").appendTo(divBlock);
                    //Dimensiones, precio copia
                    var sCadena = '';
                    if ((sFormat != undefined) && (sFormat != '')) {
                        sCadena += App.Constantes.dimesion + sFormat;
                    }
                    if ((sStock != undefined) && (sStock != '')) {
                        sCadena += ' ' + sStock;
                    }
                    if ((sPrice != undefined) && (sPrice != '')) {
                        if (sCadena != '') sCadena += '<br />';
                        sCadena += App.Constantes.copia + sPrice + App.Constantes.moneda;
                    }
                    var panDimensiones = $("<p class='card-text text-left'>").appendTo(divBlock);
                    $("<small class='text-muted'>" + sCadena + "</small>").appendTo(panDimensiones);
                    //Pie
                    var panFooter = $("<div class='card-text row justify-content-between'>").appendTo(divBlock);
                    var panSocial = $("<div class='col-4 text-left'>").appendTo(panFooter);
                    $(View.General.infoLinkGet(sLnkUrl)).appendTo(panSocial);
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);
                }
                pageBuild(data, '', Controller.Config.galleryFind(data, sParam), sNews);
            },
            /* Crea la lista de elementos de una carpeta */
            folderSet: function(data, sParam, sNews) {
                var colImages = Controller.Config.folderLoad(data, sParam);

                var iCnt = 0;
                for (var i = 0; i < colImages.length; i++) {
                    var sName = colImages[i][0].titulo;
                    var image = colImages[i][0].id;
                    var imgName = colImages[i][0].id.replace(".jpg", "");
                    var sUpdate = colImages[i][0].update;

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");

                    /** imagen */
                    var divImage = $("<div class='card-image'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                        imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                    //vinculo
                    if (sNews != undefined) {
                        $(divImage).wrap("<a href='./index.html?gallery=" + Comun.htmlReplace(sName) + "&news=" + sNews + "'>");
                    } else {
                        $(divImage).wrap("<a href='./index.html?gallery=" + Comun.htmlReplace(sName) + "'>");
                    }
                    /** bloque */
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    //Titulo
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconGallery + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                    //Pie
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                    $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);
                }
                pageBuild(data, '', Controller.Config.folderFind(data, sParam), sNews);
            },
            /* Crea la lista de elementos de una galería
            /* El segundo parámetro sirve para crear la
            /* miga de pan */
            multimediaSet: function(data, sParam, sNews) {
                var colImages = Controller.Config.multimediaLoad(data, sParam);

                var iCnt = 0;
                for (var i = 0; i < colImages.length; i++) {
                    var imgName = colImages[i][0].id.replace(".jpg", "");
                    var sName = colImages[i][0].titulo;
                    var sInfT = colImages[i][0].infoimagen;
                    var sFormat = colImages[i][0].format;
                    var sStock = colImages[i][0].stock;
                    var sPrice = colImages[i][0].price;
                    var sLnkUrl = colImages[i][0].linkurl;
                    var sUpdate = colImages[i][0].update;

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                    /** imagen */
                    var divImage = $("<div class='card-video'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                        imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                    /** bloque */
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconVideo + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                    //Texto
                    var panTexto = $("<p class='card-text '>" + sInfT + "</p>").appendTo(divBlock);

                    //Pie
                    var panFooter = $("<div class='card-text row justify-content-between'>").appendTo(divBlock);
                    //Capa social-media
                    var panSocial = $("<div class='col-4 text-left'>").appendTo(panFooter);
                    $("<img src='./resources/youtube.png' style='width:14px!important;' title='publicado en youtube'/>").appendTo(panSocial);
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);
                    //Crear vínculo carpeta
                    $(divCard).wrap("<a data-lity href='" + sLnkUrl + "'>");
                }
                pageBuild(data, '', Controller.Config.multimediaFind(data, sParam), sNews);
            },
            /* Crea la lista de elementos en base al dato PUBLIC */
            lastCargar: function(data) {
                var colImages = Controller.Config.newsLoad(data);
                //Ordenar colección
                colImages.sort(Comun.arrayDateSort);

                //Cargar panel con primera imagen
                var sName = colImages[0][0].titulo;
                var image = colImages[0][0].id;
                var imgName = image.replace(".jpg", "");
                var typeCss = (colImages[0][0].type == 'video') ? 'card-video' : 'card-image';

                var divCard = $("<div class='card p-1'>").appendTo("#tiles");

                /** imagen */
                var divImage = $("<div class='" + typeCss + "'>").appendTo(divCard);
                $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                    imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                /** bloque */
                var divBlock = $("<div class='card-block'>").appendTo(divCard);
                //Texto
                var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                $("<span class='fa " + App.Constantes.iconNew + "'></span>").appendTo(panTitulo);
                $("<span class='col-11'>Lo &uacute;ltimo</span>").appendTo(panTitulo);
                //Pie
                var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                $("<small class='text-muted'>" + Comun.dateFormat(colImages[0][0].update) + "</small>").appendTo(panDate);

                //Crear vínculo carpeta
                $(divCard).wrap("<a href='./index.html?news=" + colImages[0][0].update + "'>");
            },
            /* Crea el elemento de lista para novedades */
            newsSet: function(data, sParam) {
                var colImages = Controller.Config.newsLoad(data);
                //Ordenar colección
                colImages.sort(Comun.arrayDateSort);

                pageBuild(data, '');
                View.General.seoValuesSet(Controller.Config.generalNodeGet(data));

                //Cargar los N primeros
                var iCnt = 0;
                for (var i = 0; i < colImages.length - 1 && i < App.Config.elemNuevos; i++) {
                    var typeCss = (colImages[i][0].type == 'video') ? 'card-video' : 'card-image';
                    var icoImagen = (colImages[i][0].type == 'video') ? App.Constantes.iconVideo : App.Constantes.iconImage;
                    var infoTitle = (colImages[i][0].type == 'video') ? colImages[i][0].titulo : 'ver secuencia';

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");

                    /** imagen */
                    var divImage = $("<div class='" + typeCss + "'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + colImages[i][0].id.replace(".jpg", "") +
                        "' src='" + App.Config.rutaImage +
                        colImages[i][0].id.replace(".jpg", "") + ".jpg' title='" + colImages[i][0].titulo +
                        "' alt='Columnas Css' />").appendTo(divImage);
                    //Marcador de secuencia
                    if (colImages[i][0].type != 'video') {
                        var divSecuencia = $("<div class='secuencia' title='ver secuencia'>").appendTo(divImage);
                        $("<span class='fa fa-chevron-left'>").appendTo(divSecuencia);
                        $("<span class='fa fa-chevron-right'>").appendTo(divSecuencia);
                    }
                    /** bloque */
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconImage + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + colImages[i][0].titulo + "</span>").appendTo(panTitulo);
                    //Texto
                    var panEnlace = $("<div class='card-colection'>").appendTo(divBlock);
                    var panTexto = $("<p class='card-text '><span class='fa " + App.Constantes.iconColection +
                        "'></span>ir a</p>").appendTo(panEnlace);
                    var txtEnlace = $("<span>" + colImages[i][0].parentName + "</span>").appendTo(panTexto);
                    //Pie
                    var panFooter = $("<div class='card-text row justify-content-between'>").appendTo(divBlock);
                    //Social
                    if (colImages[i][0].type == 'video') {
                        $(divImage).wrap("<a data-lity='' href='" + colImages[i][0].linkurl + "'>");
                        $(txtEnlace).wrap("<a href='./index.html?multimedia=" + colImages[i][0].parentFolder +
                            "&news=" + sParam + "'>");

                        //Capa social-media
                        var panSocial = $("<div class='col-4 text-left'>").appendTo(panFooter);
                        $("<img src='./resources/youtube.png' style='width:14px!important;' title='publicado en youtube'/>").appendTo(panSocial);
                    } else {
                        $(divImage).wrap("<a href='./sequence.html?news=" + sParam + "&photo=" + iCnt + "'>");
                        $(txtEnlace).wrap("<a href='./index.html?gallery=" + colImages[i][0].parentFolder +
                            "&news=" + sParam + "'>");

                        //Capa social-media
                        var panSocial = $("<div class='col-4 text-left'>").appendTo(panFooter);
                        $(View.General.infoLinkGet(colImages[i][0].linkurl)).appendTo(panSocial);

                        iCnt++;
                    }

                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + Comun.dateFormat(colImages[i][0].update) + "</small>").appendTo(panDate);
                }
            },
            /* Crea el elemento de lista para novedades */
            bannerSet: function(data) {
                var colImages = Controller.Config.newsLoad(data);
                //Ordenar colección
                colImages.sort(Comun.arrayDateSort);

                var sParam = colImages[0][0].update;
                var oGeneral = View.General.generalGet(data);
                View.General.seoValuesSet(Controller.Config.generalNodeGet(data));

                var divCard = $("<div class='card'>").appendTo("#tiles");
                var divBlock = $("<div class='card-block'>").appendTo(divCard);
                var divThumbs = $("<div id='thumbs' class='d-flex flex-row'>").appendTo(divBlock);

                var divThumbLogo = $("<div class='p-3'>").appendTo(divThumbs);
                var divLogo = $("<img class='img-fluid' src='./resources/logo_xs.png' title='" +
                    oGeneral.title + "' />").appendTo(divThumbLogo);
                $(divThumbLogo).wrap("<a href='./index.html?news=" + sParam + "'>");

                //Cargar los N primeros
                var iCnt = 0;
                for (var i = 0; i < colImages.length - 1 && i < App.Config.elemBanner; i++) {
                    var divThumb = $("<div class='p-2'>").appendTo(divThumbs);
                    $("<img class='img-fluid' src='" + App.Config.rutaThumb +
                        colImages[i][0].id + "' title='" + colImages[i][0].titulo +
                        "' alt='" + colImages[i][0].titulo + "'>").appendTo(divThumb);

                    $(divThumb).wrap("<a href='./index.html?news=" + sParam + "'>");
                }
            },
            /* Establece y muestra el popup para un texto */
            modalSet: function(data, sParam) {
                var elemento = Controller.Config.modalLoad(data, sParam);

                var sTitulo = elemento.titulo.toUpperCase();
                var sTexto = elemento.texto;

                var divModal = $("<div class='modal fade " + sParam + "' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>").appendTo('#main');
                var divModalDialog = $("<div class='modal-dialog modal-lg'>").appendTo(divModal);
                var divModalContent = $("<div class='modal-content'>").appendTo(divModalDialog);
                var divModalHeader = $("<div class='modal-header'>").appendTo(divModalContent);
                $("<h5 class='modal-title'>" + sTitulo + "</h5>").appendTo(divModalHeader);
                var divModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>").appendTo(divModalHeader);
                $("<span aria-hidden='true'>&times;</span>").appendTo(divModalButton);
                var divModalBody = $("<div class='modal-body'>").appendTo(divModalContent);
                $(sTexto).appendTo(divModalBody);
                $("<div class='modal-footer'>").appendTo(divModalContent);

            }
        }
        return Index;
    })(),
    Detail: (function() {
        /** FUNCIONES PRIVADAS */
        /* Creal el HTML con el esquema de elementos y los
        items de la coleccion */
        var pageBuild = function(data, colImages, nodo, sNews, photo) {
            if (photo != undefined && photo != '') {
                if (Comun.insideIframe()) {
                    headTag = document.getElementsByTagName("head")[0].innerHTML;
                    var frameCSS = headTag + '<link type="text/css" href="./css/im.iframe.css" rel="stylesheet">';
                    document.getElementsByTagName('head')[0].innerHTML = frameCSS;
                }

                //breadcrump                    
                var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
                $(View.General.breadcrumGet(nodo, sNews)).appendTo(panBreadCrumb);

                var node_name = '';

                //vinculos social-media
                if (nodo != '') {
                    node_name = $(this).attr("name");

                    var dataText = '';
                    if ((nodo.parent()).attr("name") != undefined) {
                        dataText = App.Config.dataTextTitle + (nodo.parent()).attr("name") + ":" + node_name;
                    } else {
                        dataText = App.Config.dataTextTitle + node_name;
                    }
                }

                var iElem = 0;

                //Cargar los N primeros para novedades
                var sGallery = Comun.queryStringParamGet('gallery');

                for (var i = 0; i < colImages.length; i++) {
                    var imgName = colImages[i][0].id.replace(".jpg", "");
                    var sName = colImages[i][0].titulo;
                    var sHeight = colImages[i][0].height;
                    var sWidth = colImages[i][0].width;
                    var sInfoimagen = colImages[i][0].infoimagen;

                    var divCard = $("<div id='layCard' class='col-12 image-block'>").appendTo("#carouselSlides");
                    var divImage = $("<div id='layImage' class='card-image'>").appendTo(divCard);
                    $("<img class='img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage + imgName +
                        ".jpg' height='" + sHeight + "' width='" + sWidth + "' title='" + sName + "'>").appendTo(divImage);
                    var divBlock = $("<div id='layTexto' class='col-3 d-inline-block card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconImage + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                    $("<p class='card-text'>" + sInfoimagen + "</p>").appendTo(divBlock);

                    //Marcador de secuencia                            
                    var divSecuencia = $("<div title='ver secuencia'>").appendTo(divImage);
                    $("<span class='fa fa-chevron-left'>").appendTo(divSecuencia);
                    $("<span class='fa fa-chevron-right'>").appendTo(divSecuencia);
                    //vinculo marcador secuencia
                    if (sNews != undefined) {
                        $(divSecuencia).wrap("<a class='secuencia' href='./sequence.html?gallery=" + sGallery + "&photo=" + photo + "&news=" + sNews + "'>");
                    } else {
                        $(divSecuencia).wrap("<a class='secuencia' href='./sequence.html?gallery=" + sGallery + "&photo=" + photo + "'>");
                    }
                }
                View.General.seoValuesSet(Controller.Config.generalNodeGet(data));
            } else {
                //breadcrump                    
                var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
                $(View.General.breadcrumGet(nodo, sNews)).appendTo(panBreadCrumb);

                var node_name = '';

                //vinculos social-media
                if (nodo != '') {
                    node_name = $(this).attr("name");

                    var dataText = '';
                    if ((nodo.parent()).attr("name") != undefined) {
                        dataText = App.Config.dataTextTitle + (nodo.parent()).attr("name") + ":" + node_name;
                    } else {
                        dataText = App.Config.dataTextTitle + node_name;
                    }
                }

                var iElem = 0;

                //Cargar los N primeros para novedades
                var Limite = 1000;
                var sGallery = Comun.queryStringParamGet('gallery');
                if (sNews != undefined && sNews != '' && (sGallery == '' || sGallery == undefined)) {
                    Limite = App.Config.elemNuevos;
                }

                for (var i = 0; i < colImages.length && i < Limite; i++) {
                    var imgName = colImages[i][0].id.replace(".jpg", "");
                    var sName = colImages[i][0].titulo;
                    var sHeight = colImages[i][0].height;
                    var sWidth = colImages[i][0].width;

                    var sActive = elementActiveSet(Comun.queryStringParamGet('photo'), i);

                    $("<div class='carousel-item " + sActive + "'><img class='d-block img-fluid' id='" + imgName +
                        "' src='" + App.Config.rutaImage + imgName +
                        ".jpg' height='" + sHeight + "' width='" + sWidth + "' title='" + sName + "' alt='First slide'></div>").appendTo("#carouselInner");
                    $("<li data-target='#carouselSlides' class='" + sActive + "' data-slide-to='" +
                        i + "'></li>").appendTo("#carouselIndicators");
                }
                View.General.seoValuesSet(Controller.Config.generalNodeGet(data));
                View.General.bannerCookiesLoad(data);
            }
        };

        /* Establece el elemento activo para el caroussel */
        var elementActiveSet = function(sParam, elemActual) {
            if (sParam != undefined && sParam != '' && $.isNumeric(sParam)) {
                return (parseInt(sParam) == elemActual) ? ' active' : '';
            } else {
                return (elemActual == 0) ? ' active' : '';
            }
        };

        /** FUNCIONES PUBLICAS */
        Detail = {
            /** == Crea la lista de elementos de una galería == */
            gallerySet: function(data, sParam, sNews) {
                //El nodo root es config
                data.find('gallery').each(function() {
                    var gallery_name = $(this).attr("name");

                    if (Comun.htmlReplace(gallery_name) == sParam) {
                        var colImages = new Array;
                        var iCol = 0;

                        //Coleccion de la galeria
                        $(this).children().each(function() {
                            var IDImage = $(this).attr("id");
                            var hImage = typesHash.get(IDImage);
                            if (hImage != null) {
                                var idImage = hImage.SRC;
                                var datUpdateImage = hImage.UPDATE;
                                var datPublicImage = hImage.PUBLIC;
                                var captionImage = hImage.CAPTION;
                                var linkUrlImage = hImage.LINKURL;
                                var infoTextImage = hImage.INFOTEXT;
                                var widthImage = hImage.WIDTH;
                                var heightImage = hImage.HEIGHT;

                                colImages[iCol] = [{
                                    id: idImage,
                                    update: datUpdateImage,
                                    public: datPublicImage,
                                    titulo: captionImage,
                                    linkurl: linkUrlImage,
                                    infoimagen: infoTextImage,
                                    width: widthImage,
                                    height: heightImage
                                }];
                                iCol++;
                            }
                        });

                        pageBuild(data, colImages, $(this), sNews);
                    }
                });
            },
            /** == Crea la lista de elementos de una galería == */
            imageSet: function(data, sParam, sNews, photo) {
                //El nodo root es config
                data.find('gallery').each(function() {
                    var gallery_name = $(this).attr("name");

                    if (Comun.htmlReplace(gallery_name) == sParam) {
                        var colImages = new Array;
                        var iCol = 0;
                        var iPhoto = 0;

                        //Coleccion de la galeria
                        $(this).children().each(function() {
                            var IDImage = $(this).attr("id");
                            var hImage = typesHash.get(IDImage);
                            if (hImage != null && iPhoto == photo) {
                                var idImage = hImage.SRC;
                                var datUpdateImage = hImage.UPDATE;
                                var datPublicImage = hImage.PUBLIC;
                                var captionImage = hImage.CAPTION;
                                var linkUrlImage = hImage.LINKURL;
                                var infoTextImage = hImage.INFOTEXT;
                                var widthImage = hImage.WIDTH;
                                var heightImage = hImage.HEIGHT;

                                colImages[iCol] = [{
                                    id: idImage,
                                    update: datUpdateImage,
                                    public: datPublicImage,
                                    titulo: captionImage,
                                    linkurl: linkUrlImage,
                                    infoimagen: infoTextImage,
                                    width: widthImage,
                                    height: heightImage
                                }];
                                iCol++;
                            }
                            iPhoto++;
                        });

                        pageBuild(data, colImages, $(this), sNews, photo);
                    }
                });
            },
            /* Crea la lista de elementos de novedades ======== */
            newsSet: function(data, sParam, sNews) {
                var colImages = new Array;
                var iCol = 0;
                //El nodo root es config
                data.find('img').each(function() {
                    var IDImage = $(this).attr("id");
                    var hImage = typesHash.get(IDImage);
                    if (hImage != null) {
                        var idImage = hImage.SRC;
                        var datUpdateImage = hImage.UPDATE;
                        var datPublicImage = hImage.PUBLIC;
                        var captionImage = hImage.CAPTION;
                        var linkUrlImage = hImage.LINKURL;
                        var infoTextImage = hImage.INFOTEXT;
                        var widthImage = hImage.WIDTH;
                        var heightImage = hImage.HEIGHT;
                        var parentFolder = Comun.htmlReplace(($(this).parent()).attr("name"));
                        var parentNameFolder = Controller.Config.imagePathSet($(this), App.Config.separadorPathPanel);

                        colImages[iCol] = [{
                            id: idImage,
                            update: datUpdateImage,
                            public: datPublicImage,
                            titulo: captionImage,
                            linkurl: linkUrlImage,
                            infoimagen: infoTextImage,
                            width: widthImage,
                            height: heightImage,
                            parentFolder: parentFolder,
                            parentName: parentNameFolder
                        }];
                        iCol++;
                    }
                });
                //Ordenar colección
                colImages.sort(Comun.arrayDateSort);

                pageBuild(data, colImages, '', sNews);
            }
        }
        return Detail;
    })()
}