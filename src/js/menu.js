$(document).ready(function() {
    $('.js-menu').find('.hamburger').on('click', function() {
      $('.js-menu').toggleClass('js-menu--activated');
    });
});