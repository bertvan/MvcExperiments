function Paragraph(id, text)
{
    var self = this;
    self.text = text;
    self.id = id;

    self.save = function (text) {

    	// Call the paragraphHub method on the server
    	// improvement needed, KnockoutJS binding does not seem to work that way, so fetching myself here :s
    	// so I actually should be able to use paragraph.text ... ?
    	var paragraphHub = $.connection.paragraphHub;
    	paragraphHub.send(
        {
        	id: self.id,
        	text: text
        });
    };
}

function ParagraphEditingViewModel() {

	var self = this;

    self.paragraphs = ko.observableArray(
    [
        new Paragraph(0, "bla"),
        new Paragraph(1, "foo"),
        new Paragraph(2, "hihihi")
    ]);

    self.updateParagraphs = function (data) {
    	// data received in viewmodel
    	var mapped = $.map(data, function (item) { return new Paragraph(item.Id, item.Text) });
    	self.paragraphs(mapped);
	}
}

function initParagraphEditing() {

	var model = new ParagraphEditingViewModel();

    // signalR (comments not mine, but from an original sample I used
    // over at: http://www.dreamincode.net/forums/blog/1267/entry-3681-signalr-with-mvc3-chat-app-build-asynchronous-real-time-persistant-connection-websites/
    
    // Proxy created on the fly
    var paragraphHub = $.connection.paragraphHub;

    // Declare a function on the chat hub so the server can invoke it
    paragraphHub.reloadParagraphs = function (paragraphs) {
    	model.updateParagraphs(paragraphs);
    	// TODO, more logic needs to go into the ViewModel, to callback on it when the 
    	// data is reloaded: see example on http://learn.knockoutjs.com/#/?tutorial=loadingsaving
    };

    // Start the connection
    $.connection.hub.start();

    // trigger actions on paragraph change
    initChangeDetection();
	
    // knockout
    ko.applyBindings(model);

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

    // trigger viewmodel paragraph change event
	// again too bad we can't make this happen with binding
    $('.paragraph-text').live('change', function () {
    	var paragraph = ko.dataFor(this);
    	var text = $(this).html();
    	paragraph.save(text);
    });

}