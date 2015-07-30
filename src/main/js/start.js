define(function() {

    var start = function() {
        var content = document.getElementById('content');
        if (content) {
            content.innerHTML = 'Hello World';
        }
    }

    if (document.readyState == "complete" || document.readyState == "loaded") {
        start();
    }
    else {
        document.addEventListener("DOMContentLoaded", start);
    }



});
