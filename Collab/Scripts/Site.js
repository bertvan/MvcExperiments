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

    // knockout
    ko.applyBindings(new ParagraphEditingViewModel());

    //initHoveringMenu();

    initChangeDetection();
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

    $('.paragraph-text').live('change', function () {
        var paragraph = ko.dataFor(this);

        $.post('/Home/ProcessParagraph',
        {
            id: 0,
            text: paragraph.text
        }, function (data) {
            // nothing for now
        });
    });

}

function initHoveringMenu() {

    //$('.paragraph-container').hide();

    $('.paragraph-container').hover(
        function () {
            displayHoveringMenu($(this));
        },
        function () {
            hideHoveringMenu($(this));
        }
    );
}

function displayHoveringMenu(paragraphElement) {
    $(paragraphElement).children('.paragraph-menu').show();
}

function hideHoveringMenu(paragraphElement) {
    $(paragraphElement).children('.paragraph-menu').hide();
}