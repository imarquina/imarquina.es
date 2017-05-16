// JavaScript Document
//hashTable de fotos
var typesHash = new Hashtable();
var dataXml;
/* Evento de window
================================================== */
$(window).ready(function() {
    initialize();
    //Cargar tabla imagenes
    imagenesCargar(typesHash);
    dataXml = loadXml();

    var sGallery = queryStringParamGet('gallery');
    if (queryStringParamValue(sGallery)) {
        galeriaCargar(sGallery, queryStringParamGet('news'));

        //Cargar imagen si se indica en el QueryString
        var sIndex = queryStringParamGet('index');
        if (queryStringParamValue(sIndex)) {
            var oImagen = $('#' + sIndex);
            if (imageValidar(oImagen)) {
                nodoImagenLocalizar(App.Constantes.origenInicio, sGallery, sIndex);
            }
        }
        menuCargar();
    } else {
        var sFolder = queryStringParamGet('folder');
        if (queryStringParamValue(sFolder)) {
            folderCargar(sFolder, queryStringParamGet('news'));
        } else {
            var sMultiMed = queryStringParamGet('multimedia');
            if (queryStringParamValue(sMultiMed)) {
                multimediaCargar(sMultiMed, queryStringParamGet('news'));
            } else {
                var sNews = queryStringParamGet('news');
                if (queryStringParamValue(sNews)) {
                    newsCargar(sNews);
                } else {
                    newsMostrar();
                    homeCargar();
                }
            }
        }
        menuCargar();
    }
});

/* Inicializa estados generales
================================================== */
initialize = function() {
    //
    $('#annio').text(App.Config.annio);
    $('#version').text(App.Config.version);
}

/* Evalua si el objeto imagen es válido
================================================== */
imageValidar = function(oImagen) {
    if (oImagen != undefined) return true;
    else return false;
}

/* Establece y muestra el popup para una imagen
================================================== */
imagenPreview = function(origen, imagenSrc, imagenWidth, imagenHeight, galleryCode, imagenTitle, galleryName) {
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

}

/* Establece y muestra el popup para un texto
================================================== */
createModal = function(sParam) {
    //El nodo root es config
    dataXml.find('section').each(function() {
        var section_name = $(this).attr("name");

        if (htmlReplace(section_name) == sParam) {
            var sTitulo = $(this).attr("name").toUpperCase();

            var divModal = $("<div class='modal fade " + sParam + "' tabindex='-1' role='dialog' aria-labelledby='myLargeModalLabel' aria-hidden='true'>").appendTo('#main');
            var divModalDialog = $("<div class='modal-dialog modal-lg'>").appendTo(divModal);
            var divModalContent = $("<div class='modal-content'>").appendTo(divModalDialog);
            var divModalHeader = $("<div class='modal-header'>").appendTo(divModalContent);
            $("<h5 class='modal-title'>" + sTitulo + "</h5>").appendTo(divModalHeader);
            var divModalButton = $("<button type='button' class='close' data-dismiss='modal' aria-label='Close'>").appendTo(divModalHeader);
            $("<span aria-hidden='true'>&times;</span>").appendTo(divModalButton);
            var divModalBody = $("<div class='modal-body'>").appendTo(divModalContent);
            var sTexto = $(this).text();
            $(sTexto).appendTo(divModalBody);
            $("<div class='modal-footer'>").appendTo(divModalContent);
        }
    });
}

/* Creal el HTML con el esquema de elementos y los
items de la coleccion ============================== */
paginaComponer = function(colImages, nodo, sNews) {
    //breadcrump                    
    var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
    $(breadcrumbsEstablecer(nodo, sNews)).appendTo(panBreadCrumb);

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
        seoValoresEstablecer(nodo);
    }
}

/* Crea la lista de elementos de una galería
/* El segundo parámetro sirve para crear la
/* miga de pan
  ================================================== */
