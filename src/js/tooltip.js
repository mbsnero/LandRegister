$( "#tooltip-2" ).tooltip({
  position: {
      my: "center bottom",
      at: "center top-10",
      collision: "flip",
      using: function( position, feedback ) {
          $( this ).addClass( feedback.vertical )
              .css( position );
      }
  }
});