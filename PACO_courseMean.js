// ==UserScript==
// @name         PACO_courseMean
// @version      1
// @description  Using a table in PACO (history of grades) calculate the current mean
// @author       aspedrosa
// @match        *://paco.ua.pt/secvirtual/c_historiconotas.asp
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==
$(document).ready(function () {
    //get the rows of the table with the grades (last row is the footer)
    let rows = $('#historico tbody tr');

    let mean = 0;
    for (let i = 0; i < rows.length-1; i++)
        //sum all grades (fourth column)
        mean += parseInt(rows[i].children[3].innerText);

    mean /= rows.length-1;

    //writes in the footer the mean
    $('.table_footer')[0].innerText += ". Média: " + mean;
})
