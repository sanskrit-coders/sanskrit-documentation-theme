$('#displayed_sidebar').height($(".nav").height());

function getSidebarItemHtml(sidebarItem) {
    var item_url_stripped = sidebarItem.url || "#";
    item_url_stripped = item_url_stripped.replace("index.html", "").replace(".md", ".html");

    var urlTarget = "";
    if (item_url_stripped.startsWith("http://") || item_url_stripped.startsWith("https://") || item_url_stripped.startsWith("ftp://")) {
        urlTarget = "_newTab";
    }
    // console.debug(item_url_stripped);
    var list_item_css_class = "inactive";
    if (pageSettings.url.replace("#[^/]*$", "") == item_url_stripped) {
        list_item_css_class = "active";
    }
    // console.debug(sidebarItem);
    if(sidebarItem.hasOwnProperty("contents")) {
        var contentHtml = "";
        for(let subitem of sidebarItem.contents) {
            contentHtml = `${contentHtml}\n ${getSidebarItemHtml(subitem)}`;
        }
        var title = sidebarItem.title || pageUrlToTitle[item_url_stripped];
        var itemHtml = `<li><a href="${item_url_stripped}"> ${title}</a>\n<ul>${contentHtml}\n</ul>\n</li>\n`;
    } else if (sidebarItem.url.startsWith("dir://")) {
        var dirUrl = sidebarItem.url.replace("dir://", "/");
        if (dirUrl.endsWith("/")) {
            dirUrl = dirUrl.slice(0,-1);
        }
        if (dirUrl in pageDirectoryToUrl) {
            var itemHtml = "";
            // console.debug(dirUrl);
            for (let contentUrl of pageDirectoryToUrl[dirUrl]) {
                var subitem = {"url": contentUrl};
                itemHtml = `${itemHtml}\n ${getSidebarItemHtml(subitem)}`;
            }
        } else {
            console.error(`No such directory ${dirUrl}`)
        }
    }
    else {
        var title = sidebarItem.title || pageUrlToTitle[item_url_stripped];
        var itemHtml = `<li class="${list_item_css_class}"><a href="${siteBaseurl + item_url_stripped }" target="">${title}</a></li>`;
    }
    return itemHtml;
}

function insertSidebarItems() {
    var sidebar = siteData.sidebars[pageSettings.sidebar];
    $("#displayed_sidebar .sidebarTitle").html(sidebar.title);
    // console.debug(sidebar);
    for (let sidebarItem of sidebar.contents) {
        $("#displayed_sidebar").append(getSidebarItemHtml(sidebarItem));
    }
    // this highlights the active parent class in the navgoco sidebar. this is critical so that the parent expands when you're viewing a page.
    $("li.active").parents('li').addClass("active");
    $("li.active").parents('li').removeClass("inactive");
}

function insertTopnavDropdownItems() {
    var topnavDropdown = siteData.sidebars[pageSettings.topnav];
    // console.debug(topnavDropdown);
    for (let item of topnavDropdown.contents) {
        $("#topnav_dropdown").append(getSidebarItemHtml(item));
    }
    // this highlights the active parent class in the navgoco sidebar. this is critical so that the parent expands when you're viewing a page.
    $("li.active").parents('li').addClass("active");
    $("li.active").parents('li').removeClass("inactive");
}

$(document).ready(function() {
    insertSidebarItems();
    insertTopnavDropdownItems();
    // Initialize navgoco sidebar with default options
    $("#displayed_sidebar").navgoco({
        caretHtml: '',
        accordion: true,
        openClass: 'active', // open
        save: true,
        cookie: {
            name: 'navgoco_sidebar',
            expires: false,
            path: '/'
        },
        slide: {
            duration: 400,
            easing: 'swing'
        }
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
    $("#tg-sb-icon").toggleClass('fa-toggle-on');
    $("#tg-sb-icon").toggleClass('fa-toggle-off');
    $("#tg-sb-icon-content-pane").toggleClass('fa-toggle-on');
    $("#tg-sb-icon-content-pane").toggleClass('fa-toggle-off');
};

$(document).ready(function() {
    $("#tg-sb-link").click(toggleSidebar);
    $("#hide-sb-link").click(toggleSidebar);
});
