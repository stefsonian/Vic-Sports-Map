
var requestURL = './dev/data/02København.xml'
var requestExternal = 'http://beta.findtoilet.dk/rss/term/2/K%C3%B8benhavn'
// var requestURL = 'localhost/dev/data/02København.xml'
$('#result').load('./dev/data/02København.xml');
var xmlDoc = $('#result').html();
console.log(xmlDoc);

// $(document).ready(function () {
// $.ajax({
//     type: "GET",
//     url: requestURL,
//     dataType: "xml",
//     success: xmlParser
//    });
// });

// function xmlParser(xml) {
//     console.log(xml);
//     // $(xml).find("title").each(function () {

//     // $(".result").append('<div class="title">' + $(this).text() + '</div>');
//     // });
// }