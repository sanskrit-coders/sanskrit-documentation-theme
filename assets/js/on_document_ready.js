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

// needed for nav tabs on pages. See Formatting > Nav tabs for more details.
// script from http://stackoverflow.com/questions/10523433/how-do-i-keep-the-current-tab-active-with-twitter-bootstrap-after-a-page-reload
// The below syntax is a shortcut for $( document ).ready(function() { …...});
//
$(function() {
    var json, tabsState;
    $('a[data-toggle="pill"], a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        var href, json, parentId, tabsState;

        tabsState = localStorage.getItem("tabs-state");
        json = JSON.parse(tabsState || "{}");
        parentId = $(e.target).parents("ul.nav.nav-pills, ul.nav.nav-tabs").attr("id");
        href = $(e.target).attr('href');
        json[parentId] = href;

        return localStorage.setItem("tabs-state", JSON.stringify(json));
    });

    tabsState = localStorage.getItem("tabs-state");
    json = JSON.parse(tabsState || "{}");

    $.each(json, function(containerId, href) {
        return $("#" + containerId + " a[href=" + href + "]").tab('show');
    });

    $("ul.nav.nav-pills, ul.nav.nav-tabs").each(function() {
        var $this = $(this);
        if (!json[$this.attr("id")]) {
            return $this.find("a[data-toggle=tab]:first, a[data-toggle=pill]:first").tab("show");
        }
    });
});

/*
Example: absoluteUrl("../subfolder1/divaspari.md", "images/forest-fire.jpg") == "../subfolder1/images/forest-fire.jpg"
 */
function absoluteUrl(base, relative) {
    // console.debug(base, relative);
    if (relative.startsWith("http") || relative.startsWith("file")) {
        return relative;
    }
    if (relative.startsWith("/") && !base.startsWith("http") && !base.startsWith("file")) {
        return relative;
    }
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

// WHen you include html from one page within another, you need to fix image urls, anchor urls etc..
function fixIncludedHtml(url, html, newLevelForH2) {
    // We want to use jquery to parse html, but without loading images. Hence this.
    // Tip from: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
    var virtualDocument = document.implementation.createHTMLDocument('virtual');
    var jqueryElement = $(html, virtualDocument);
    // Deal with includes within includes. Do this before fixing images urls etc.. because there may be images within the newly included html.
    jqueryElement.find('.js_include').each(function() {
        if (newLevelForH2 < 2) {
            console.error("Ignoring invalid newLevelForH2: %d, using 6", newLevelForH2);
            newLevelForH2 = 6;
        }
        var jsIncludeElement = $(this);
        var includedPageNewLevelForH2 = parseInt(jsIncludeJqueryElement.attr("newLevelForH2"));
        if (includedPageNewLevelForH2 == undefined) {
            includedPageNewLevelForH2 = 6;
        }
        includedPageNewLevelForH2 = Math.min(6, ((includedPageNewLevelForH2 - 2) + newLevelForH2));
        fillJsInclude($(this), includedPageNewLevelForH2);
    });
    
    /*
    Fix headers in the included html so as to not mess up the table of contents 
    of the including page.
    Adjusting the heading levels to retain substructure seems more complicated -
    getting the heading "under" which jsIncludeJqueryElement falls seems non-trivial.
     */
    jqueryElement.find(":header").replaceWith(function() {
        var headerElement = $(this);
        var hLevel = parseInt(headerElement.prop("tagName").substring(1));
        var hLevelNew = Math.min(6, newLevelForH2 - 2 + hLevel)
        return $("<h" + newLevelForH2 +"/>").append(headerElement.contents());
    });

    // Fix image urls.
    jqueryElement.find("img").each(function() {
        // console.log(absoluteUrl(url, $(this).attr("src")));
        // console.log($(this).attr("src"))
        $(this).attr("src", absoluteUrl(url, $(this).attr("src")));
        // console.log($(this).attr("src"))
    });

    // Fix links.
    jqueryElement.find("a").each(function() {
        $(this).attr("href", absoluteUrl(url, $(this).attr("href")));
    });

    // Remove some tags.
    jqueryElement.find("script").remove();
    jqueryElement.find("#disqus_thread").remove();

    return jqueryElement;
}

function fillJsInclude(jsIncludeJqueryElement, includedPageNewLevelForH2) {
    var includedPageUrl = jsIncludeJqueryElement.attr("url").replace(".md", ".html");
    if (includedPageNewLevelForH2 == undefined) {
        includedPageNewLevelForH2 = parseInt(jsIncludeJqueryElement.attr("newLevelForH2"));
    }
    if (includedPageNewLevelForH2 == undefined) {
        includedPageNewLevelForH2 = 6;
    }
    $.ajax(includedPageUrl,{
        success: function(responseHtml) {
            // We want to use jquery to parse html, but without loading images. Hence this.
            // Tip from: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
            var virtualDocument = document.implementation.createHTMLDocument('virtual');

            var contentElements = $(responseHtml, virtualDocument).find(".post-content");
            // console.log(contentElements);
            if (contentElements.length == 0) {
                console.warn("Could not get \"post-content\" class element.");
                console.log(responseHtml);
            } else {
                // We don't want multiple post-content divs, hence we replace with an included-post-content div.
                var elementToInclude = $("<div class='included-post-content'/>")
                elementToInclude.html(contentElements[0].innerHTML);
                var contentElement = fixIncludedHtml(includedPageUrl, elementToInclude, includedPageNewLevelForH2);
                jsIncludeJqueryElement.html(contentElement);
            }
        }
    });
}

// Process includes of the form:
// <div class="js_include" url="index.md"/> 
$( document ).ready(function() {
    $('.js_include').each(function() {
        var jsIncludeJqueryElement = $(this);
        // console.log(jsIncludeJqueryElement);
        fillJsInclude(jsIncludeJqueryElement);
    });
});