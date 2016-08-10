function AppViewModel() {
    self = this;
    var sportsRecGeoJSON = 'http://data.dhs.opendata.arcgis.com/datasets/5f96a56cf8024d24b825b6aad94031e4_0.geojson';
    var sportsRecGeoJSONlocal = '/dev/data/SportandRec.geojson';
    $.getJSON(sportsRecGeoJSONlocal, function(data) {
        self.data = prepareData(data.features);
        var sportOptions = self.sportEntries.filter(onlyUnique).sort();
        $.each(sportOptions, function(idx, sport) {
            self.availableSports.push(sport);
        });
        mapModel.init(self.data); //add but don't show locations to map
        console.log( "Load was performed." );
    }).fail(function (jqxhr, status, error) { 
        // TRY LOCAL VERSION
        console.log('error', status, error) }
    );

    self.sportEntries = [];
    prepareData = function(data) {
        // format and prepare data for consumption
        var cleanData = []; // variable to be returned

        // cycle through each location object and perform formatting
        $.each(data, function(idx, d) {
            var conditionAboveStr = 'empty';
            if (idx > 0) {
                conditionAboveStr = data[idx - 1].properties.FacilityCondition;
            }
            var locInfo = {
                "latitude": d.geometry.coordinates[1],
                "longitude": d.geometry.coordinates[0],
                "condition": formatCondition(d.properties.FacilityCondition, conditionAboveStr),
                "sport": toTitleCase(d.properties.SportsPlayed),
                "surface": toTitleCase(d.properties.FieldSurfaceType),
                "name": toTitleCase(d.properties.FacilityName),
                "town": toTitleCase(d.properties.SuburbTown),
                "changerooms": toTitleCase(d.properties.Changerooms)
            };
            cleanData.push(locInfo);
            self.sportEntries.push(String(locInfo.sport));
        });
        return(cleanData);
    }

    // Store the marker-id when the user clicks on one
    self.availableSports = ko.observableArray();
    self.currentMarkerID = ko.observable();
    self.locationInfo = ko.observableArray();
    self.infoTitle = ko.observable();

    // get sports from data


    // the infoLine array holds location details to be displayed
    // in the side panel when the user clicks on a marker.
    // It is updated whenever the currentMarkerID changes.
    self.currentMarkerID.subscribe(function(newValue) {
        // First clear the array
        appvm.locationInfo.removeAll();
        // Then add items from the data-object
        var details = appvm.data[newValue];

        $.each(details, function(key, value) {
            if (key != "title") {
                appvm.locationInfo.push({"label": key.toUpperCase(), "value": value});
            }
        });

        // set the infoTitle and reveal the info-box
        appvm.infoTitle(details.title);
        $('#info-box').show();
    });      
}

appvm = new AppViewModel();
ko.applyBindings(appvm);  

// Convert to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Format facility condition string
function formatCondition(str, aboveStr) {
    if ($.trim(str.toLowerCase()) == 'same as above') {
        return $.trim(toTitleCase(aboveStr.slice(4, 14)));
    } else {
        return $.trim(toTitleCase(str.slice(4, 14)));
    }
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}
