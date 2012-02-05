var IRCCloudEmbed = function() {
    function is_image_href(href) {
        return (href.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/) !== null);
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
        return;
    }

    function process_row(message_row) {
        message_row.find("a.link").each(function() {
            href = $(this).attr("href") || '';
            if (is_image_href(href)) {
                embed_image(message_row, href);
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