galeriaCargar = function(sParam, sNews) {
    //El nodo root es config
    dataXml.find('gallery').each(function() {
        var gallery_name = $(this).attr("name");

        if (htmlReplace(gallery_name) == sParam) {
            //Coleccion de la galeria
            var iElem = 0;
            $(this).children().each(function() {
                var IDImage = $(this).attr("id");
                var hImage = typesHash.get(IDImage);
                if (hImage != null) {
                    //var image=$(this).attr("src");
                    var imgName = hImage.SRC.replace(".jpg", "");
                    var sName = hImage.CAPTION;
                    var sInfT = hImage.INFOTEXT;
                    var sFormat = hImage.FORMAT;
                    var sStock = hImage.STOCK;
                    var sPrice = hImage.PRICE;
                    var sLnkUrl = hImage.LINKURL;
                    var sUpdate = hImage.UPDATE;

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
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + iElem + "&news=" + sNews + "'>");
                    } else {
                        $(divImage).wrap("<a href='./detail.html?gallery=" + sParam + "&photo=" + iElem + "'>");
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
                    $(infoLinkTratar(hImage.LINKURL)).appendTo(panSocial);
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
                    $("<small class='text-muted'>" + dateFormat(sUpdate) + "</small>").appendTo(panDate);

                    iElem++;
                }
            });
            paginaComponer('', $(this), sNews);
        }
    });
}

/* Crea la lista de elementos de una carpeta
  ================================================== */
folderCargar = function(sParam, sNews) {
    //El nodo root es config
    dataXml.find('folder').each(function() {
        var folder_name = $(this).attr("name");

        if (htmlReplace(folder_name) == sParam) {
            //Coleccion de la carpeta				
            $(this).children().each(function() {
                var nObj = this;
                if (nObj.nodeName == 'gallery') {
                    var sName = $(nObj).attr("name");
                    var image = $(nObj).attr("src");
                    var imgName = $(nObj).attr("src").replace(".jpg", "");

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");

                    /** imagen */
                    var divImage = $("<div class='card-image'>").appendTo(divCard);
                    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                        imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                    //vinculo
                    if (sNews != undefined) {
                        $(divImage).wrap("<a href='./index.html?gallery=" + htmlReplace(sName) + "&news=" + sNews + "'>");
                    } else {
                        $(divImage).wrap("<a href='./index.html?gallery=" + htmlReplace(sName) + "'>");
                    }
                    /** bloque */
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    //Titulo
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconGallery + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                    //Pie
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                    $("<small class='text-muted'>" + dateFormat($(nObj).attr("update")) + "</small>").appendTo(panDate);
                }
            });
            paginaComponer('', $(this), sNews);
        }
    });
}

/* Crea la lista de elementos de una galería
/* El segundo parámetro sirve para crear la
/* miga de pan
  ================================================== */
multimediaCargar = function(sParam, sNews) {
    //El nodo root es config
    dataXml.find('multimedia').each(function() {
        var multimedia_name = $(this).attr("name");

        if (htmlReplace(multimedia_name) == sParam) {
            //Coleccion de la galeria
            var iElem = 0;
            var templateTpt = '';
            $(this).children().each(function() {
                var IDImage = $(this).attr("id");
                var hImage = typesHash.get(IDImage);
                if (hImage != null) {
                    //var image=$(this).attr("src");
                    var imgName = hImage.SRC.replace(".jpg", "");
                    var sName = hImage.CAPTION;
                    var sInfT = hImage.INFOTEXT;
                    var sFormat = hImage.FORMAT;
                    var sStock = hImage.STOCK;
                    var sPrice = hImage.PRICE;
                    var sLnkUrl = hImage.LINKURL;
                    var sUpdate = hImage.UPDATE;

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
                    $("<small class='text-muted'>" + dateFormat(sUpdate) + "</small>").appendTo(panDate);
                    //Crear vínculo carpeta
                    $(divCard).wrap("<a data-lity href='" + hImage.LINKURL + "'>");

                    iElem++;
                }
            });
            paginaComponer('', $(this), sNews);
        }
    });
}

/* Crea la lista de elementos de la home: carpetas,
/* galerias
  ================================================== */
