//= ../../node_modules/popper.js/dist/umd/popper.min.js
//= ../../node_modules/tippy.js/dist/tippy.iife.min.js


var tooltipElement = document.querySelector('.tooltip');
  tippy(tooltipElement, {
    arrow: true,
    placement: 'top',
    theme: 'light',
  });
  tooltipElement._tippy.setContent('Для ведения личного подсобного хозяйства и для индивидуальной жилой застройки земельный участок можно приобрести только в собственность');

