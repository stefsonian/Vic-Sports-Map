var sportsRecGeoJSON = 'http://data.dhs.opendata.arcgis.com/datasets/5f96a56cf8024d24b825b6aad94031e4_0.geojson';
var sportsRecGeoJSONlocal = '/dev/data/SportandRec.geojson';

$.getJSON(sportsRecGeoJSON, function(data) {
    console.log(data);
    console.log( "Load was performed." );
}).fail(function (jqxhr, status, error) { 
        console.log('error', status, error) }
);