homeCargar = function() {
    //vinculos social-media
    $('#shareme').attr("data-url", App.Config.home);
    $('#shareme').attr("data-text", App.Config.dataTextTitle + App.Config.dataTextHome);

    //El nodo root es config
    dataXml.find('config').each(function() {
        //establecer valores para SEO
        seoValoresEstablecer($(this));
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
                                var image = $(nGls).attr("src");
                                var imgName = $(nGls).attr("src").replace(".jpg", "");

                                var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                                var divImage = $("<div class='card-image'>").appendTo(divCard);
                                $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                    imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                                var divBlock = $("<div class='card-block'>").appendTo(divCard);
                                var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                                $("<span class='fa " + App.Constantes.iconGalleries + "'></span>").appendTo(panTitulo);
                                $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                                //Capa de thumbs de galeria
                                if ($(nGls).find("gallery").length > 0) {
                                    var panThumbs = $("<div class='row thumbs'>").appendTo(divBlock);
                                    var iCnt = 0;
                                    $(nGls).children().each(function() {
                                        var nGal = this;
                                        if (nGal.nodeName == 'gallery' && iCnt < 4) {
                                            var divThumb = $("<div class='col-3'>").appendTo(panThumbs);
                                            $("<img class='img-fluid' src='" + App.Config.rutaThumb +
                                                $(nGal).attr("src") + "' title='" + $(nGal).attr("name") +
                                                "' alt='" + $(nGal).attr("name") + "'>").appendTo(divThumb);
                                            iCnt++;
                                        }
                                    });
                                    while (iCnt < 4) {
                                        var divThumb = $("<div class='col-3'>").appendTo(panThumbs);
                                        $("<img class='img-fluid' src='resources/000000000.png' alt='no imagen'>").appendTo(divThumb);
                                        iCnt++;
                                    }
                                }
                                var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                                $("<small class='text-muted'>" + dateFormat($(nGls).attr("update")) +
                                    "</small>").appendTo(panDate);

                                //Crear vínculo carpeta
                                $(divCard).wrap("<a href='./index.html?folder=" + htmlReplace(sName) + "'>");
                                break;
                            case 'gallery':
                                var sName = $(nGls).attr("name");
                                var image = $(nGls).attr("src");
                                var imgName = $(nGls).attr("src").replace(".jpg", "");

                                var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                                var divImage = $("<div class='card-image'>").appendTo(divCard);
                                $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                    imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                                var divBlock = $("<div class='card-block'>").appendTo(divCard);
                                var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                                $("<span class='fa " + App.Constantes.iconGallery + "'></span>").appendTo(panTitulo);
                                $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                                var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                                $("<small class='text-muted'>" + dateFormat($(nGls).attr("update")) + "</small>").appendTo(panDate);

                                //Crear vínculo carpeta
                                $(divCard).wrap("<a href='./index.html?gallery=" + htmlReplace(sName) + "'>");
                                break;
                            case 'multimedia':
                                var sName = $(nGls).attr("name");
                                var image = $(nGls).attr("src");
                                var imgName = $(nGls).attr("src").replace(".jpg", "");

                                var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                                var divImage = $("<div class='card-video'>").appendTo(divCard);
                                $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
                                    imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
                                var divBlock = $("<div class='card-block'>").appendTo(divCard);
                                var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                                $("<span class='fa " + App.Constantes.iconVideo + "'></span>").appendTo(panTitulo);
                                $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                                var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                                $("<small class='text-muted'>" + dateFormat($(nGls).attr("update")) + "</small>").appendTo(panDate);

                                //Crear vínculo carpeta
                                $(divCard).wrap("<a href='./index.html?multimedia=" + htmlReplace(sName) + "'>");
                                break;
                        }
                    });
                    break;
                case 'folder':
                    var sName = $(nObj).attr("name");

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconText + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);

                    //Capa de thumbs de galeria
                    if ($(nObj).find("section").length > 0) {
                        var lstSec = $("<ul>").appendTo(divBlock);
                        $(nObj).children().each(function() {
                            if (this.nodeName == 'section') {
                                var elmLst = $("<li>" + $(this).attr("name") + "</li>").appendTo(lstSec);

                                var nSec = $(this);
                                //Crear vínculo
                                $(elmLst).wrap("<a href='#' data-toggle='modal' data-target='." + htmlReplace(nSec.attr("name")) + "'>");

                                //Modal
                                createModal(htmlReplace(nSec.attr("name")));
                            }
                        });
                    }

                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                    $("<small class='text-muted'>" + dateFormat($(nObj).attr("update")) + "</small>").appendTo(panDate);

                    break;
                case 'section':
                    var sName = $(nObj).attr("name");

                    var divCard = $("<div class='card p-1'>").appendTo("#tiles");
                    var divBlock = $("<div class='card-block'>").appendTo(divCard);
                    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
                    $("<span class='fa " + App.Constantes.iconInfo + "'></span>").appendTo(panTitulo);
                    $("<span class='col-11'>" + sName + "</span>").appendTo(panTitulo);
                    var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
                    $("<small class='text-muted'>" + dateFormat($(nObj).attr("update")) + "</small>").appendTo(panDate);

                    //Crear vínculo
                    $(divCard).wrap("<a href='#' data-toggle='modal' data-target='." + htmlReplace(sName) + "'>");

                    //Modal
                    createModal(htmlReplace(sName));
                    break;
            }
        });
    });
}

