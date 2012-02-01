function Paragraph(id, text)
{
    var self = this;
    self.text = text;
    self.id = id;
}

function ParagraphEditingViewModel(){
    this.paragraphs = ko.observableArray(
    [
        new Paragraph(0, "bla"),
        new Paragraph(1, "foo"),
        new Paragraph(2, "hihihi")
    ]);
}

function initParagraphEditing() {

    // signalR (comments not mine, but from an original sample I used
    // over at: http://www.dreamincode.net/forums/blog/1267/entry-3681-signalr-with-mvc3-chat-app-build-asynchronous-real-time-persistant-connection-websites/
    
    // Proxy created on the fly
    var paragraphHub = $.connection.paragraphHub;

    // Declare a function on the chat hub so the server can invoke it
    paragraphHub.reloadParagraphs = function (paragraphs) {
        //alert('go go go');
    };

    // Start the connection
    $.connection.hub.start();

    // knockout
    ko.applyBindings(new ParagraphEditingViewModel());

    // trigger actions on paragraph change
    initChangeDetection();

    // trigger signalR from paragraph change event
    $('.paragraph-text').live('change', function () {
        var paragraph = ko.dataFor(this);

//        $.post('/Home/ProcessParagraph',
//        {
//            id: 0,
//            text: paragraph.text
//        }, function (data) {
//            // nothing for now
        //        });

        // Call the paragraphHub method on the server
        paragraphHub.send(
        {
            id: 0,
            text: $(this).html() // todo, KnockoutJS binding does not seem to work that way, so fetching myself here :s
        });
    });
}

function initChangeDetection() {

    $('[contenteditable]').live('focus', function () {
        var $this = $(this);
        $this.data('before', $this.html());
        return $this;
    }).live('blur', function () {
        var $this = $(this);
        if ($this.data('before') !== $this.html()) {
            $this.data('before', $this.html());
            $this.trigger('change');
        }
        return $this;
    });

}