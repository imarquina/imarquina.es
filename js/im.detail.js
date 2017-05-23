carouselNormalization = function() {
    var items = $('#carouselInner .carousel-item img'), //grab all slides
        heights = [],
        tHeights = [], //array to store teorical height values
        tWidths = [], //array to store teorical width values
        ratio = [], //array to store teorical ratio values
        layout = [], //array to store teorical height values
        tallest; //create variable to make note of the tallest slide

    if (items.length) {
        function normalizeHeights() {
            items.each(function() { //add heights to array
                //heights.push(this.height);
                tHeights.push($(this).attr('height'));
                tWidths.push($(this).attr('width'));
                ratio.push(getRatio($(this)));
                layout.push(getLayout($(this)));

                if (getLayout($(this)) == 'h') {
                    if ($(this).attr('width') >= $(this.parentElement).width()) {
                        $(this).css('height', $(this.parentElement).width() * getRatio($(this)) + 'px');
                    }
                }
                if ($('#carouselInner').height() < $(window).height() && $('#carouselInner').height() > $(this.parentElement).height()) {
                    $(this).css('margin-top', ($('#carouselInner').height() - $(this.parentElement).height()) / 2 + 'px');
                } else {
                    $(this).css('margin-top', '0px');
                }
            });
            tallest = Math.max.apply(null, heights); //cache largest value
            items.each(function() {
                //$(this).css('min-height', tallest + 'px');
            });
        };

        function getRatio(element) {
            return element.attr('height') / element.attr('width');
        };

        function getLayout(element) {
            if (element.attr('height') > element.attr('width')) return 'v';
            else if (element.attr('width') > element.attr('height')) return 'h';
            else return 'v';
        }
        normalizeHeights();

        $(window).on('resize orientationchange', function() {
            tallest = 0, heights.length = 0; //reset vars
            items.each(function() {
                //$(this).css('min-height', '0'); //reset min-height
            });
            normalizeHeights(); //run it again 
        });
    }
}

/*  Calculo de dimension */
carouselInnerHeight = function() {
    var detail = $('.detail').height();
    var footer = $('footer').height();
    var navbar = $('.navbar').height();
    var breadcrumb = $('.breadcrumb').height();

    return (detail - navbar - breadcrumb - footer);
}