/* Encuentra los elementos de primer nivel y los
incluye en el elemento del menu
  ================================================== */
menuCargar = function() {
    //El nodo root es config
    dataXml.find('config').each(function() {
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
                                    htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                break;
                            case 'gallery':
                                var sName = $(nGls).attr("name");
                                $("<li><span class='fa " + App.Constantes.iconGallery + "' /><a href='./index.html?gallery=" +
                                    htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                break;
                            case 'multimedia':
                                var sName = $(nGls).attr("name");
                                $("<li><span class='fa " + App.Constantes.iconVideo + "' /><a href='./index.html?multimedia=" +
                                    htmlReplace(sName) + "'>" + sName + "</a></li>").appendTo("#menu");
                                break;
                        }
                    });
                    break;
            }
        });
    });
}

/* Crea la lista de elementos en base al dato PUBLIC
  ================================================== */
newsMostrar = function() {
    var colImages = new Array;
    var iCol = 0;
    //El nodo root es config
    dataXml.find('img').each(function() {
        var IDImage = $(this).attr("id");
        var hImage = typesHash.get(IDImage);
        if (hImage != null) {
            var idImage = hImage.SRC;
            var datPublicImage = hImage.PUBLIC;
            var datUpdateImage = hImage.UPDATE;
            var captionImage = hImage.CAPTION;

            colImages[iCol] = [{ id: idImage, update: datUpdateImage, public: datPublicImage, titulo: captionImage, type: 'imagen' }];
            iCol++;
        }
    });
    dataXml.find('vid').each(function() {
        var IDImage = $(this).attr("id");
        var hImage = typesHash.get(IDImage);
        if (hImage != null) {
            var idImage = hImage.SRC;
            var datPublicImage = hImage.PUBLIC;
            var datUpdateImage = hImage.UPDATE;
            var captionImage = hImage.CAPTION;

            colImages[iCol] = [{ id: idImage, update: datUpdateImage, public: datPublicImage, titulo: captionImage, type: 'video' }];
            iCol++;
        }
    });
    //Ordenar colección
    colImages.sort(arrayDateSort)

    //Cargar panel con primera imagen
    var sName = colImages[0][0].titulo;
    var image = colImages[0][0].id;
    var imgName = image.replace(".jpg", "");
    var typeCss = (colImages[0][0].type == 'video') ? 'card-video' : 'card-image';

    var divCard = $("<div class='card p-1'>").appendTo("#tiles");
    var divImage = $("<div class='" + typeCss + "'>").appendTo(divCard);
    $("<img class='card-img-top img-fluid' id='" + imgName + "' src='" + App.Config.rutaImage +
        imgName + ".jpg' title='" + sName + "' alt='Columnas Css' />").appendTo(divImage);
    var divBlock = $("<div class='card-block'>").appendTo(divCard);
    var panTitulo = $("<h4 class='card-title'>").appendTo(divBlock);
    $("<span class='fa " + App.Constantes.iconNew + "'></span>").appendTo(panTitulo);
    $("<span class='col-11'>Lo &uacute;ltimo</span>").appendTo(panTitulo);
    var panDate = $("<p class='card-date card-text text-right'>").appendTo(divBlock);
    $("<small class='text-muted'>" + dateFormat(colImages[0][0].update) + "</small>").appendTo(panDate);

    //Crear vínculo carpeta
    $(divCard).wrap("<a href='./index.html?news=" + colImages[0][0].update + "'>");
}

