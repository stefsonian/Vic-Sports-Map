var sportsRecGeoJSON = 'http://data.dhs.opendata.arcgis.com/datasets/5f96a56cf8024d24b825b6aad94031e4_0.geojson';
var sportsRecGeoJSONlocal = '/dev/data/SportandRec.geojson';

$.getJSON(sportsRecGeoJSON, function(data) {
    // var dataSnippet = data.slice(0, 5);
    console.log(data);
    // console.log(data.features.slice(0, 5));
    console.log( "Load was performed." );
}).fail(function (jqxhr, status, error) { 
        console.log('error', status, error) }
);

