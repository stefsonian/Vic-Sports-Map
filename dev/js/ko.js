function AppViewModel() {
    self = this;
    //Load data from local file
    $.getJSON( "dev/data/kbh_pretty.json", function( data ) {
        self.data = prepareData(data);
        //self.data = data;
        mapModel.init(self.data); //add but don't show locations to map
        $('#filter-all').toggleClass("sButton-active");
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
                "staffed": location.Bemanding.toLowerCase() == "ja",
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
    self.currentMarkerID = ko.observable();

    self.filterUpdate = function(filterButton) {
        // REFACTOR THIS MESS
        // note that filterButton.state represents its state BEFORE it was clicked.
        console.log(filterButton);
        // don't do anything if the All button is pressed when it's already active
        if (filterButton.title == "all" && filterButton.state) return;

        // Toggle button state for the clicked filterButton
        if (filterButton.title == "all") {
            $.each(appvm.buttons(), function(idx, button) {
                if (button.title == "all") {
                    appvm.buttons()[idx].state = true;
                    $('#' + button.idb).toggleClass("sButton-active");
                } else {
                    appvm.buttons()[idx].state = false;
                    $('#' + button.idb).removeClass("sButton-active");
                }
            });
        }

        if (filterButton.title != "all") {
            $.each(appvm.buttons(), function(idx, button) {
                if (button.title == "all") {
                    appvm.buttons()[idx].state = false;
                    $('#' + button.idb).removeClass("sButton-active");
                } else {
                    if (button.title == filterButton.title) {
                        appvm.buttons()[idx].state = !filterButton.state;
                        $('#' + button.idb).toggleClass("sButton-active");
                    }
                }
            });
        }

        // if all filters are off then set the filter-all button to true
        var anyOn = false;
        $.each(appvm.buttons(), function(idx, button) {
            if (button.state) anyOn = true;
        });

        if (!anyOn) {
            $.each(appvm.buttons(), function(idx, button) {
                if (button.title == "all") {
                    appvm.buttons()[idx].state = true;
                    $('#' + appvm.buttons()[idx].idb).toggleClass("sButton-active");
                } 
            });
        }

        // // Signal filter-change to mapModel
        mapModel.setMarkerState(appvm.buttons());
    }

    var buttonHTML = '<i class="fa *icon* fa-fw fa-lg pull-left" aria-hidden="true"></i>';

    self.buttons = ko.observableArray([
        {"title": "all", "idb": "filter-all", "state": true, "htmls": buttonHTML.replace('*icon*', 'fa-home').concat("All")},
        {"title": "free", "idb": "filter-free", "state": false, "htmls": buttonHTML.replace('*icon*', 'fa-usd').concat("Free")},
        {"title": "disabled", "idb": "filter-disabled", "state": false, "htmls": buttonHTML.replace('*icon*', 'fa-wheelchair').concat("Accessible")},
        {"title": "staffed", "idb": "filter-staffed", "state": false, "htmls": buttonHTML.replace('*icon*', 'fa-user').concat("Staffed")}
        ]);

    self.locationInfo = ko.observableArray();
    self.infoTitle = ko.observable();

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
            {"label": "Accesible", "value": details.disabled},
            {"label": "Staffed", "value": details.staffed}];

        $.each(info, function(idx, object) {
            appvm.locationInfo.push(object);
        });
        appvm.infoTitle(details.place);
        $('#info-box').show();
    });      
    



    // self.showMorsel = function () {
    //     console.log(appvm.currentMarkerID());
    //     console.log(appvm.data[appvm.currentMarkerID()]);
    // }

    // self.data.forEach(function(d) {
    //     self.infoLine.push(d);
    // });
    


}

appvm = new AppViewModel();
ko.applyBindings(appvm);  