/* Crea el elemento de lista para novedades
  ================================================== */
newsCargar = function(sParam) {
    var colImages = new Array;
    var iCol = 0;
    //El nodo root es config
    var colImages = new Array;
    var iCol = 0;
    //El nodo root es config
    dataXml.find('img').each(function() {
        var IDImage = $(this).attr("id");
        var hImage = typesHash.get(IDImage);
        if (hImage != null) {
            var idImage = hImage.SRC;
            var datUpdateImage = hImage.UPDATE;
            var datPublicImage = hImage.PUBLIC;
            var captionImage = hImage.CAPTION;
            var linkUrlImage = hImage.LINKURL;
            var infoTextImage = hImage.INFOTEXT;
            var parentFolder = htmlReplace(($(this).parent()).attr("name"));
            var parentNameFolder = pathImagenComponer($(this), App.Config.separadorPathPanel);
            var sType = 'imagen';

            colImages[iCol] = [{
                id: idImage,
                update: datUpdateImage,
                public: datPublicImage,
                titulo: captionImage,
                linkurl: linkUrlImage,
                infoimagen: infoTextImage,
                parentFolder: parentFolder,
                parentName: parentNameFolder,
                type: sType
            }];
            iCol++;
        }
    });
    dataXml.find('vid').each(function() {
        var IDImage = $(this).attr("id");
        var hImage = typesHash.get(IDImage);
        if (hImage != null) {
            var idImage = hImage.SRC;
            var datUpdateImage = hImage.UPDATE;
            var datPublicImage = hImage.PUBLIC;
            var captionImage = hImage.CAPTION;
            var linkUrlImage = hImage.LINKURL;
            var infoTextImage = hImage.INFOTEXT;
            var parentFolder = htmlReplace(($(this).parent()).attr("name"));
            var parentNameFolder = pathImagenComponer($(this), App.Config.separadorPathPanel);
            var sType = 'video';

            colImages[iCol] = [{
                id: idImage,
                update: datUpdateImage,
                public: datPublicImage,
                titulo: captionImage,
                linkurl: linkUrlImage,
                infoimagen: infoTextImage,
                parentFolder: parentFolder,
                parentName: parentNameFolder,
                type: sType
            }];
            iCol++;
        }
    });
    //Ordenar colección
    colImages.sort(arrayDateSort)

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
            $(infoLinkTratar(colImages[i][0].linkurl)).appendTo(panSocial);

            iCnt++;
        }

        var panDate = $("<p class='card-date card-text text-right'>").appendTo(panFooter);
        $("<small class='text-muted'>" + dateFormat(colImages[i][0].update) + "</small>").appendTo(panDate);

    }
}

/* Compone la ruta de galería y/o colección de una
/* imagen
  ================================================== */
pathImagenComponer = function(elemNode, separador) {
    var oObj = elemNode;
    var sText = '';
    var iRow = 0;
    while ((oObj.parent()).attr("name") != undefined) {
        sText = (oObj.parent()).attr("name") + (iRow != 0 ? separador + sText : "");
        iRow++;
        oObj = oObj.parent();
    }
    return sText;
}

/* Busca el node de una imagen en base a su nombre
/* de archivo
  ================================================== */
nodoImagenLocalizar = function(origen, sParamGaleria, sParamImagen) {
    var imagenLocalizada = 0;
    //El nodo root es config
    $(xml).find('gallery').each(function() {
        var gallery_name = $(this).attr("name");

        if (htmlReplace(gallery_name) == sParamGaleria) {
            //Coleccion de la galeria
            $(this).children().each(function() {
                //Romper el bucle
                if (imagenLocalizada == 1) return false;
                //Path de la imagen
                var parentNameFolder = pathImagenComponer($(this), App.Config.separadorPathEnlace);
                //Nombre archivo
                var imagen_name = $(this).attr("src").replace(".jpg", "");
                if (imagen_name == sParamImagen) {
                    imagenPreview(origen, imagen_name, $(this).attr("width"), $(this).attr("height"),
                        sParamGaleria, $(this).attr("caption"), parentNameFolder);
                    imagenLocalizada = 1;
                    return false;
                }
            });
        }
        if (imagenLocalizada == 1) return false;
    });
}