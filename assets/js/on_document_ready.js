$('#displayed_sidebar').height($(".nav").height());


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
function fixIncludedHtml(url, html) {

    // Deal with includes within includes. Do this before fixing images urls etc.. because there may be images within the newly included html.
    $(html).find('.js_include').each(function() {
        fillJsInclude($(this));
    });
    
    /*
    Fix headers in the included html so as to not mess up the table of contents 
    of the including page.
    Adjusting the heading levels to retain substructure seems more complicated -
    getting the heading "under" which jsIncludeJqueryElement falls seems non-trivial.
     */
    $(html).find(":header").replaceWith(function() {
        return $("<h6 />").append($(this).contents());
    });

    // Fix image urls.
    $(html).find("img").each(function() {
        $(this).attr("src", absoluteUrl(url, $(this).attr("src")));
    });

    // Fix links.
    $(html).find("a").each(function() {
        $(this).attr("href", absoluteUrl(url, $(this).attr("href")));
    });

    return $(html);
}

function fillJsInclude(jsIncludeJqueryElement) {
    var includedPageUrl = jsIncludeJqueryElement.attr("url").replace(".md", ".html");
    $.ajax(includedPageUrl,{
        success: function(responseHtml) {
            var contentElements = $(responseHtml).find(".post-content");
            // console.log(contentElements);
            if (contentElements.length == 0) {
                console.warn("Could not get \"post-content\" class element.");
                console.log(responseHtml);
            } else {
                var contentElement = fixIncludedHtml(includedPageUrl, contentElements[0]);
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