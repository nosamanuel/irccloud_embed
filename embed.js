var IRCCloudEmbed = function() {
    function is_image_href(href) {
        return (href.toLowerCase().match(/\.(png|jpg|jpeg|gif)$/) !== null);
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
        $("#maincell").on("DOMNodeInserted", "div.log", function(event) {
            var node = $(event.target);
            if (node.hasClass("messageRow")) {
                process_row(node);
            }
        });
    }

    $(document).ready(watch);
}();
