function AppViewModel() {
    // ###Declare variables and observables###
    self = this;
    self.sportEntries = []; // sport string for each data-point
    self.conditionEntries = []; // venue condition string for each data-point
    self.availableSports = ko.observableArray(); // unique sports in data set
    self.venueCondition = ko.observableArray(); // unique venue conditions in data set
    self.currentMarkerID = ko.observable(); // the map-marker currently selected
    self.locationInfo = ko.observableArray(); // location details for each data-point
    self.infoTitle = ko.observable(); // data-point title (venue name)
    self.sportSelected = ko.observable(); // the sport selected in the GUI selector
    self.conditionSelected = ko.observable(); // the venue condition selected in the GUI selector
    self.showLocationInfo = ko.observable(false); // whether to show the location details vignette

    // ###Load data from API. If this fails, then load data from local file###
    var sportsRecGeoJSON = 'http://data.dhs.opendata.arcgis.com/datasets/5f96a56cf8024d24b825b6aad94031e4_0.geojson';
    var sportsRecGeoJSONlocal = '/dist/data/SportandRec.geojson';
    // First try to load up-to-date data from API
    $.getJSON(sportsRecGeoJSON, function(data) {
        console.log('Data loaded from remote');
        init(data);
    }).fail(function (jqxhr, status, error) { 
        console.log('Failed to load data from API ', status, error);
        // If fail then use local version (local file is always available)
        $.getJSON(sportsRecGeoJSONlocal, function(data) {
            console.log('Data loaded from local');
            init(data);
        }).fail(function (jqxhr, status, error) { 
            console.log('Failed to load data from local file', status, error);
            console.log('IMPORTANT: To load data from local you must mount the app on a web-server');
        });
    });

    // ###Bootstrap app###
    // Clean data / obtain list of sports and venue conditions /
    // populate arrays for GUI selectors / set default sport and venue condition.
    init = function(data) {
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
    }

    // ###format and prepare data for consumption###
    prepareData = function(data) {
        var cleanData = []; // array to be returned

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


    // ###React to user interaction with the sport selector###
    self.sportSelected.subscribe(function(newValue) {
        console.log(newValue);
        filteredData = appvm.data.filter(function (d) {
          return d.sport == newValue;
        });
        mapControl.setSelection(filteredData);
        mapControl.setMarkers();
        appvm.showLocationInfo(false);
    });

    // ###React to user interaction with the venue condition selector###
    self.conditionSelected.subscribe(function(newValue) {
        numVal = Number(newValue.slice(0, 1));
        if (!numVal) numVal = 1; // if input is undefined, set numVal to lowest value (1).
        mapControl.setAcceptableCondition(numVal);
        mapControl.setMarkers();
        appvm.showLocationInfo(false);
    });

    // ###React to user selection of marker on map###
    // Get the data corresponding to the selected marker
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
        appvm.showLocationInfo(true); // Ensure the location detals box is showing
    });      
}

// ###Create the knockout.js view model and apply bindings###
var appvm = new AppViewModel();
ko.applyBindings(appvm);  
