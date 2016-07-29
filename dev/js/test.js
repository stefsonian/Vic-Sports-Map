
$.getJSON( "dev/data/kbh_pretty.json", function( data ) {
  console.log( data.slice(0,2) ); // Data returned
  console.log( "Load was performed." );
}).fail(function (jqxhr, status, error) { 
console.log('error', status, error) }
);