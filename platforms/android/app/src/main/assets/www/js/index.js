
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
var API = "http://192.168.1.109:1045/api";
$(document).ready(function() {
  // preenchimento do select de sala comerciais
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/salasComerciais",
    "method": "GET",
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {
    
    indice = -1;
    response.salascomercias.forEach(project => {
      indice += 1;
      $('#salacomercial').append('<option value="' + response.salascomercias[indice].id + '">' + response.salascomercias[indice].nome + '</option>');
    });
  });
  // listando vistorias
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/listaVistorias",
    "method": "GET",
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {
    for(var i = 0; i < response.vistorias.length; i++) {
      $('#listagem-vistorias').append('<div class="listagem-vistorias"><div><div><span>Sala Comercial</span><p>' + response.vistorias[i].nome + '</p></div>' +
      '<div><span>Data</span><p>' + response.vistorias[i].datavistoria + '</p></div><div><span>Comentario</span><p>' + response.vistorias[i].comentario + '</p></div></div>'+
      '<div><div><a href="#form-app" class="btn text-primary" onclick="editarVistoria(' + response.vistorias[i].idVistoria + ');"><span>Editar</span><i class="fa fa-magic"></i></a></div>'+
      '<div><button type="button" class="btn text-danger" onclick="excluirVistoria(' + response.vistorias[i].idVistoria + ');"><span>Excluir</span><i class="fas fa-times"></i></button></div>'+
      '<div><button type="button" class="btn text-warning" id="btn-visualizar' + response.vistorias[i].idVistoria + '" value="1" onclick="visualizarRespostas(' + response.vistorias[i].idVistoria + ');"><span>Perguntas</span><i class="fas fa-angle-down"></i></button></div></div>'+
      '<div class="listagem-perguntas" id="listagem-perguntas' + response.vistorias[i].idVistoria + '"><h5 class="esp-perguntas" id="esp-perguntas' + response.vistorias[i].idVistoria + '" style="display: none;">Perguntas</h5></div></div>');
    }
  });
});

var idVistoria;
document.querySelector(".botaosalvar").addEventListener("click", function(event) {
    // adicionando uma vistoria no banco
    event.preventDefault();
    var select = document.querySelector("#salacomercial");
    var valueOpition = select.options[select.selectedIndex].value;
    var data = document.querySelector('#data').value;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/vistorias",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "datavistoria_app": data,
        "salacomercial_app": valueOpition
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
      select.value = '';
      document.querySelector('#data').value = '';
    })
    // retirando da tela o formulario da vistoria
    $("#form-app").attr("style","display:none");
    // adicionando o formulario das perguntas
    $("#form-perguntas").attr("style","display:block");
    // Listando as perguntas do banco
    var indice = -1;
    $('#perguntas').empty(); 
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/perguntas",
      "method": "GET",
      "headers": {}
    }
    $.ajax(settings).done(function (response) {
      response.perguntas.forEach(project => {
        indice += 1;
        $('#perguntas').append('<div><p>'+ response.perguntas[indice].pergunta +'</p><div><button type="button" class="btn btn-success btn-situacao-' + response.perguntas[indice].id + '" value="' + response.perguntas[indice].id + '" onclick="adicionarResposta(' + response.perguntas[indice].id + ', 1);"><i class="far fa-thumbs-up"></i><span class="span-btn">OK</span></button>'+
        '<button type="button" class="btn btn-danger btn-situacao-' + response.perguntas[indice].id + '" value="' + response.perguntas[indice].id + '" onclick="adicionarResposta(' + response.perguntas[indice].id + ', 0);"><i class="far fa-thumbs-down"></i><span class="span-btn">N OK</span></button></div>'+ 
        '<div id="situacao-' + response.perguntas[indice].id + '"></div></div>');
      });
    });
});
function adicionarResposta(idResposta, situacao) {
  var idVistoria;
  $(".btn-situacao-"+idResposta).attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/ultimaVistorias",
    "method": "GET",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    idVistoria = response.vistorias;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/respostas",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "situacao_app": situacao,
        "vistoria_app": idVistoria,
        "pergunta_app": idResposta
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
    });
  });
  if (situacao == 0) {
    $('#situacao-'+idResposta).append('<div class="situacao-resposta"><i class="far fa-thumbs-down"></i><span>N OK</span><div>');
  } else {
    $('#situacao-'+idResposta).append('<div class="situacao-resposta"> <i class="far fa-thumbs-up"></i><span>OK</span></div>');
  }
}

document.querySelector(".botaosalvarperguntas").addEventListener('click', function(event){
  event.preventDefault();
  $("#form-perguntas").attr("style","display:none");
  $("#form-comentario").attr("style","display:block");
});
document.querySelector(".botaosalvarcomentario").addEventListener('click', function(event){
  event.preventDefault();
  var comentario = $('#comentario').val();
  var idVistoria;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/ultimaVistorias",
    "method": "GET",
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {
    idVistoria = response.vistorias;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/comentarios",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded"
      },
      "data": {
        "comentario_app": comentario,
        "vistoria_app": idVistoria
      }
    }
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      window.location.reload();
    });
  });
});


