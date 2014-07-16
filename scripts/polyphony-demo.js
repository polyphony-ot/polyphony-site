var client = new libot.Client("ws://localhost:8080");
var editor = new Quill("#editor");
var adapter = new libot.QuillAdapter(editor, client);
