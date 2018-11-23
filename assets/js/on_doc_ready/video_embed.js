function get_youtube_id(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return (url.match(p)) ? RegExp.$1 : false;
}
function vimeo_embed(url,el) {
    var id = false;
    $.ajax({
        url: 'https://vimeo.com/api/oembed.json?url='+url,
        async: true,
        success: function(response) {
            if(response.video_id) {
                id = response.video_id;
                if(url.indexOf('autoplay=1') !== -1) var autoplay=1; else var autoplay=0;
                if(url.indexOf('loop=1') !== -1) var loop=1; else var loop=0;
                var theInnerHTML = '<div class="videoWrapper"><iframe src="https://player.vimeo.com/video/'+id+'/?byline=0&title=0&portrait=0';
                if(autoplay==1) theInnerHTML += '&autoplay=1';
                if(loop==1) theInnerHTML += '&loop=1';
                theInnerHTML += '" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
                el.innerHTML = theInnerHTML;
            }
        }
    });
}
function video_embed() {
    var p = document.getElementsByTagName('p');
    for(var i = 0; i < p.length; i++) {
        //check if this is an external url (that starts with https:// or http://
        if (p[i].innerHTML.indexOf("http://") == 0 ||
            p[i].innerHTML.indexOf("https://") == 0) {
            var youtube_id = get_youtube_id(p[i].innerHTML);
            if(youtube_id) {
                if(p[i].innerHTML.indexOf('autoplay=1') !== -1) var autoplay=1; else var autoplay=0;
                if(p[i].innerHTML.indexOf('loop=1') !== -1) var loop=1; else var loop=0;
                var theInnerHTML = '<div class="videoWrapper"><iframe width="720" height="420" src="https://www.youtube.com/embed/' + youtube_id + '?rel=0&showinfo=0';
                if(autoplay==1) theInnerHTML += '&autoplay=1';
                if(loop==1) theInnerHTML += '&loop=1&playlist='+youtube_id+'&version=3';
                theInnerHTML += '" frameborder="0" allowfullscreen></iframe></div>';
                p[i].innerHTML = theInnerHTML;
            }
            if(p[i].innerHTML.indexOf('vimeo.com') !== -1) {
                //ask vimeo for the id and place the embed
                vimeo_embed(p[i].innerHTML,p[i]);
            }
        }
    }
}

$(document).ready(function() {
    video_embed();
});