if ($(window).width() > 300) {
    $('.toggle-button').click();
}

// ###Helper functions###
// Convert to title case
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Format facility condition string
function formatCondition(str, aboveStr) {
    if ($.trim(aboveStr.toLowerCase()) == 'same as above') {
        aboveStr = "3. Average";
    }

    if ($.trim(str.toLowerCase()) == 'same as above') {    
        return $.trim(toTitleCase(aboveStr));
    } else {
        return $.trim(toTitleCase(str));
    }
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

