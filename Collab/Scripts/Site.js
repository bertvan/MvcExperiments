function Paragraph(id, text)
{
    var self = this;
    self.text = text;
    self.id = id;

    self.save = function (text) {

        // text will need some preocessing before sending it over the wire
//        var processedText = text
//            .replace('<div>', '\\n\\n')
    	//            .replace('</div>', '');

    	var textEncoded = $('<div/>').text(text).html();

        //processedText;

        // Call the paragraphHub method on the server
        // improvement needed, KnockoutJS binding does not seem to work that way, so fetching myself here :s
        // so I actually should be able to use paragraph.text ... ?
        var paragraphHub = $.connection.paragraphHub;
        paragraphHub.send(
        {
            id: self.id,
            text: textEncoded
        });
    };
}

function ParagraphEditingViewModel() {

	var self = this;

	self.paragraphs = ko.observableArray([]);

	self.updateParagraphs = function (data) {

		// data received in viewmodel
		var mapped = $.map(data, function (item) {

			//var processedText = item.Text.replace('\\n\\n', '<br/>');
			//return new Paragraph(item.Id, processedText)
			return new Paragraph(item.Id, item.Text)

		});

		self.paragraphs(mapped);
	};

	// load initial state from the server
	$.getJSON("/paragraph/list", function (allData) {
		//var mappedTasks = $.map(allData, function (item) { return new Task(item) });
		//self.tasks(mappedTasks);
		self.updateParagraphs(allData);
	});
}

function initParagraphEditing() {

    createCustomKnockoutBindings();

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

// all commented out, trying to do change detection directly through KOJS now

//    $('[contenteditable].paragraph-text').focus(function(){
//        var $this = $(this);
//        $this.data('before', $this.html());
//        return $this;
//    });

//    $('[contenteditable].paragraph-text').blur(function(){
//        var $this = $(this);
//        if ($this.data('before') !== $this.html()) {
//            $this.data('before', $this.html());
//            $this.trigger('change');
//        }
//        return $this;
//    });

    // trigger viewmodel paragraph change event
	// again too bad we can't make this happen with binding
//    $('.paragraph-text').live('change', function () {
//    	var paragraph = ko.dataFor(this);
//    	var text = $(this).html();
//    	paragraph.save(text);
//    });

}

function createCustomKnockoutBindings() {

    // htmlValue binding
    // see also: http://jsfiddle.net/rniemeyer/JksKx/
    // and http://stackoverflow.com/questions/6987132/knockoutjs-html-binding
    ko.bindingHandlers.htmlValue = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            ko.utils.registerEventHandler(element, "blur", function () {
                var modelValue = valueAccessor();
                var elementValue = element.innerHTML;
                if (ko.isWriteableObservable(modelValue)) {
                    modelValue(elementValue);
                }
                else { //handle non-observable one-way binding
                    var allBindings = allBindingsAccessor();
                    if (allBindings['_ko_property_writers'] && allBindings['_ko_property_writers'].htmlValue) allBindings['_ko_property_writers'].htmlValue(elementValue);
                }
            })
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor()) || "";
            element.innerHTML = value;
        }
    };

    // htmlChange binding
    ko.bindingHandlers.htmlChange = {
        init: function (element, valueAccessor) {

            ko.utils.registerEventHandler(element, 'focus', function () {

                $(element).data('before', $(element).html());

            });

            ko.utils.registerEventHandler(element, "blur", function () {
                var value = valueAccessor();
                var elementValue = element.innerHTML;

                if ($(element).data('before') !== $(element).html()) {
                    $(element).data('before', $(element).html());
                    value(elementValue);
                }
            });
        }
    };

}