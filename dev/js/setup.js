console.log($(document).width())
console.log($(window).width())

if ($(window).width() > 700) {
    $('.toggle-button').click();
}

$('#info-box').hide();

