// ==UserScript==
// @name         AutoEnter SteamGifts
// @version      4
// @description  Enter as many giveaways as possible with a click of a button
// @author       aspedrosa
// @match        *://www.steamgifts.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==
/*
 * Maybe TODO:
 * -Search for games that the user want and enter
 *     first in those before spending all points.
 */
/*
 * Executed after a HTTP GET request used in line 55.
 * Parse the html received and get all divs with giveaways. Put
 *     those divs in a div in the current page where all giveaways are stored.
 */
function getSuccess(data, textStatus, jqXHR) {
    let givs = $(data).find(":not(.pinned-giveaways__inner-wrap) > .giveaway__row-outer-wrap");
    $(".giveaway__row-outer-wrap").parent().append(givs);

}

$(document).ready( function () {
    //used to enter giveaways via HTTP POST request
    let token = $("input[name=xsrf_token]").val();

    let currentPoints = parseInt($(".nav__points").text());

    //remove html elements that I don't use or disturb
    $(".pinned-giveaways__outer-wrap").remove();
    $(".sidebar__mpu").remove();

    //Adds a new button to the navigation bar
    $(".nav__left-container")
        .append(
        '<div class="nav__button-container"><a id="extensionButton" class="nav__button">Enter Giveaways</a></div>'
        )

    /*
     * Creates a handler for the click in the new button
     * Try to enter as many giveaways as possible with the current points
     */
    $("#extensionButton").click( function () {
        /*
         * Because in the main page theres only 50 giveaways,
         *     several giveaways from other pages are loaded to the main
         *     using HTTP GET request.
         * The number of pages loaded are set in the variable 'numberPagesToLoad'.
         */
        /*-----------------------------------------------*/
        let numberPagesToLoad = 6;
        let getCallbacks = [];
        for (let i = 2; i < numberPagesToLoad+2; i++) {
            getCallbacks.push(
                $.get(
                    "/giveaways/search?page=" + i,
                    getSuccess
                )
            );
        }
        /*-----------------------------------------------*/

        /*
         * Wait for all function of success of previous HTTP GET requests to finish
         *     to continue to the rest of the script.
         */
        $.when.apply(null, getCallbacks).done(function() {
            //div with all giveaways
            let giveawaysDiv = $(".giveaway__row-outer-wrap").parent();
            //select giveaways not entered
            let giveaways = giveawaysDiv.find(".giveaway__row-inner-wrap:not(.is-faded)");

            /*
             * Sort giveaways by their points in an ascending order.
             * Iterating also in ascending order allows to enter as many giveaways
             *     as possible with the current points.
             */
            giveaways.sort(function(a, b) {
                let ptsA = parseInt($(a).find("span.giveaway__heading__thin").text().match(/(\d+)P/));
                let ptsB = parseInt($(b).find("span.giveaway__heading__thin").text().match(/(\d+)P/));
                return ptsA - ptsB;
            });

            //enter in the giveaways via HTTP POST request
            let postCallbacks = [];
            giveaways.each(function() {
                let points = parseInt($(this).find("span.giveaway__heading__thin").text().match(/(\d+)P/));

                if (currentPoints - points < 0)
                    return false; //break;

                currentPoints -= points;

                let cod = $(this).find(".giveaway__heading__name").attr("href").split("/")[2];

                postCallbacks.push($.post(
                    "/ajax.php",
                    {
                        xsrf_token : token,
                        do : "entry_insert",
                        code : cod
                    }
                ));
            });

            //Wait for all HTTP POST requests to be done and then reload the page
            $.when.apply(null, postCallbacks).done(function() {
                location.reload();
            });
        });
    });
});
