//hashTable de fotos
var typesHash = new Hashtable();
/* == Evento de window ============================== */
$(window).ready(function() {
    initialize();
    //Cargar tabla imagenes
    imagenesCargar(typesHash);

    var sGallery = queryStringParamGet('gallery');
    if (queryStringParamValue(sGallery)) {
        galeriaCargar(sGallery, queryStringParamGet('news'));
    } else {
        var sNews = queryStringParamGet('news');
        if (queryStringParamValue(sNews)) {
            newsCargar(sNews, queryStringParamGet('news'))
        }
    }
});

$(window).resize(function() {
    $('.carousel-inner').height(sliderHeight);
    $('.carousel-item').height(sliderHeight);
});

/** == Inicializa estados generales =============== */
initialize = function() {
    $('#annio').text(App.Config.annio);
    $('#version').text(App.Config.version);
}

/** == Calculo de dimension ======================= */
sliderHeight = function() {
    var detail = $('.detail').height();
    var footer = $('footer').height();
    var navbar = $('.navbar').height();
    var breadcrumb = $('.breadcrumb').height();

    return (detail - navbar - breadcrumb - footer);
}

/** == Crea la lista de elementos de una galería == */
galeriaCargar = function(sParam, sNews) {
    $.ajax({
        type: "GET",
        url: App.Config.rutaCnf,
        dataType: "xml",
        success: function(xml) {
            //El nodo root es config
            $(xml).find('gallery').each(function() {
                var gallery_name = $(this).attr("name");

                if (htmlReplace(gallery_name) == sParam) {
                    //breadcrump                    
                    var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
                    $(breadcrumbsEstablecer($(this), sNews)).appendTo(panBreadCrumb);

                    //dimension
                    $('.carousel-inner').height(sliderHeight);
                    $('.carousel-item').height(sliderHeight);

                    //vinculos social-media
                    var dataText = '';
                    if (($(this).parent()).attr("name") != undefined) {
                        dataText = App.Config.dataTextTitle + ($(this).parent()).attr("name") + ":" + gallery_name;
                    } else {
                        dataText = App.Config.dataTextTitle + gallery_name;
                    }

                    //establecer valores para SEO
                    seoValoresEstablecer($(this));

                    var iElem = 0;

                    //Coleccion de la galeria
                    $(this).children().each(function() {
                        var IDImage = $(this).attr("id");
                        var hImage = typesHash.get(IDImage);
                        if (hImage != null) {
                            var image = hImage.SRC;
                            var imgName = hImage.SRC.replace(".jpg", "");
                            var sName = hImage.CAPTION;
                            var sWidth = hImage.WIDTH;

                            var sActive = (iElem == 0) ? ' active' : '';

                            $("<div class='carousel-item " + sActive + "'><img class='d-block img-fluid' id='" + imgName +
                                "' src='" + App.Config.rutaImage + imgName +
                                ".jpg' title='" + sName + "' alt='First slide'></div>").appendTo("#carouselInner");
                            $("<li data-target='#carouselSlides' class='" + sActive + "' data-slide-to='" +
                                iElem + "'></li>").appendTo("#carouselIndicators");

                            iElem++;
                        }
                    });
                    bannerCookies();
                }
            });
        }
    });
}

/* Crea el elemento de lista para novedades
  ================================================== */
newsCargar = function(sParam, sNews) {
    $.ajax({
        type: "GET",
        url: App.Config.rutaCnf,
        dataType: "xml",
        success: function(xml) {
            //breadcrump                    
            var panBreadCrumb = $("<ul class='breadcrumb'>").insertBefore("#main");
            $(breadcrumbsEstablecer('', sNews)).appendTo(panBreadCrumb);

            //dimension
            $('.carousel-inner').height(sliderHeight);
            $('.carousel-item').height(sliderHeight);

            var colImages = new Array;
            var iCol = 0;
            //El nodo root es config
            $(xml).find('img').each(function() {
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
                    var parentFolder = htmlReplace(($(this).parent()).attr("name"));
                    var parentNameFolder = pathImagenComponer($(this), App.Config.separadorPathPanel);

                    colImages[iCol] = [{
                        id: idImage,
                        update: datUpdateImage,
                        public: datPublicImage,
                        titulo: captionImage,
                        linkurl: linkUrlImage,
                        infoimagen: infoTextImage,
                        widthImage: widthImage,
                        parentFolder: parentFolder,
                        parentName: parentNameFolder
                    }];
                    iCol++;
                }
            });
            //Ordenar colección
            colImages.sort(arrayDateSort)

            var iElem = 0;

            //Cargar los N primeros
            for (var i = 0; i < colImages.length - 1 && i < App.Config.elemNuevos; i++) {
                var imgName = colImages[i][0].id.replace(".jpg", "");
                var sName = colImages[i][0].captionImage;

                colImages[i][0].widthImage

                var sActive = (iElem == 0) ? ' active' : '';

                $("<div class='carousel-item " + sActive + "'><img class='d-block img-fluid' id='" + imgName +
                    "' src='" + App.Config.rutaImage + imgName +
                    ".jpg' title='" + sName + "' alt='First slide'></div>").appendTo("#carouselInner");
                $("<li data-target='#carouselSlides' class='" + sActive + "' data-slide-to='" +
                    iElem + "'></li>").appendTo("#carouselIndicators");

                iElem++;
            }
            bannerCookies();
        }
    });
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

seoValoresEstablecer = function(elemento) {
    document.title = elemento.attr("title");
    $('meta[name="description"]').attr("content", elemento.attr("infotext"));
    $('meta[name="keywords"]').attr("content", elemento.attr("keywords"));
}