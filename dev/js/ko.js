function AppViewModel() {
    self = this;
    var sportsRecGeoJSON = 'http://data.dhs.opendata.arcgis.com/datasets/5f96a56cf8024d24b825b6aad94031e4_0.geojson';
    var sportsRecGeoJSONlocal = '/dev/data/SportandRec.geojson';
    $.getJSON(sportsRecGeoJSON, function(data) {
        self.data = prepareData(data.features);
        var sportOptions = self.sportEntries.filter(onlyUnique).sort();
        $.each(sportOptions, function(idx, sport) {
            self.availableSports.push(sport);
        });
        var conditionOptions = self.conditionEntries.filter(onlyUnique).sort();
        $.each(conditionOptions, function(idx, condition) {
            self.venueCondition.push(condition);
        });
        self.sportSelected("Australian Rules Football");
        self.conditionSelected("5. Very Good");
        console.log( "Load was performed." );
    }).fail(function (jqxhr, status, error) { 
        // Get local version (local file is always available)
        console.log('error', status, error) }
    );

    self.sportEntries = [];
    self.conditionEntries = [];
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
                "locID": idx,
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
            self.conditionEntries.push(String(locInfo.condition));
        });
        return(cleanData);
    }

    // Store the marker-id when the user clicks on one
    self.availableSports = ko.observableArray();
    self.venueCondition = ko.observableArray();
    self.currentMarkerID = ko.observable();
    self.locationInfo = ko.observableArray();
    self.infoTitle = ko.observable();
    self.sportSelected = ko.observable();
    self.conditionSelected = ko.observable();

    self.sportSelected.subscribe(function(newValue) {
        console.log(newValue);
        filteredData = appvm.data.filter(function (d) {
          return d.sport == newValue;
        });
        mapControl.setSelection(filteredData);
        mapControl.setMarkers();
    });

    self.conditionSelected.subscribe(function(newValue) {
        numVal = Number(newValue.slice(0, 1));
        if (!numVal) numVal = 1; // if input is undefined, set numVal to lowest value (1).
        mapControl.setAcceptableCondition(numVal);
        mapControl.setMarkers();
    });



    // the infoLine array holds location details to be displayed
    // in the side panel when the user clicks on a marker.
    // It is updated whenever the currentMarkerID changes.
    self.currentMarkerID.subscribe(function(newValue) {
        // First clear the array
        appvm.locationInfo.removeAll();
        // Then add items from the data-object
        var details = appvm.data[newValue];

        $.each(details, function(key, value) {
            var excludeStr = "name longitude latitude locID";
            if (!excludeStr.includes(key)) {
                if (!value) value = 'Unknown';
                appvm.locationInfo.push({"label": key.toUpperCase(), "value": value});
            }
        });

        // set the infoTitle and reveal the info-box
        appvm.infoTitle(details.name);
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
