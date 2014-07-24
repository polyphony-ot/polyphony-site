var client = new polyphony.Client("ws://localhost:8080");
var editor = new Quill("#editor");
var adapter = new polyphony.QuillAdapter(editor, client);
