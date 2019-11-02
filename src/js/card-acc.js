$('.title-block__btn, .title-block__text').on('click', function(event) {
    
  if ($(event.target).hasClass('title-block__btn')) {
    $(this).toggleClass('animated');
  } else if ($(event.target).hasClass('title-block__text')) {
    $(this).next().toggleClass('animated');
  }

  $(event.target).parent('.title-block').next().slideToggle();
})