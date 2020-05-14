
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

$(document).ready(function() {
  
});


document.querySelector("#form-app").addEventListener("submit", function(event) {
    var select = document.querySelector("#salacomercial");
    var valueOpition = select.options[select.selectedIndex].value;
    var data = document.querySelector('#data').value;
    var comentario = document.querySelector("#comentario").value;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://192.168.1.109:1045/api/vistorias",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "comentario_app": comentario,
        "datavistoria_app": data,
        "salacomercial_app": valueOpition
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    });
});

app.initialize();