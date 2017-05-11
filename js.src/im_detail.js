$(document).ready(function() {
    $('.carousel-inner').height(sliderHeight);
    $('.carousel-item').height(sliderHeight);
});

$(window).resize(function() {
    $('.carousel-inner').height(sliderHeight);
    $('.carousel-item').height(sliderHeight);
});

sliderHeight = function() {
    var detail = $('.detail').height();
    var footer = $('footer').height();
    var navbar = $('.navbar').height();
    var breadcrumb = $('.breadcrumb').height();

    return (detail - navbar - breadcrumb - footer);
}