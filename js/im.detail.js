function carouselNormalization() {
    var items = $('#carouselInner .carousel-item img'), //grab all slides
        heights = [], //create empty array to store height values
        proportion = [],
        dispotion = [],
        tallest; //create variable to make note of the tallest slide

    if (items.length) {
        function normalizeHeights() {
            items.each(function() { //add heights to array
                heights.push(this.height);
                if (getLayout($(this)) == 'h') {
                    if ($(this).attr('width') >= $(this.parentElement).width()) {
                        $(this).css('height', $(this.parentElement).width() * getRatio($(this)) + 'px');
                    }
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