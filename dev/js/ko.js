// function InfoMorsel(name, value) {
//     var self = this;
//     self.itemName = name;
//     self.itemValue = value;
// }

// function AppViewModel(data) {
//     var self = this;
//     self.dataIndex = ko.observable("0"); 
//     // data from json file

//     self.morsels = ko.observableArray([]);
//     d = data[0]
//     for (var key in d) {
//         self.morsels.push(new InfoMorsel(key, d[key]));
//     }
//     // $.each(data[0], function(index, value) {
//     //     if (index < 4) self.morsels.push(new InfoMorsel(value));
//     // });
// }

// get data
// select morsel (eventually from marker)
// generate morsel from data
// generate bite from morsel
// place bite in html

function AppViewModel() {
    self = this;
    //Load data from local file
    $.getJSON( "dev/data/kbh_pretty.json", function( data ) {
        self.data = data;
        mapView.init(data); //add but don't show locations to map
        console.log( "Load was performed." );
    }).fail(function (jqxhr, status, error) { 
        console.log('error', status, error) }
    );

    self.currentMarkerID = ko.observable(20);

    self.showMorsel = function () {
        console.log(appvm.currentMarkerID());
        console.log(appvm.data[appvm.currentMarkerID()]);
    }
}

appvm = new AppViewModel();
ko.applyBindings(appvm);  