//Visualizar respostas
function visualizarRespostas(id) {
  var valor = $("#btn-visualizar"+id).val();
  
  if (valor == 1) {
    $("#listagem-perguntas"+id).attr("style","display:block");
    $("#esp-perguntas"+id).attr("style","display:block");
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/listaPerguntas/"+ id,
      "method": "GET",
      "headers": {}
    }
    
    $.ajax(settings).done(function (response) {
      for(var i = 0; i < response.respostas.length; i++){
        if (response.respostas[i].situacao == 1) {
          $('#listagem-perguntas'+id).append('<div><span>' + response.respostas[i].pergunta + '</span><div><i class="far fa-thumbs-up"></i><span>OK</span></div></div>');
        } else {
          $('#listagem-perguntas'+id).append('<div><span>' + response.respostas[i].pergunta + '</span><div><i class="far fa-thumbs-down"></i><span>N OK</span></div></div>');
        }
      }
    });
    valor = $("#btn-visualizar"+id).val(0);
  } else if(valor == 2) {
    $("#listagem-perguntas"+id).attr("style","display:block");
    $("#esp-perguntas"+id).attr("style","display:block");
    valor = $("#btn-visualizar"+id).val(0);
  } else {
    $("#listagem-perguntas"+id).attr("style","display:none");
    $("#esp-perguntas"+id).attr("style","display:none");
    valor = $("#btn-visualizar"+id).val(2);
  }
}
// parte de editar vistorias
function editarVistoria(id) {
  //retirando o botao de adicionar
  $(".botaosalvar").attr("style","display:none");
  $(".listagem").attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/vistorias/"+id,
    "method": "GET",
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {
    $('#data').val(response.vistorias.datavistoria);
    $("#salacomercial").val(response.vistorias.salacomercial); 
    $('.hidden').append('<button type="submit" class="btn btn-danger botaoeditarsalvar" onclick="editaV(' + id + ');"><i class="far fa-save"></i>Salvar</button>');
  });
}
function editaV(id) {
  event.preventDefault();
  var select = document.querySelector("#salacomercial");
  var valueOpition = select.options[select.selectedIndex].value;
  var data = document.querySelector('#data').value;
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/vistorias/"+id,
    "method": "PUT",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "datavistoria_app": data,
      "salacomercial_app": valueOpition
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  // retirando da tela o formulario da vistoria
  $("#form-app").attr("style","display:none");
  // adicionando o formulario das perguntas
  $("#form-perguntas").attr("style","display:block");
  //retirando o botao salvar das perguntas
  $(".botaosalvarperguntas").attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/listaPerguntas/"+id,
    "method": "GET",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    for(var i = 0; i < response.respostas.length; i++) {
      if(response.respostas[i].situacao == 1) {
        $('#perguntas').append('<div><p>'+ response.respostas[i].pergunta +'</p><div><div class="up-sit' + response.respostas[i].idPergunta + '"><i class="far fa-thumbs-up"></i><span>OK</span></div><button type="button" class="btn btn-success btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 1);"><i class="far fa-thumbs-up"></i><span class="span-btn">OK</span></button>'+
        '<button type="button" class="btn btn-danger btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 0);"><i class="far fa-thumbs-down"></i><span class="span-btn">N OK</span></button></div>'+ 
        '<div id="situacao-' + response.respostas[i].idPergunta + '"></div></div>');
      } else {
        $('#perguntas').append('<div><p>'+ response.respostas[i].pergunta +'</p><div><div class="up-sit' + response.respostas[i].idPergunta + '"><i class="far fa-thumbs-down"></i><span>N OK</span></div><button type="button" class="btn btn-success btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 1);"><i class="far fa-thumbs-up"></i><span class="span-btn">OK</span></button>'+
        '<button type="button" class="btn btn-danger btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 0);"><i class="far fa-thumbs-down"></i><span class="span-btn">N OK</span></button></div>'+ 
        '<div id="situacao-' + response.respostas[i].idPergunta + '"></div></div>');
      }
    }
  });
  $('.div-btn-perguntas').append('<button type="submit" class="btn btn-danger botaoeditarperguntas" onclick="editarComentario(' + id + ');"><i class="far fa-save"></i>Salvar</button>');
}
function editaP(idPergunta, idResposta, idVistoria, situacao) {
  $(".btn-situacao-"+idPergunta).attr("style","display:none");
  $(".up-sit"+idPergunta).attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/respostas/"+idResposta,
    "method": "PUT",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "situacao_app": situacao,
      "vistoria_app": idVistoria,
      "pergunta_app": idPergunta
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  if (situacao == 0) {
    $('#situacao-'+idPergunta).append('<div class="situacao-resposta"><i class="far fa-thumbs-down"></i><span>N OK</span><div>');
  } else {
    $('#situacao-'+idPergunta).append('<div class="situacao-resposta"> <i class="far fa-thumbs-up"></i><span>OK</span></div>');
  }
}
function editarComentario(id) {
  event.preventDefault();
  $("#form-perguntas").attr("style","display:none");
  $("#form-comentario").attr("style","display:block");
  $("#botaosalvarcomentario").attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/comentarios/"+id,
    "method": "GET",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    $('#comentario').val(response.comentarios[0].comentario);
  });

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/comentarios/"+id,
    "method": "GET",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    $('.div-btn-comentarios').append('<button type="submit" class="btn btn-danger botaoeditarcomentario" onclick="editaC(' + response.comentarios[0].idComentario + ', ' + id + ');"><i class="far fa-save"></i>Salvar</button>');
  });
}
function editaC(idComentario, idVistoria) {
  event.preventDefault();
  var comentario = $("#comentario").val();
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/comentarios/"+idComentario,
    "method": "PUT",
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "data": {
      "comentario_app": comentario,
      "vistoria_app": idVistoria
    }
  }
  
  $.ajax(settings).done(function (response) {
    console.log(response);
    window.location.reload();
  });
}
// parte de excluir vistoria
function excluirVistoria(id) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/comentarios/"+id,
    "method": "DELETE",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/respostas/"+id,
    "method": "DELETE",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
  });
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/vistorias/"+id,
    "method": "DELETE",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    console.log(response);
    window.location.reload();
  });
}

app.initialize();