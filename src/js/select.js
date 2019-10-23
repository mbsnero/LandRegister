//= ../../node_modules/select2/dist/js/select2.min.js

$(document).ready(function() {

  /** Инициализация всех селекторов на страницы с классом select
   */
  $(".select").select2({
    placeholder: ""
  });


  /** Инициализация селектора чиновника
   */
  $("#select_profile").select2({
    placeholder: "Профиль чиновника"
  });
});
