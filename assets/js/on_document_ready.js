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

// Process includes of the form:
// <div class="js_include" url="index.md"/> 
$( document ).ready(function() {
    $('.js_include').each(function() {
        var jsIncludeJqueryElement = $(this);
        // console.log(jsIncludeJqueryElement);
        var url = jsIncludeJqueryElement.attr("url").replace(".md", ".html");
        $.ajax(url,{
            success: function(responseHtml) {
                var contentElements = $(responseHtml).find(".post-content");
                // console.log(contentElements);
                if (contentElements.length == 0) {
                    console.warn("Could not get \"post-content\" class element.");
                    console.log(responseHtml);
                } else {
                    var contentElement = contentElements[0];
                    jsIncludeJqueryElement.html(contentElement);
                    jsIncludeJqueryElement.find(":header").replaceWith(function() {
                        return $("<h6 />").append($(this).contents());
                    });
                    // TODO: Fix image urls.
                }
            }
        });
    });
});