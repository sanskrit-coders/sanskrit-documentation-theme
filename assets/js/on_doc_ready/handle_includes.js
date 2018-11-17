
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
function fixIncludedHtml(url, html, newLevelForH1) {
    // We want to use jquery to parse html, but without loading images. Hence this.
    // Tip from: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
    var virtualDocument = document.implementation.createHTMLDocument('virtual');
    var jqueryElement = $(html, virtualDocument);
    // Deal with includes within includes. Do this before fixing images urls etc.. because there may be images within the newly included html.
    jqueryElement.find('.js_include').each(function() {
        if (newLevelForH1 < 1) {
            console.error("Ignoring invalid newLevelForH1: %d, using 6", newLevelForH1);
            newLevelForH1 = 6;
        }
        var jsIncludeElement = $(this);
        var includedPageNewLevelForH2 = parseInt(jsIncludeJqueryElement.attr("newLevelForH1"));
        if (includedPageNewLevelForH2 == undefined) {
            includedPageNewLevelForH2 = 6;
        }
        includedPageNewLevelForH2 = Math.min(6, ((includedPageNewLevelForH2 - 2) + newLevelForH1));
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
        var hLevelNew = Math.min(6, newLevelForH1 - 1 + hLevel)
        return $("<h" + hLevelNew +" id='" + headerElement.id + "'/>").append(headerElement.contents());
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
    jqueryElement.find("#toc").remove()

    return jqueryElement;
}

function fillJsInclude(jsIncludeJqueryElement, includedPageNewLevelForH1) {
    var includedPageUrl = jsIncludeJqueryElement.attr("url").replace(".md", ".html");
    if (includedPageNewLevelForH1 == undefined) {
        includedPageNewLevelForH1 = parseInt(jsIncludeJqueryElement.attr("newLevelForH1"));
    }
    if (includedPageNewLevelForH1 == undefined) {
        includedPageNewLevelForH1 = 6;
    }
    $.ajax(includedPageUrl,{
        success: function(responseHtml) {
            // We want to use jquery to parse html, but without loading images. Hence this.
            // Tip from: https://stackoverflow.com/questions/15113910/jquery-parse-html-without-loading-images
            var virtualDocument = document.implementation.createHTMLDocument('virtual');

            var titleElements = $(responseHtml, virtualDocument).find(".post-title-main");
            var title = "";
            if (titleElements.length > 0) {
                console.debug(titleElements[0]);
                title = titleElements[0].textContent;
            }

            var contentElements = $(responseHtml, virtualDocument).find(".post-content");
            // console.log(contentElements);
            if (contentElements.length == 0) {
                console.warn("Could not get \"post-content\" class element.");
                console.log(responseHtml);
            } else {
                // We don't want multiple post-content divs, hence we replace with an included-post-content div.
                var elementToInclude = $("<div class='included-post-content'/>")
                var titleHtml = "";
                if (jsIncludeJqueryElement.attr("includeTitle")) {
                    titleHtml = "<h1>" + title + "</h1>";
                }
                elementToInclude.html(titleHtml + contentElements[0].innerHTML);
                var contentElement = fixIncludedHtml(includedPageUrl, elementToInclude, includedPageNewLevelForH1);
                jsIncludeJqueryElement.html(contentElement);
            }
        }
    });
}

function updateToc() {
    var toc = "";
    var level = 0;

    document.getElementById("contents").innerHTML =
        document.getElementById("contents").innerHTML.replace(
            /<h([\d])>([^<]+)<\/h([\d])>/gi,
            function (str, openLevel, titleText, closeLevel) {
                if (openLevel != closeLevel) {
                    return str;
                }

                if (openLevel > level) {
                    toc += (new Array(openLevel - level + 1)).join("<ul>");
                } else if (openLevel < level) {
                    toc += (new Array(level - openLevel + 1)).join("</ul>");
                }

                level = parseInt(openLevel);

                var anchor = titleText.replace(/ /g, "_");
                toc += "<li><a href=\"#" + anchor + "\">" + titleText
                    + "</a></li>";

                return "<h" + openLevel + "><a name=\"" + anchor + "\">"
                    + titleText + "</a></h" + closeLevel + ">";
            }
        );

    if (level) {
        toc += (new Array(level + 1)).join("</ul>");
    }

    document.getElementById("toc").innerHTML += toc;
}

// Process includes of the form:
// <div class="js_include" url="index.md"/> 
$( document ).ready(function() {
    $('.js_include').each(function() {
        var jsIncludeJqueryElement = $(this);
        // console.log(jsIncludeJqueryElement);
        fillJsInclude(jsIncludeJqueryElement);
        // TODO: A major defect is that includes don't show up in the table of contents automatically.
        // It is unclear why the #toc call, which happens after this, does not work.
    });
});

