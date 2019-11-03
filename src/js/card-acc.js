$('.sg-title-block__btn, .sg-title-block__text').on('click', function(event) {
    
  if ($(event.target).hasClass('sg-title-block__btn')) {
    $(this).toggleClass('sg-animated');
  } else if ($(event.target).hasClass('sg-title-block__text')) {
    $(this).next().toggleClass('sg-animated');
  }

  $(event.target).parent('.sg-title-block').next().slideToggle();
})