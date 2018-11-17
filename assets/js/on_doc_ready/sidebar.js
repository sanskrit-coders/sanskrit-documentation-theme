$('#displayed_sidebar').height($(".nav").height());

$(document).ready(function() {
    // Initialize navgoco with default options
    $("#displayed_sidebar").navgoco({
        caretHtml: '',
        accordion: true,
        openClass: 'active', // open
        save: false, // leave false or nav highlighting doesn't work right
        cookie: {
            name: 'navgoco',
            expires: false,
            path: '/'
        },
        slide: {
            duration: 400,
            easing: 'swing'
        }
    });
    $("#toc_ul").navgoco({
        caretHtml: '',
        accordion: true,
        openClass: 'active', // open
        save: false, // leave false or nav highlighting doesn't work right
        cookie: {
            name: 'navgoco',
            expires: false,
            path: '/'
        },
        slide: {
            duration: 400,
            easing: 'swing'
        }
    });

    $("#collapseAll").click(function(e) {
        e.preventDefault();
        $("#displayed_sidebar").navgoco('toggle', false);
    });

    $("#expandAll").click(function(e) {
        e.preventDefault();
        $("#displayed_sidebar").navgoco('toggle', true);
    });

});

$( document ).ready(function() {

    //this script says, if the height of the viewport is greater than 800px, then insert affix class, which makes the nav bar float in a fixed
    // position as your scroll. if you have a lot of nav items, this height may not work for you.
    var h = $(window).height();
    //console.log (h);
    if (h > 800) {
        $( "#displayed_sidebar" ).attr("class", "nav affix");
    }

    /**
     * AnchorJS
     */
    anchors.add('h2,h3,h4,h5');

});

// Code to make the "Nav" button, which toggles the sidebar.
var toggleSidebar = function() {
    $("#tg-sb-sidebar").toggle();
    // $("#tg-sb-content").toggleClass('col-md-9');
    // $("#tg-sb-content").toggleClass('col-md-12');
    $("#tg-sb-icon").toggleClass('fa-toggle-on');
    $("#tg-sb-icon").toggleClass('fa-toggle-off');
};

$(document).ready(function() {
    $("#tg-sb-link").click(toggleSidebar);
    $("#hide-sb-link").click(toggleSidebar);
});

