// Show the menu when the screen is wide enough
if ($(window).width() > 300) {
    $('.toggle-button').click();
}

// ###Load Google Maps###
// Load the menu scripts once the map is loaded (they depend on the map having been initialised)
$(function () {
  $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCqQCJP3bsnODpjLx0dPilCEvstm20w7uY&v=3&callback=initMap", function () {

    $.getScript("dist/js/mappy.js").fail(function(jqxhr, settings, exception) {
      console.log('Failed to load script: mappy.js');
    });

    $.getScript("dist/js/ko.js").fail(function(jqxhr, settings, exception) {
      console.log('Failed to load script: ko.js');
    });

  }).fail(function(jqxhr, settings, exception) {
    console.log('Failed to load Google Map');
  });

});

// ###Helper functions###
// Convert to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Format facility condition string
function formatCondition(str, aboveStr) {
    if ($.trim(aboveStr.toLowerCase()) == 'same as above') {
        aboveStr = "3. Average";
    }

    if ($.trim(str.toLowerCase()) == 'same as above') {    
        return $.trim(toTitleCase(aboveStr));
    } else {
        return $.trim(toTitleCase(str));
    }
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

