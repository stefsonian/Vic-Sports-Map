var mapView = {
    init: function(data) {
        self = this;
        self.data = data;
        markers = [];
        self.addLocationsToMap(data);
        largeInfowindow = new google.maps.InfoWindow();
        self.renderListings();
    },

    addLocationsToMap: function(locations) {
        
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            
            var pos = {"lat": locations[i].Latitude, "lng": locations[i].Longitude};
            var position = pos;
            var title = locations[i].Street;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                //icon: icons.free,
                //icon: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=ski|bb|Wheeee!|FFFFFF|000000',
                title: title,
                animation: google.maps.Animation.DROP,
                id: i
            });
            // Push the marker to our array of markers.
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function () {
                self.populateInfoWindow(this, largeInfowindow);
                //$('#marker-id').text(String(this.id)).trigger('change');
                appvm.currentMarkerID(this.id);
            });
        }
    },

    populateInfoWindow: function(marker, infowindow) {
        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        // First check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div class="lead">' + marker.title + '</div>');
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    },

    renderListings: function() {
        // This function will loop through the markers array and display them all.
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
    },

    hideListings: function() {
        // This function will loop through the listings and hide them all.
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }        
    }
}


//Icons for the map markers
var markerStarter = "https://chart.googleapis.com/chart?chst=d_map_pin_TYPE&chld=ITEM|COLOR";
var icons = {
    "free" : {"type": "letter", "item": "%E2%80%A2", "color": "ADDE63"},
    "free_disabled": {"type": "icon", "item": "wheelchair", "color": "ADDE63"},
    "pay" : {"type": "letter", "item": "%E2%80%A2", "color": "FE7569"},
    "pay_disabled": {"type": "icon", "item": "wheelchair", "color": "FE7569"}
};



