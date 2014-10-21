var editor = new Quill("#editor", {
    styles: {
        body: {
            "font-family": "Calibri, serif",
            "font-size": "1em",
        }
    }
});

var client = new polyphony.Client("ws://" + window.location.hostname + ":51015");
client.maxSize = 1024;

var adapter = new polyphony.QuillAdapter(editor, client);

var errorContainer = document.getElementById("errorContainer");
var errorFadeTimeout;
adapter.onError = function(message) {
    if (errorFadeTimeout) {
        clearTimeout(errorFadeTimeout);
    }

    errorContainer.classList.add("visible");
    errorFadeTimeout = setTimeout(function() {
        errorContainer.classList.remove("visible");
    }, 1000);
}
