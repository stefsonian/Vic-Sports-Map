
$.getJSON( "dev/js/testLoc.json", function( data ) {
  console.log( data ); // Data returned
  console.log( "Load was performed." );
}).fail(function (jqxhr, status, error) { 
console.log('error', status, error) }
);