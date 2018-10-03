// ==UserScript==
// @name         Become Megaracer
// @version      2
// @description  Surpass all your friends in a typing contest
// @author       aspedrosa
// @match        *://play.typeracer.com/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==
$(document).ready(function () {
    //Add's a new button to the navigation bar
	$("<a id='power'>Megaracer Power</a>").insertAfter("#aboutLink");

    /*
     * Define a handler for the click of the new button.
     * Get's all text that the user needs to write in this match and
     *   and places it on the text box of the game.
     * After clicking in the button move your mouse over the text box
     *   and you will finish the race.
     */
	$("#power").click( function () {
        //stop if not in a match
        if ($(".txtInput").length == 0)
            return;
        //stop if match didn't start
        if ($(".txtInput.txtInput-unfocused").length > 0)
            return;

        //Gathers all the text that's left to type
        let missingText = "";
        //Array of all html elemets that contain all the text to write
		let missingParts = $("[unselectable=on]");

        //Avoid gather text already written
        if ($(missingParts[0]).css("text-decoration").includes("underline"))
            missingText += $(missingParts[0]).text();

		for (let i = 1; i < missingParts.length; i++)
			missingText += $(missingParts[i]).text();

        $(".txtInput").val(missingText);
	})
})
