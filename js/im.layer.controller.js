var Controller = (function() {
    function Photo(id, width, height, caption, src, linktext, linkurl, infotext, format, stock, price, update, publi) {
        this.ID = id;
        this.WIDTH = width;
        this.HEIGHT = height;
        this.CAPTION = caption;
        this.SRC = src;
        this.LINKTEXT = linktext;
        this.LINKURL = linkurl;
        this.INFOTEXT = infotext;
        this.FORMAT = format;
        this.STOCK = stock;
        this.PRICE = price;
        this.UPDATE = update;
        this.PUBLIC = publi;
    }

    function Element() {}

    return {
        Photos: {
            load: function(photos) {
                var tableHash = new Hashtable();
                //El nodo root es config
                photos.find('photos').each(function() {
                    //Coleccion de la galeria
                    var iElem = 0;
                    $(this).children().each(function() {
                        tableHash.put(
                            $(this).attr('src').replace(".jpg", ""),
                            new Photo(
                                $(this).attr('src').replace(".jpg", ""),
                                $(this).attr('width'),
                                $(this).attr('height'),
                                $(this).attr('caption'),
                                $(this).attr('src'),
                                $(this).attr('linktext'),
                                $(this).attr('linkurl'),
                                $(this).attr('infotext'),
                                $(this).attr('format'),
                                $(this).attr('stock'),
                                $(this).attr('price'),
                                $(this).attr('update'),
                                $(this).attr('public')
                            )
                        );

                        iElem++;
                    });
                    //return true;
                });
                photos.find('videos').each(function() {
                    //Coleccion de la galeria
                    var iElem = 0;
                    $(this).children().each(function() {
                        tableHash.put(
                            $(this).attr('src').replace(".jpg", ""),
                            new Photo(
                                $(this).attr('src').replace(".jpg", ""),
                                $(this).attr('width'),
                                $(this).attr('height'),
                                $(this).attr('caption'),
                                $(this).attr('src'),
                                $(this).attr('linktext'),
                                $(this).attr('linkurl'),
                                $(this).attr('infotext'),
                                $(this).attr('format'),
                                $(this).attr('stock'),
                                $(this).attr('price'),
                                $(this).attr('update'),
                                $(this).attr('public')
                            )
                        );

                        iElem++;
                    });
                    //return true;
                });

                return tableHash;
            }
        },
        Config: {
            newsLoad: function(elements) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('img').each(function() {
                    var IDImage = $(this).attr("id");
                    var hImage = typesHash.get(IDImage);
                    if (hImage != null) {
                        var idImage = hImage.SRC;
                        var captionImage = hImage.CAPTION;
                        var linkUrlImage = hImage.LINKURL;
                        var infoTextImage = hImage.INFOTEXT;
                        var datUpdateImage = hImage.UPDATE;
                        var datPublicImage = hImage.PUBLIC;
                        var parentFolder = Comun.htmlReplace(($(this).parent()).attr("name"));
                        var parentNameFolder = Controller.Config.pathImagenComponer($(this), App.Config.separadorPathPanel);
                        var sType = 'imagen';

                        colElementos[iCol] = [{
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
                elements.find('vid').each(function() {
                    var IDImage = $(this).attr("id");
                    var hImage = typesHash.get(IDImage);
                    if (hImage != null) {
                        var idImage = hImage.SRC;
                        var captionImage = hImage.CAPTION;
                        var linkUrlImage = hImage.LINKURL;
                        var infoTextImage = hImage.INFOTEXT;
                        var datUpdateImage = hImage.UPDATE;
                        var datPublicImage = hImage.PUBLIC;
                        var parentFolder = Comun.htmlReplace(($(this).parent()).attr("name"));
                        var parentNameFolder = Controller.Config.pathImagenComponer($(this), App.Config.separadorPathPanel);
                        var sType = 'video';

                        colElementos[iCol] = [{
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
                return colElementos;
            },
            allLoad: function(elements) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('config').each(function() {
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
                                            var idImage = $(nGls).attr("src");
                                            var captionImage = $(nGls).attr("name");
                                            var datUpdateImage = $(nGls).attr("update");
                                            var colThumbs = new Array;
                                            var iThu = 0;

                                            if ($(nGls).find("gallery").length > 0) {
                                                $(nGls).children().each(function() {
                                                    var nGal = this;
                                                    if (nGal.nodeName == 'gallery') {
                                                        var idTImage = $(nGal).attr("src");
                                                        var captionTImage = $(nGal).attr("name");

                                                        colThumbs[iThu] = {
                                                            id: idTImage,
                                                            titulo: captionTImage,
                                                            type: 'thumb'
                                                        }
                                                        iThu++;
                                                    }
                                                });
                                            }

                                            colElementos[iCol] = [{
                                                id: idImage,
                                                titulo: captionImage,
                                                update: datUpdateImage,
                                                thumbs: colThumbs,
                                                type: 'folderImages'
                                            }];
                                            iCol++;
                                            break;
                                        case 'gallery':
                                            var idImage = $(nGls).attr("src");
                                            var captionImage = $(nGls).attr("name");
                                            var datUpdateImage = $(nGls).attr("update");

                                            colElementos[iCol] = [{
                                                id: idImage,
                                                titulo: captionImage,
                                                update: datUpdateImage,
                                                type: 'gallery'
                                            }];
                                            iCol++;
                                            break;
                                        case 'multimedia':
                                            var idImage = $(nGls).attr("src");
                                            var captionImage = $(nGls).attr("name");
                                            var datUpdateImage = $(nGls).attr("update");

                                            colElementos[iCol] = [{
                                                id: idImage,
                                                titulo: captionImage,
                                                update: datUpdateImage,
                                                type: 'multimedia'
                                            }];
                                            iCol++;
                                            break;
                                    }
                                });
                                break;
                            case 'folder':
                                var captionImage = $(nObj).attr("name");
                                var datUpdateImage = $(nObj).attr("update");
                                var colThumbs = new Array;
                                var iThu = 0;

                                if ($(nObj).find("section").length > 0) {
                                    $(nObj).children().each(function() {
                                        var nSec = this;

                                        if (nSec.nodeName == 'section') {
                                            var idTImage = $(nSec).attr("src");
                                            var captionTImage = $(nSec).attr("name");

                                            colThumbs[iThu] = {
                                                id: idTImage,
                                                titulo: captionTImage,
                                                type: 'thumb'
                                            }
                                            iThu++;
                                        }
                                    });
                                }

                                colElementos[iCol] = [{
                                    titulo: captionImage,
                                    update: datUpdateImage,
                                    thumbs: colThumbs,
                                    type: 'folderText'
                                }];
                                iCol++;
                                break;
                            case 'section':
                                var captionImage = $(nObj).attr("name");
                                var datUpdateImage = $(nObj).attr("update");

                                colElementos[iCol] = [{
                                    titulo: captionImage,
                                    update: datUpdateImage,
                                    type: 'section'
                                }];
                                iCol++;
                                break;
                        }
                    });
                });
                return colElementos;
            },
            galleryLoad: function(elements, sParam) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('gallery').each(function() {
                    var gallery_name = $(this).attr("name");

                    if (Comun.htmlReplace(gallery_name) == sParam) {
                        //Coleccion de la galeria
                        var iElem = 0;
                        $(this).children().each(function() {
                            var IDImage = $(this).attr("id");
                            var hImage = typesHash.get(IDImage);
                            if (hImage != null) {
                                var idImage = hImage.SRC;
                                var captionImage = hImage.CAPTION;
                                var linkUrlImage = hImage.LINKURL;
                                var infoTextImage = hImage.INFOTEXT;
                                var datUpdateImage = hImage.UPDATE;
                                var datPublicImage = hImage.PUBLIC;
                                var formatImage = hImage.FORMAT;
                                var stockImage = hImage.STOCK;
                                var priceImage = hImage.PRICE;
                                var sType = 'imagen';

                                colElementos[iCol] = [{
                                    id: idImage,
                                    update: datUpdateImage,
                                    public: datPublicImage,
                                    titulo: captionImage,
                                    linkurl: linkUrlImage,
                                    infoimagen: infoTextImage,
                                    format: formatImage,
                                    stock: stockImage,
                                    price: priceImage,
                                    type: sType
                                }];
                                iCol++;
                            }
                        });
                    }
                });
                return colElementos;
            },
            galleryFind: function(elements, sParam) {
                var vGallery = '';
                elements.find('gallery').each(function() {
                    var gallery_name = $(this).attr("name");

                    if (Comun.htmlReplace(gallery_name) == sParam) {
                        vGallery = $(this);
                    }
                });
                return vGallery;
            },
            folderLoad: function(elements, sParam) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('folder').each(function() {
                    var folder_name = $(this).attr("name");

                    if (Comun.htmlReplace(folder_name) == sParam) {
                        //Coleccion de la carpeta				
                        $(this).children().each(function() {
                            var nObj = this;
                            if (nObj.nodeName == 'gallery') {
                                var idImage = $(this).attr("src");
                                var captionImage = $(this).attr("name");
                                var datUpdateImage = $(this).attr("update");
                                var sType = 'gallery';

                                colElementos[iCol] = [{
                                    id: idImage,
                                    update: datUpdateImage,
                                    titulo: captionImage,
                                    type: sType
                                }];
                                iCol++;
                            }
                        });
                    }
                });
                return colElementos;
            },
            folderFind: function(elements, sParam) {
                var vFolder = '';
                elements.find('folder').each(function() {
                    var folder_name = $(this).attr("name");

                    if (Comun.htmlReplace(folder_name) == sParam) {
                        vFolder = $(this);
                    }
                });
                return vFolder;
            },
            multimediaLoad: function(elements, sParam) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('multimedia').each(function() {
                    var multimedia_name = $(this).attr("name");

                    if (Comun.htmlReplace(multimedia_name) == sParam) {
                        //Coleccion de la galeria
                        var iElem = 0;
                        $(this).children().each(function() {
                            var IDImage = $(this).attr("id");
                            var hImage = typesHash.get(IDImage);
                            if (hImage != null) {
                                var idImage = hImage.SRC;
                                var captionImage = hImage.CAPTION;
                                var linkUrlImage = hImage.LINKURL;
                                var infoTextImage = hImage.INFOTEXT;
                                var datUpdateImage = hImage.UPDATE;
                                var datPublicImage = hImage.PUBLIC;
                                var formatImage = hImage.FORMAT;
                                var stockImage = hImage.STOCK;
                                var priceImage = hImage.PRICE;
                                var sType = 'video';

                                colElementos[iCol] = [{
                                    id: idImage,
                                    update: datUpdateImage,
                                    public: datPublicImage,
                                    titulo: captionImage,
                                    linkurl: linkUrlImage,
                                    infoimagen: infoTextImage,
                                    format: formatImage,
                                    stock: stockImage,
                                    price: priceImage,
                                    type: sType
                                }];
                                iCol++;
                            }
                        });
                    }
                });
                return colElementos;
            },
            multimediaFind: function(elements, sParam) {
                var vMultimedia = '';
                elements.find('multimedia').each(function() {
                    var multimedia_name = $(this).attr("name");

                    if (Comun.htmlReplace(multimedia_name) == sParam) {
                        vMultimedia = $(this);
                    }
                });
                return vMultimedia
            },
            modalLoad: function(elements, sParam) {
                var colElementos;
                var iCol = 0;

                elements.find('section').each(function() {
                    var section_name = $(this).attr("name");

                    if (Comun.htmlReplace(section_name) == sParam) {
                        var captionImage = $(this).attr("name");
                        var textoElemento = $(this).text();
                        var sType = 'section';

                        colElementos = {
                            titulo: captionImage,
                            texto: textoElemento,
                            type: sType
                        };
                    }
                });
                return colElementos;
            },
            /* Compone la ruta de galería y/o colección de una imagen */
            pathImagenComponer: function(elemNode, separador) {
                var oObj = elemNode;
                var sText = '';
                var iRow = 0;
                while ((oObj.parent()).attr("name") != undefined) {
                    sText = (oObj.parent()).attr("name") + (iRow != 0 ? separador + sText : "");
                    iRow++;
                    oObj = oObj.parent();
                }
                return sText;
            },
            sloganLoad: function(elements) {
                var colElementos;

                elements.find('slogan').each(function() {
                    var textoElemento = $(this).text();
                    var sType = 'slogan';

                    colElementos = {
                        texto: textoElemento,
                        type: sType
                    };
                });
                return colElementos;
            },
            menuLoad: function(elements) {
                var colElementos = new Array;
                var iCol = 0;

                elements.find('config').each(function() {
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

                                            colElementos[iCol] = {
                                                texto: sName,
                                                type: 'folder'
                                            };
                                            break;
                                        case 'gallery':
                                            var sName = $(nGls).attr("name");

                                            colElementos[iCol] = {
                                                texto: sName,
                                                type: 'gallery'
                                            };
                                            break;
                                        case 'multimedia':
                                            var sName = $(nGls).attr("name");

                                            colElementos[iCol] = {
                                                texto: sName,
                                                type: 'multimedia'
                                            };
                                            break;
                                    }
                                    iCol++;
                                });
                                break;
                            default:
                                break;
                        }
                    });
                });
                return colElementos;
            },
            generalLoad: function(elements) {
                var nNodo;

                elements.find('config').each(function() {
                    nNodo = $(this);
                });
                return nNodo;
            },
            seoValoresLoad: function(elemento) {
                var colElementos;

                var sInfoText = elemento.attr("infotext");
                var sKeywords = elemento.attr("keywords");
                var sTitle = elemento.attr("title");

                colElementos = {
                    infoText: sInfoText,
                    keywords: sKeywords,
                    title: sTitle
                };
                return colElementos;
            }
        }
    };
})();