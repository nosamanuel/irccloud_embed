var IRCCloudEmbed = function() {
    function is_image_href(href) {
        return (href.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/) !== null);
    }

    function embed_image(message_row, href) {
        var message = $("<div>");
        var image = $("<img>");
        message.addClass("message");
        image.attr("src", href);
        message.append(image);
        message_row.append(message);
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
