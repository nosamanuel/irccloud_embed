var IRCCloudEmbed = function() {
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[7].length==11) {
            return match[7];
        }

        return false;
    }

    function vimeo_parser(url) {
        var regExp = /https?:\/\/(?:www\.)?vimeo.com\/(?:channels\/|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
        var match = url.match(regExp);

        if(match) {
            return match[3];
        }

        return false;
    }

    function is_image_href(href) {
        return (/\.(png|jpg|jpeg|gif)($|\?)/i).test(href);
    }

    function is_youtube(href) {
        return youtube_parser(href) !== false;
    }

    function is_vimeo(href) {
        return vimeo_parser(href) !== false;
    }

    function is_imgur(href){
        return (/imgur\.com\/.+$/i).test(href);
    }

    function embed_image(message_row, href) {
        // Append image to current message row
        var MEDIA_HEIGHT = 100,
            message = $("<div>");
        message.addClass("message");
        var image = $('<img class="irccloud-embed" height=' + MEDIA_HEIGHT + '>')
            .error(function(){ message.remove(); })
            .attr("src", href)
            .load(function(){
                var $this = $(this);
                $this.attr('title', this.naturalWidth + " x " + this.naturalHeight);
                if (this.naturalHeight < MEDIA_HEIGHT){
                    $this.removeAttr('height');
                }
            })
            .click(function(){
                var $this = $(this);
                if ($this.attr('height')){
                    $this.removeAttr('height');
                } else {
                    $this.attr('height', MEDIA_HEIGHT);
                }

            });
        message.append(image);
        message_row.append(message);

        // Cancel any previous scroll events
        $("img.irccloud-embed").unbind("load");

        // Scroll to end once image loads
        $(image).load(function() {
            var scroll = message_row.parents(".scroll")[0];
            var log = message_row.parents(".log")[0];
            $(scroll).animate({scrollTop: $(log).height()}, 0);
        });
    }

    function embed_youtube(message_row, href) {
        var videoId = youtube_parser(href);

        var embedString = '<iframe width="560" height="315" src="http://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';

        var message = $("<div>");
        message.addClass("message");


        var video = $(embedString);
        message.append(video);
        message_row.append(message);

        // Cancel any previous scroll events
        video.addClass("irccloud-embed");
        $("iframe.irccloud-embed").unbind("load");

        // Scroll to end once image loads
        $(video).load(function() {
            var scroll = message_row.parents(".scroll")[0];
            var log = message_row.parents(".log")[0];
            $(scroll).animate({scrollTop: $(log).height()}, 0);
        });
    }

    function embed_vimeo(message_row, href) {
        var videoId = vimeo_parser(href);
        var embedString = '<iframe src="http://player.vimeo.com/video/' + videoId + '" width="500" height="281" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
        var message = $("<div>");
        message.addClass("message");

        var video = $(embedString);
        message.append(video);
        message_row.append(message);

        // Cancel any previous scroll events
        video.addClass("irccloud-embed");
        $("iframe.irccloud-embed").unbind("load");

        // Scroll to end once image loads
        $(video).load(function() {
            var scroll = message_row.parents(".scroll")[0];
            var log = message_row.parents(".log")[0];
            $(scroll).animate({scrollTop: $(log).height()}, 0);
        });
    }

    function embed_imgur_basic(message_row, href) {
        var bits = href.split('/');
        var src = "http://i.imgur.com/" + bits[bits.length - 1] + ".jpg";
        embed_image(message_row, src);
    }

    function embed_imgur(message_row, href){
        // TODO
        var bits = href.split('/');
        var image_id = bits[bits.length - 1];
        var thumbnail_src = "http://i.imgur.com/" + image_id + "b.jpg";
    }

    function process_row(message_row) {
        message_row.find("a.link").each(function() {
            href = $(this).attr("href") || '';
            if (is_image_href(href)) {
                embed_image(message_row, href);
            } else if (is_youtube(href)) {
                embed_youtube(message_row, href);
            } else if (is_vimeo(href)) {
                embed_vimeo(message_row, href);
            } else if (is_imgur(href)) {
                embed_imgur_basic(message_row, href);
            }
        });
    }

    function watch() {
        // Watch for new messages and embed any image links
        $("#maincell").on("DOMNodeInserted", "div.log", function(event) {
            var node = $(event.target);
            if (node.hasClass("messageRow")) {
                process_row(node);
            }
        });
    }

    $(document).ready(watch);
}();
