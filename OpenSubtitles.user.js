// ==UserScript==
// @name         xxxOpenSubtitlesxxx
// @version      1
// @description  xxx
// @author       aspedrosa
// @match        *://www.opensubtitles.org/pt
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==
$(window).on('load', function() {
    //while ($("input[value='pob']").length == 0)
    //    ;

    $("input[value='pob']").removeAttr('checked');
    $("input[value='eng']").attr('checked', 'checked');

    //Update UI
})
