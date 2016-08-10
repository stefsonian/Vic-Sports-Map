var mapModel = {
    init: function(data) {
        self = this;
        self.data = data;
        self.markers = [];
        mapView.init();
        mapView.addLocationsToMap(data);
        mapView.renderListings(self.markers, true);
    },

    toggleAmenityState: function(amenity) {
        if (amenity) {
            self.amenityStates[amenity] = !(self.amenityStates[amenity]);
        } else {
            self.amenityStates.KunGratis = false;
            self.amenityStates.Handicap = false;
            self.amenityStates.Bemandet = false;
        }
        self.setMarkerState();
    },

    setMarkerState: function(filterButtons) {
        var markersToUpdate = []; // hold the markes we're going to update
        //console.log(filterButtons);
        // check each location against each filter and set appropriate display status.
        // if a marker's display status changes, then add it to the markesToUpdate.
        $.each(self.data, function(markerIdx, location) {
            var marker = self.markers[markerIdx];
            var markerShouldDisplay = true;
            $.each(filterButtons, function(btnIdx, button) {
                var amenity = button['title'];
                var required = button['state'];
       
                if (required && !location[amenity]) markerShouldDisplay = false;
                if (amenity == 'all' && required) markerShouldDisplay = true;
                
            });
            
            if (markerShouldDisplay && !marker.displayStatus) {
                self.markers[markerIdx].displayStatus = true;
                markersToUpdate.push(marker); 
            }

            if (!markerShouldDisplay && marker.displayStatus) {
                self.markers[markerIdx].displayStatus = false;
                markersToUpdate.push(marker); 
            }
        });
        mapView.renderListings(markersToUpdate);
    }
}

var mapView = {
    init: function() {
        largeInfowindow = new google.maps.InfoWindow();
    },

    addLocationsToMap: function(locations) {
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
            // Get the position from the location array.
            
            var pos = {"lat": locations[i].latitude, "lng": locations[i].longitude};
            var position = pos;
            
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                //icon: icons.free,
                //icon: 'https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=ski|bb|Wheeee!|FFFFFF|000000',
                title: locations[i].place,
                locFree: locations[i].free,
                locDisabled: locations[i].disabled,
                locStaffed: locations[i].staffed,
                animation: google.maps.Animation.DROP,
                id: i,
                displayStatus: true // used in the render function toggle show or not show marker.
            });
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function () {
                appvm.currentMarkerID(this.id);
                if ($(window).width() <= 700) {
                    mapView.populateInfoWindow(this, largeInfowindow);
                }
            });

            // Push the marker to the array of markers and set to active.
            marker.isActive = true;
            mapModel.markers.push(marker);
        }
    },

    populateInfoWindow: function(marker, infowindow) {
        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        // First check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent(
                '<div class="map-marker-title">' + marker.title + '</div>' + 
                '<div class="map-marker-text">Free: ' + marker.locFree + '</div>' + 
                '<div class="map-marker-text">Accessible: ' + marker.locDisabled + '</div>' + 
                '<div class="map-marker-text">Staffed: ' + marker.locStaffed + '</div>'
                );
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    },

    renderListings: function(markers, fitBounds) {
        if (typeof(fitBounds)==='undefined') fitBounds = false;
        // This function will loop through the markers array and display them all.
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].displayStatus ? markers[i].setMap(map) : markers[i].setMap(null);
            bounds.extend(markers[i].position);
        }
        if (fitBounds) map.fitBounds(bounds);
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



