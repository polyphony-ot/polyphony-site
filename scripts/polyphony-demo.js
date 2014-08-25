var client = new polyphony.Client("ws://" + window.location.hostname + ":51015");
var editor = new Quill("#editor", {
	styles: {
		body: {
			"font-family": "Calibri, serif",
			"font-size": "1em",
		}
	}
});
var adapter = new polyphony.QuillAdapter(editor, client);
