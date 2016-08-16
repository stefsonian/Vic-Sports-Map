var mapModel = {
    init: function() {
        this.markers = [];
        this.acceptableCondition = 1; //scale is 1 (lowest) to 5.
        this.selection = [];
        this.largeInfowindow = new google.maps.InfoWindow();
        this.markerHighlightImage = this.markerHighlight();
        this.highlightedMarker = null;
    },

    markerHighlight: function () {
        var pinColor = "FFFF58";
        pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
            new google.maps.Size(21, 34),
            new google.maps.Point(0,0),
            new google.maps.Point(10, 34));
        return pinImage;
    }
};


var mapControl = {
    init: function() {
        mapModel.init();
        this.createMarkers(20); // start with 20 markers
    },

    setSelection: function(selection) {
        mapModel.selection = selection;
    },

    setAcceptableCondition: function(condition) {
        mapModel.acceptableCondition = condition;
    },
    // create n number of markers.
    // markers are recycled for efficiency.
    createMarkers: function(n) {
        if (!n) n = 1; // if no value is passed then create one marker only.

        var pos = {"lat": -37.811957, "lng": 144.962860};
        for (var i = 0; i < n; i++) {
            var marker = new google.maps.Marker({
                position: pos,
                id: mapModel.markers.length,
                icon: null,
                displayStatus: false // used in the render function toggle show or not show marker.
            });

            marker.addListener('click', function () {
                //this.setAnimation(google.maps.Animation.BOUNCE);
                if (mapModel.highlightedMarker) {
                    mapModel.highlightedMarker.setIcon(null);
                }

                this.setIcon(mapModel.markerHighlightImage);
                appvm.currentMarkerID(this.id);
                mapControl.populateInfoWindow(this, mapModel.largeInfowindow);
                mapModel.highlightedMarker = this;
            });

            mapModel.markers.push(marker);
        }
    },

    // selection is an array of locations to be shown on the map
    setMarkers: function() {
        mapModel.largeInfowindow.close();
        var selection = mapModel.selection;
        // remove markers from map
        $.each(mapModel.markers, function(idx, marker) {
            marker.displayStatus = false;
        });
        this.displayMarkers(mapModel.markers, false);


        // filter out venues that don't make the grade.
       // console.log(selection);
        selection = selection.filter(function (item) {
            numVal = Math.max(1, Number(item.condition.slice(0, 1)))
            // console.log(mapModel.acceptableCondition);
            // console.log(Number(item.condition.slice(0, 1)));
            // console.log(Number(item.condition.slice(0, 1)) >= Number(mapModel.acceptableCondition));
            return numVal >= Number(mapModel.acceptableCondition);
        });
        // create more markers as needed.
        if (selection.length > mapModel.markers.length) {
            this.createMarkers(selection.length - mapModel.markers.length);
        }

        var markersToRender = [];
        $.each(selection, function(idx, loc) {
            mapModel.markers[idx].setPosition({"lat": loc.latitude, "lng": loc.longitude});
            mapModel.markers[idx].title = loc.name;
            mapModel.markers[idx].venueCond = loc.condition;
            mapModel.markers[idx].displayStatus = true;
            mapModel.markers[idx].id = loc.locID;
            mapModel.markers[idx].icon = null;
            markersToRender.push(mapModel.markers[idx]);
        });
        this.displayMarkers(markersToRender, false); //move to calling instance in ko.
    },

    displayMarkers: function(markers, fitBounds) {
        if (typeof(fitBounds)==='undefined') fitBounds = false;
        // This function will loop through the markers array and display them all.
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].displayStatus ? markers[i].setMap(map) : markers[i].setMap(null);
            bounds.extend(markers[i].position);
        }
        if (fitBounds) map.fitBounds(bounds);

    },

    populateInfoWindow: function(marker, infowindow) {
        // This function populates the infowindow when the marker is clicked. We'll only allow
        // one infowindow which will open at the marker that is clicked, and populate based
        // on that markers position.
        // First check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div class="map-infowindow">' + 
                '<div class="map-marker-title">' + marker.title + '</div>' + 
                '<div class="map-marker-text">Condition: ' + marker.venueCond + '</div>' + 
                '</div>'
                );
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                infowindow.marker = null;
            });
        }
    },
};

mapControl.init();


// var mapView = {
//     init: function() {
//         largeInfowindow = new google.maps.InfoWindow();
//     },

//     populateInfoWindow: function(marker, infowindow) {
//         // This function populates the infowindow when the marker is clicked. We'll only allow
//         // one infowindow which will open at the marker that is clicked, and populate based
//         // on that markers position.
//         // First check to make sure the infowindow is not already opened on this marker.
//         if (infowindow.marker != marker) {
//             infowindow.marker = marker;
//             infowindow.setContent(
//                 '<div class="map-marker-title">' + marker.title + '</div>' + 
//                 '<div class="map-marker-text">Free: ' + marker.locFree + '</div>' + 
//                 '<div class="map-marker-text">Accessible: ' + marker.locDisabled + '</div>' + 
//                 '<div class="map-marker-text">Staffed: ' + marker.locStaffed + '</div>'
//                 );
//             infowindow.open(map, marker);
//             // Make sure the marker property is cleared if the infowindow is closed.
//             infowindow.addListener('closeclick', function () {
//                 infowindow.marker = null;
//             });
//         }
//     },

    
// }


    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

