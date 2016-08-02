function AppViewModel() {
    self = this;
    //Load data from local file
    $.getJSON( "dev/data/kbh_pretty.json", function( data ) {
        self.data = prepareData(data);
        //self.data = data;
        mapModel.init(self.data); //add but don't show locations to map

        console.log( "Load was performed." );
    }).fail(function (jqxhr, status, error) { 
        console.log('error', status, error) }
    );

    prepareData = function(data) {
        // format and prepare data for consumption
        var readyData = []; // variable to be returned
        // cycle through each location object and perform formatting
        $.each(data, function(idx, location) {
            var locInfo = {
                "locationID": location.nid,
                "place": location.Street,
                "postalcode": location.Postalcode,
                "city": location.City,
                "latitude": location.Latitude,
                "longitude": location.Longitude,
                "facilityType": location.type,
                "disabled": location.type.toLowerCase() == "handicap",
                "free": location.Betaling.toLowerCase() == "nej",
                "manned": location.Bemanding.toLowerCase() == "ja",
                "hazDisposal": location.Kanylebeholder.toLowerCase() == "ja",
                "changingTable": location.Puslebord.toLowerCase() == "ja",
                "drinkingWater": location.Vandhane.toLowerCase() == "ja",
                "additionalInfo": location.Body,
                "region": location.Term,
                "photos": location.Billeder
            };
            readyData.push(locInfo);
        });
        return(readyData);
    }



    // Store the marker-id when the user clicks on one
    self.currentMarkerID = ko.observable(20);

    filterUpdate = function(filterButton) {
        var currentState = filterButton.state;
        // Toggle button state
        $.each(appvm.buttons(), function(idx, button) {
            if (button.title == filterButton.title) {
                appvm.buttons()[idx].state = !currentState;
            }
        });
        
        // Set button class
        $(".btn:contains('" + filterButton.title + "')")
        .toggleClass("btn-default btn-success");
        // Signal filter-change to mapModel
        mapModel.setMarkerState(appvm.buttons());
    }

    self.buttons = ko.observableArray([
        {"title": "Free", "state": false},
        {"title": "Disabled", "state": false},
        {"title": "Manned", "state": false}]);

    self.locationInfo = ko.observableArray([]);

    // the infoLine array holds location details to be displayed
    // in the side panel when the user clicks on a marker.
    // It is updated whenever the currentMarkerID changes.
    self.currentMarkerID.subscribe(function(newValue) {
        // First clear the array
        appvm.locationInfo.removeAll();
        var details = appvm.data[newValue];
        // Then add items from the data-object
        var info = [
            {"label": "Free", "value": details.free},
            {"label": "Disabled", "value": details.disabled},
            {"label": "Manned", "value": details.manned}];

        $.each(info, function(idx, object) {
            appvm.locationInfo.push(object);
        });
        // console.log(appvm.infoLine());
    });      
    



    self.showMorsel = function () {
        console.log(appvm.currentMarkerID());
        console.log(appvm.data[appvm.currentMarkerID()]);
    }

    // self.data.forEach(function(d) {
    //     self.infoLine.push(d);
    // });
    


}

appvm = new AppViewModel();
ko.applyBindings(appvm);  
