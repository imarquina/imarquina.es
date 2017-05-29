// JavaScript Document
//hashTable de fotos
var typesHash = new Hashtable();
var dataXml;
/* Evento de window
================================================== */
$(window).ready(function() {
    View.General.initialize();

    //Carga colección elementos
    var photoXml = Database.Photos.load();
    typesHash = Controller.Photos.load(photoXml);
    //Carga album elementos
    dataXml = Database.Config.load();

    View.General.menuCargar(dataXml);
    View.General.sloganLoad(dataXml);

    if (document.URL.toLowerCase().indexOf("detail.html") > 0) {
        var sGallery = Comun.queryStringParamGet('gallery');
        if (Comun.queryStringParamValue(sGallery)) {
            View.Detail.galeriaCargar(dataXml, sGallery, Comun.queryStringParamGet('news'));
        } else {
            var sNews = Comun.queryStringParamGet('news');
            if (Comun.queryStringParamValue(sNews)) {
                View.Detail.newsCargar(dataXml, sNews, Comun.queryStringParamGet('news'))
            }
        }
    } else {
        var sGallery = Comun.queryStringParamGet('gallery');
        if (Comun.queryStringParamValue(sGallery)) {
            View.Index.galeriaCargar(dataXml, sGallery, Comun.queryStringParamGet('news'));

            //Cargar imagen si se indica en el QueryString
            var sIndex = Comun.queryStringParamGet('index');
            if (Comun.queryStringParamValue(sIndex)) {
                var oImagen = $('#' + sIndex);
                if (View.General.imageValidar(oImagen)) {
                    View.General.nodoImagenLocalizar(dataXml, App.Constantes.origenInicio, sGallery, sIndex);
                }
            }
        } else {
            var sFolder = Comun.queryStringParamGet('folder');
            if (Comun.queryStringParamValue(sFolder)) {
                View.Index.folderCargar(dataXml, sFolder, Comun.queryStringParamGet('news'));
            } else {
                var sMultiMed = Comun.queryStringParamGet('multimedia');
                if (Comun.queryStringParamValue(sMultiMed)) {
                    View.Index.multimediaCargar(dataXml, sMultiMed, Comun.queryStringParamGet('news'));
                } else {
                    var sNews = Comun.queryStringParamGet('news');
                    if (Comun.queryStringParamValue(sNews)) {
                        View.Index.newsCargar(dataXml, sNews);
                    } else {
                        View.Index.lastCargar(dataXml);
                        View.Index.homeCargar(dataXml);
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

var View = {
    General: (function() {
        General = {
            /* Inicializa estados generales */
            initialize: function() {
                var lightbox = lity();

                $("<div id='titulo' class='header-texto-titulo'>" + App.Config.dataTextTitle + "</div>").appendTo("#header");
                $("<small id='subtitulo' class='header-texto-subtitulo'>" +
                    App.Config.dataTextSubtitle.toLowerCase() + "</small>").appendTo("#header");
                $("<p class='card-text'><small>@<span id='annio'>" + App.Config.annio + "</span> " +
                    App.Config.author + " v<span id='version'>" + App.Config.version +
                    "</span></small></p>").prependTo("#copyright");
            },
            /* Encuentra los elementos de primer nivel y los incluye en el elemento del menu */
            menuCargar: function(data) {
                //El nodo root es config
                data.find('config').each(function() {
                    //recorrer los nodos de primer nivel
                    $(this).children().each(function() {
                        var nObj = this;
                        //tratamiento en función del tipo de nodo
                        switch (nObj.nodeName) {
                            case 'galleries':
                                $(nObj).children().each(function() {
                                    var nGls = this;
                                    switch (nGls.nodeName) {
                                        case 'folder':
                                            var sName = $(nGls).attr("name");
                                            $("<li><span class='fa " + App.Constantes.iconGalleries + "' /><a href='./index.html?folder=" +
                                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                            break;
                                        case 'gallery':
                                            var sName = $(nGls).attr("name");
                                            $("<li><span class='fa " + App.Constantes.iconGallery + "' /><a href='./index.html?gallery=" +
                                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                            break;
                                        case 'multimedia':
                                            var sName = $(nGls).attr("name");
                                            $("<li><span class='fa " + App.Constantes.iconVideo + "' /><a href='./index.html?multimedia=" +
                                                Comun.htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                            break;
                                    }
                                });
                                break;
                        }
                    });
                });
            },
            sloganLoad: function(data) {
                var elemento = Controller.Config.sloganLoad(data);

                var sTexto = elemento.texto;
                $(sTexto).appendTo('#slogan');
            },
            /* Busca el node de una imagen en base a su nombre de archivo */
            nodoImagenLocalizar: function(data, origen, sParamGaleria, sParamImagen) {
                var imagenLocalizada = 0;
                //El nodo root es config
                data.find('gallery').each(function() {
                    var gallery_name = $(this).attr("name");

                    if (Comun.htmlReplace(gallery_name) == sParamGaleria) {
                        //Coleccion de la galeria
                        $(this).children().each(function() {
                            //Romper el bucle
                            if (imagenLocalizada == 1) return false;
                            //Path de la imagen
                            var parentNameFolder = Controller.Config.pathImagenComponer($(this), App.Config.separadorPathEnlace);
                            //Nombre archivo
                            var imagen_name = $(this).attr("src").replace(".jpg", "");
                            if (imagen_name == sParamImagen) {
                                View.General.imagenPreview(origen, imagen_name, $(this).attr("width"), $(this).attr("height"),
                                    sParamGaleria, $(this).attr("caption"), parentNameFolder);
                                imagenLocalizada = 1;
                                return false;
                            }
                        });
                    }
                    if (imagenLocalizada == 1) return false;
                });
            },
            /* Establece y muestra el popup para una imagen */
            imagenPreview: function(origen, imagenSrc, imagenWidth, imagenHeight, galleryCode, imagenTitle, galleryName) {
                imageDialog = $("#dialog");

                switch (origen) {
                    case App.Constantes.origenInicio:
                    case App.Constantes.origenGaleria:
                        //organizar capas
                        capasPopUpAjustar('imagen');
                        imageTag = $('#image');
                        //vinculos social-media
                        $('#shareme-popup').attr("data-url", App.Config.home + "?gallery=" + galleryCode + '&index=' + imagenSrc);
                        $('#shareme-popup').attr("data-text", App.Config.dataTextTitle + galleryName + ": " + imagenTitle);
                        $("#shareme-popup").attr("data-image", App.Config.home + "/images/" + imagenSrc + '.jpg');
                        break;
                    case App.Constantes.origenNews:
                        //organizar capas
                        capasPopUpAjustar('enlace');
                        imageTag = $('#image');
                        $("<a href='./index.html?gallery=" + galleryCode + "'><span class='enlace-galeria'>Ver y compartir en &aacute;lbum<br />" + ((galleryName.length > 50) ? galleryName.substr(0, 47) + "..." : galleryName) + "</span></a>").appendTo("#enlace");
                        break;
                }

                var dialogWidth = 'auto';
                if (imagenWidth > $(window).width()) {
                    dialogWidth = $(window).width() - 10;
                }

                //Set the image src
                imageTag.attr("src", App.Config.rutaImage + imagenSrc + '.jpg');

                //When the image has loaded, display the dialog
                imageTag.load(function() {
                    $('#dialog').dialog({
                        modal: true,
                        resizable: false,
                        draggable: false,
                        width: dialogWidth,
                        minWidth: "300px",
                        /*title: uriParts[uriParts.length - 1]*/
                        title: imagenTitle
                    });
                });
                if (origen != App.Constantes.origenNews) socialMediaPopup();
            },
            /* Evalua si el objeto imagen es válido */
            imageValidar: function(oImagen) {
                if (oImagen != undefined) return true;
                else return false;
            }
        }
        return General;
    })(),
    Index: (function() {
        /** FUNCIONES PRIVADAS */
        var paginaComponer = function(colImages, nodo, sNews) {
            //breadcrump                    
            var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
            $(Comun.breadcrumbsEstablecer(nodo, sNews)).appendTo(panBreadCrumb);

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
                Comun.seoValoresEstablecer(nodo);
            }
            Cookies.bannerCookies();
        };
        /** FUNCIONES PUBLICAS */
        Index = {
            homeCargar: function(data) {
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
                                imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
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
                                imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
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
                                imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
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
                                    View.Index.createModal(data, Comun.htmlReplace(sNameS));
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
                            View.Index.createModal(data, Comun.htmlReplace(sName));
                            break;
                    }
                }
                Cookies.bannerCookies();
            },
            /* Crea la lista de elementos de una galería */
            galeriaCargar: function(data, sParam, sNews) {
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
                    var divImage = $("<div class='card-image'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                        imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                    //Marcador de secuencia                            
                    var divSecuencia = $("<div class='secuencia' title='ver secuencia'>").appendTo(divImage);
                    $("<span class='fa fa-chevron-left'>").appendTo(divSecuencia);
                    $("<span class='fa fa-chevron-right'>").appendTo(divSecuencia);

                    //vinculo
                    if (sNews != undefined) {
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + i + "&news=" + sNews + "'>");
                    } else {
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + i + "'>");
                    }
                    /** bloque */
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconImage + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
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
                    $(Comun.infoLinkTratar(sLnkUrl)).appendTo(panSocial);
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + Comun.dateFormat(sUpdate) + "</small>").appendTo(panDate);
                }
                paginaComponer('', Controller.Config.galleryFind(data, sParam), sNews);
            },
            /* Crea la lista de elementos de una carpeta */
            folderCargar: function(data, sParam, sNews) {
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
                paginaComponer('', Controller.Config.folderFind(data, sParam), sNews);
            },
            /* Crea la lista de elementos de una galería
            /* El segundo parámetro sirve para crear la
            /* miga de pan */
            multimediaCargar: function(data, sParam, sNews) {
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
                paginaComponer('', Controller.Config.multimediaFind(data, sParam), sNews);
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
            newsCargar: function(data, sParam) {
                var colImages = Controller.Config.newsLoad(data);
                //Ordenar colección
                colImages.sort(Comun.arrayDateSort);

                paginaComponer('');

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
                    $("<span class='fa " + App.Constantes.icoImagen + "'></span>").appendTo(panTitulo);
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
                        $(divImage).wrap("<a href='./detail.html?news=" + sParam + "&photo=" + iCnt + "'>");
                        $(txtEnlace).wrap("<a href='./index.html?gallery=" + colImages[i][0].parentFolder +
                            "&news=" + sParam + "'>");

                        //Capa social-media
                        var panSocial = $("<div class='col-4 text-left'>").appendTo(panFooter);
                        $(Comun.infoLinkTratar(colImages[i][0].linkurl)).appendTo(panSocial);

                        iCnt++;
                    }

                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + Comun.dateFormat(colImages[i][0].update) + "</small>").appendTo(panDate);

                }
            },
            /* Establece y muestra el popup para un texto */
            createModal: function(data, sParam) {
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
        var paginaComponer = function(colImages, nodo, sNews) {
            //breadcrump                    
            var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
            $(Comun.breadcrumbsEstablecer(nodo, sNews)).appendTo(panBreadCrumb);

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

                //establecer valores para SEO
                Comun.seoValoresEstablecer(nodo);
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

                var sActive = establecerElementoActivo(Comun.queryStringParamGet('photo'), i);

                $("<div class='carousel-item " + sActive + "'><img class='d-block img-fluid' id='" + imgName +
                    "' src='" + App.Config.rutaImage + imgName +
                    ".jpg' height='" + sHeight + "' width='" + sWidth + "' title='" + sName + "' alt='First slide'></div>").appendTo("#carouselInner");
                $("<li data-target='#carouselSlides' class='" + sActive + "' data-slide-to='" +
                    i + "'></li>").appendTo("#carouselIndicators");
            }
            Cookies.bannerCookies();
        };

        /* Establece el elemento activo para el caroussel */
        var establecerElementoActivo = function(sParam, elemActual) {
            if (sParam != undefined && sParam != '' && $.isNumeric(sParam)) {
                return (parseInt(sParam) == elemActual) ? ' active' : '';
            } else {
                return (elemActual == 0) ? ' active' : '';
            }
        };

        /** FUNCIONES PUBLICAS */
        Detail = {
            /** == Crea la lista de elementos de una galería == */
            galeriaCargar: function(data, sParam, sNews) {
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

                        paginaComponer(colImages, $(this), sNews);
                    }
                });
            },
            /* Crea la lista de elementos de novedades ======== */
            newsCargar: function(data, sParam, sNews) {
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
                        var parentNameFolder = Controller.Config.pathImagenComponer($(this), App.Config.separadorPathPanel);

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

                paginaComponer(colImages, '', sNews);
            }
        }
        return Detail;
    })()
}