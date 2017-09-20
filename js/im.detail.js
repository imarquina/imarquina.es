$(window).ready(function() {
    View.Detail.prototype.Image.imageNormalization();
});

/** evento de cambio de dimension */
$(window).on('resize orientationchange', function() {
    var items = $('#carouselInner .carousel-item img') //grab all slides

    items.each(function() { //add heights to array
        View.Detail.prototype.Image.setHeight(this);
        View.Detail.prototype.Image.setMargin(this);
    });
    View.Detail.prototype.Image.writeHeights();
});

View.Detail.prototype = {
    Image: (function() {
        /** FUNCIONES PRIVADAS */
        var getRatio = function(element) {
            return element.attr('height') / element.attr('width');
        }

        var getLayout = function(element) {
            if (element.attr('height') > element.attr('width')) return 'v';
            else if (element.attr('width') > element.attr('height')) return 'h';
            else return 'v';
        }

        /*  Calculo de dimension */
        var displayHeight = function() {
            var detail = $('.detail').height();
            var footer = $('footer').height();
            var navbar = $('.navbar').height();
            var breadcrumb = $('.breadcrumb').height();

            return (detail - navbar - footer);
        }

        /** FUNCIONES PUBLICAS */
        Image = {
            imageNormalization: function() {
                $('#carouselSlides .card-image img').one("load", function() {
                    View.Detail.prototype.Image.setHeight(this);
                    View.Detail.prototype.Image.setMargin(this);
                }).each(function() {
                    try {
                        if (this.complete) $(this).load();
                    } catch (ex) {

                    }
                });
                View.Detail.prototype.Image.writeHeights();
            },
            writeHeights: function() {
                $('#banner-caroussel-top').empty();

                if (App.Config.developer == 1) {
                    var divLista = $("<ul>").appendTo('#banner-caroussel-top');

                    $("<li>window.height: " + $(window).height() + "px</li>").appendTo(divLista);
                    $("<li>detail.height: " + $(".detail").height() + "px</li>").appendTo(divLista);
                    $("<li>carouselSlides.height: " + $('#carouselSlides').height() + "px</li>").appendTo(divLista);
                    $("<li>carouselInner.height: " + $('#carouselInner').height() + "px</li>").appendTo(divLista);
                    $("<li>carousel-item: " + $($('.carousel-item.active')[0]).height() + "px</li>").appendTo(divLista);
                    $("<li>image.height (original): " + $($('.carousel-item.active img')[0]).attr('height') + "px</li>").appendTo(divLista);
                    $("<li>image.height (processed): " + $($('.carousel-item.active img')[0]).css('height') + "</li>").appendTo(divLista);
                    $("<li>image.width (original): " + $($('.carousel-item.active img')[0]).attr('width') + "px</li>").appendTo(divLista);
                    $("<li>image.width (processed): " + $($('.carousel-item.active img')[0]).css('width') + "</li>").appendTo(divLista);
                }
            },
            setHeight: function(element) {
                if (getLayout($(element)) == 'h') {
                    if ($(element).attr('width') >= $(element.parentElement).width()) {
                        $(element).css('height', $(element.parentElement).width() * getRatio($(element)) + 'px');
                    }
                }
            },
            setMargin: function(element) {
                if ($('.detail').height() <= $(window).height()) {
                    var loQueHay = displayHeight();
                    var laImagen = $('#layImage').height();
                    var margen = (loQueHay - laImagen) / 2;
                    $('#layCard').css('margin-top', margen + 'px');
                } else {
                    $('#layCard').css('margin-top', '0px');
                }
            }
        }
        return Image;
    })()
}