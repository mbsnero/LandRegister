//= ../../node_modules/jquery/dist/jquery.min.js
//= ../../node_modules/jquery-ui-dist/jquery-ui.min.js
//= menu.js
//= select.js
//= tabs.js

$(document).ready(function() {

  //accardeon on card
  
  var accardeonSrc = [
    'images/accordion_arr_up_hov.svg',
    'images/accordion_arr_dw.svg'
  ]
  var src;

  $('.title-block__btn, .title-block__text').on('click', function(event) {
    if ($(event.target).hasClass('title-block__btn')) {
      $(this).toggleClass('animated');
    } else if ($(event.target).hasClass('title-block__text')) {
      $(this).next().toggleClass('animated');
    }

    $(event.target).parent('.title-block').next().slideToggle();
  })

  
});