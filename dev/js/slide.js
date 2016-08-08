
var slideout = new Slideout({
  'panel': document.getElementById('map-panel'),
  'menu': document.getElementById('menu-panel'),
  'padding': 256,
  'tolerance': 70
});

// Toggle button
document.querySelector('.toggle-button').addEventListener('click', function() {
  slideout.toggle();
  //set class to toggle map width from/to fullscreen
  //after small delay which allows the transformation animation to finish. 
  var delayWidthChange;
  slideout.isOpen() ? delayWidthChange = 350 : delayWidthChange = 0;
  setTimeout(function(){
    $('#map-panel').toggleClass("full-screen");
  }, delayWidthChange);
});
