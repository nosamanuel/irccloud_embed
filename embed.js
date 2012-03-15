var IRCCloudEmbed = function() {
    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match&&match[7].length==11) {
            return match[7];
        }

        return false;
    }

    function is_image_href(href) {
        return (href.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/) !== null);
    }

    function is_youtube(href) {
        return youtube_parser(href) != false;
    }

    function embed_image(message_row, href) {
        // Append image to current message row
        var message = $("<div>");
        message.addClass("message");
        var image = $("<img>");
        image.attr("src", href);
        message.append(image);
        message_row.append(message);

        // Cancel any previous scroll events
        image.addClass("irccloud-embed");
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

    function process_row(message_row) {
        message_row.find("a.link").each(function() {
            href = $(this).attr("href") || '';
            if (is_image_href(href)) {
                embed_image(message_row, href);
            } else if (is_youtube(href)) {
                embed_youtube(message_row, href);
            }
        });
    }

    function watch() {
        // Watch for new messages and embed any image links
        $("div.log").live("DOMNodeInserted", function(event) {
            var node = $(event.target);
            if (node.hasClass("messageRow")) {
                process_row(node);
            }
        });
    }

    $(document).ready(watch);
}();
