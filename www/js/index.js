
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
var API = "https://brdvistorias.000webhostapp.com/api";
//var API = "http://192.168.1.109:1045/api";
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
      $('#salacomercial').append(`<option value="${response.salascomercias[indice].id}">${response.salascomercias[indice].nome}</option>`);
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
      $('#listagem-vistorias').append(`<div class="listagem-vistorias"><div><div><span>Sala Comercial</span><p>${response.vistorias[i].nome}</p></div>
      <div><span>Data</span><p>${response.vistorias[i].datavistoria}</p></div><div><span>Comentario</span><p>${response.vistorias[i].comentario}</p></div></div>
      <div><div><a href="#form-app" class="btn text-primary" onclick="editarVistoria(${response.vistorias[i].idVistoria});"><span>Editar</span><i class="fa fa-magic"></i></a></div>
      <div><button type="button" class="btn text-danger" onclick="excluirVistoria(${response.vistorias[i].idVistoria});"><span>Excluir</span><i class="fas fa-times"></i></button></div>
      <div><button type="button" class="btn text-warning" id="btn-visualizar${response.vistorias[i].idVistoria}" value="1" onclick="visualizarRespostas(${response.vistorias[i].idVistoria});"><span>Perguntas</span><i class="fas fa-angle-down"></i></button></div></div>
      <div class="listagem-perguntas" id="listagem-perguntas${response.vistorias[i].idVistoria}"><h5 class="esp-perguntas" id="esp-perguntas${response.vistorias[i].idVistoria}" style="display: none;">Perguntas</h5></div></div>`);
    }
  });
});
// Adicionando evento no botão close do alert
function closeA(){
  $(".alert-preencher").attr("style","display:none");
  alertaS.style.display = "none";
}
// Pegando o evento do botão salvar da parte onde salva os campos sala comercial e data
var idVistoria, alerta = document.querySelector(".alert-preencher"), alertaS = document.querySelector(".alert-preencher-success"), dataH, alerta2, dataVistoria, verifica = 0, verificaQ = 0;
document.querySelector("#confirma-data1").addEventListener("click", function() {
  $("#confirma-data1").attr("style","display:none");
  $("#confirma-data2").attr("style","display:block");
});
document.querySelector("#confirma-data2").addEventListener("click", function() {
  $("#confirma-data2").attr("style","display:none");
  $("#confirma-data1").attr("style","display:block");
});
function confirmaData() {
  verifica = 1;
  verifica += 1; 
  document.querySelector('#teste-data').value = 'false';
  event.preventDefault();
  var select = document.querySelector("#salacomercial");
  var valueOpition = select.options[select.selectedIndex].value;
  var data = document.querySelector('#data').value;
  if(verificaQ > 1) {
    verificaQ = 0;
  } 
  if (data == "" || valueOpition == "") {
    alerta.style.display = "block";
    alerta.innerHTML = '<strong>Erro!</strong> Preencha todos os campos! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
  } else {
    var settings1 = {
      "async": true,
      "crossDomain": true,
      "url": API +"/listaData/"+ valueOpition,
      "method": "GET",
      "headers": {}
    }
    $.ajax(settings1).done(function (response) {
      var alerts;
      for(let i = 0; i < response.data.length; i++) {
        let dataV, dataC, dataComparacao, dataVc;
        dataV = Date.parse(response.data[i].datavistoria);
        for(let j = 0; j < 3; j++) {
          dataComparacao = new Date(dataV + j * 24 * 60 * 60 * 1000);
          if (Date.parse(dataComparacao) == Date.parse(data)) {
            alertaS.style.display = "none";
            alerta.style.display = "block";
            alerta.innerHTML = '<strong>Erro!</strong> So pode ter uma nova vistoria apos 3 dias! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
            document.querySelector('#teste-data').value = 'true';
            alerts = 1;
          }
        }
      }
      console.log(alerts);
      if(alerts != 1) {
        alerta.style.display = "none";
        alertaS.style.display = "block";
        alertaS.innerHTML = 'Data verificada com sucesso! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
      }
    });
    
  }
}

function salvar() {
    event.preventDefault();
    var select = document.querySelector("#salacomercial");
    var valueOpition = select.options[select.selectedIndex].value;
    var data = document.querySelector('#data').value;
    var alerta2 = document.querySelector('#teste-data').value
    console.log(alerta2)
    // adicionando uma vistoria no banco   
    if (data == "" || valueOpition == "") {
      alerta.style.display = "block";
      alerta.innerHTML = '<strong>Erro!</strong> Preencha todos os campos! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
    } else if (data.length > 10) {
      alerta.style.display = "block";
      alerta.innerHTML = '<strong>Erro!</strong> Data incorreta! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
    } else if (verifica == 0) {
      alerta.style.display = "block";
      alerta.innerHTML = '<strong>Erro!</strong> Verifique a data porfavor! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
    } else if(alerta2 == 'true') {
      alerta.style.display = "block";
      alerta.innerHTML = '<strong>Erro!</strong> So pode ter uma nova vistoria apos 3 dias! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
    } else {
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
          '<div class="preencher" id="situacao-' + response.perguntas[indice].id + '"></div></div>');
        });
      });
      alertaS.style.display = "none";
      $(".alert-preencher").attr("style","display:none");
      document.querySelector('#teste-data').value = 'false';
      verifica = 0;
    }
}
function cancelar() {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/ultimaVistorias",
    "method": "GET",
    "headers": {}
  }
  $.ajax(settings).done(function (response) {
    return excluirVistoria(response.vistorias);
  });
}
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
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/ultimaVistorias",
    "method": "GET",
    "headers": {}
  }
  
  $.ajax(settings).done(function (response) {
    var contagem1 = 0;
    var contagem2 = 0;
    var idVistoria;
    idVistoria = response.vistorias;
    console.log(idVistoria);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/respostas/"+idVistoria,
      "method": "GET",
      "headers": {}
    }
    $.ajax(settings).done(function (response) {
      contagem1 = response.respostas.length;
      document.querySelectorAll('.preencher').forEach(item => {
        contagem2 += 1;
      });
      if (contagem1 == contagem2) {
        $("#form-perguntas").attr("style","display:none");
        $("#form-comentario").attr("style","display:block");
        $(".alert-preencher").attr("style","display:none");
      } else {
        alerta.style.display = "block";
        alerta.innerHTML = '<strong>Erro!</strong> Preencha todas as perguntas! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
      }
    });
  });
});
document.querySelector(".botaosalvarcomentario").addEventListener('click', function(event){
  event.preventDefault();
  var comentario = $('#comentario').val();
  var idVistoria;
  if (comentario == "") {
    alerta.style.display = "block";
    alerta.innerHTML = '<strong>Erro!</strong> Preencha o campo! <button type="button" class="close" id="close" data-dismiss="alert" onclick="closeA();">&times;</button>';
  } else {
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
    $(".alert-preencher").attr("style","display:none");
  }
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
  if (data == "" || valueOpition == "") {
    $(".alert-preencher").attr("style","display:block");
  } else {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/editaVistorias/"+id,
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
          $('#perguntas').append('<div><p>'+ response.respostas[i].pergunta +'</p><div><div class="up-sit' + response.respostas[i].idPergunta + '"><i class="far fa-thumbs-up"></i><span class="span-resp">OK</span></div>'+
          '<button type="button" class="btn btn-danger btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 0);"><i class="far fa-thumbs-down"></i><span class="span-btn">N OK</span></button></div>'+ 
          '<div id="situacao-' + response.respostas[i].idPergunta + '"></div></div>');
        } else {
          $('#perguntas').append('<div><p>'+ response.respostas[i].pergunta +'</p><div><div class="up-sit' + response.respostas[i].idPergunta + '"><i class="far fa-thumbs-down"></i><span class="span-resp">N OK</span></div><button type="button" class="btn btn-success btn-situacao-' + response.respostas[i].idPergunta + '" value="' + response.respostas[i].idPergunta + '" onclick="editaP(' + response.respostas[i].idPergunta + ', ' + response.respostas[i].idRespota + ', ' + id + ', 1);"><i class="far fa-thumbs-up"></i><span class="span-btn">OK</span></button>'+
          '</div><div id="situacao-' + response.respostas[i].idPergunta + '"></div></div>');
        }
      }
    });
    $('.div-btn-perguntas').append('<button type="submit" class="btn btn-danger botaoeditarperguntas" onclick="editarComentario(' + id + ');"><i class="far fa-save"></i>Salvar</button>');
    $(".alert-preencher").attr("style","display:none");
  }
}
function editaP(idPergunta, idResposta, idVistoria, situacao) {
  $(".btn-situacao-"+idPergunta).attr("style","display:none");
  $(".up-sit"+idPergunta).attr("style","display:none");
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": API +"/editaRespostas/"+idResposta,
    "method": "POST",
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
    $('.div-btn-comentarios').append('<button type="submit" class="btn btn-danger botaoeditarcomentario" onclick="editaC(' + response.comentarios[0].idComentario + ', ' + id + ');"><i class="far fa-save"></i>Salvar</button>');
  });
}
function editaC(idComentario, idVistoria) {
  event.preventDefault();
  var comentario = $("#comentario").val();
  if (comentario == "") {
    $(".alert-preencher").attr("style","display:block");
  } else {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": API +"/editaComentarios/"+idComentario,
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
    $(".alert-preencher").attr("style","display:none");
  }
}
// parte de excluir vistoria
function excluirVistoria(id) {
  var settings1 = {
    "async": true,
    "crossDomain": true,
    "url": API +"/deletaComentarios/"+id,
    "method": "POST",
    "headers": {}
  }
  $.ajax(settings1).done(function (response) {
    console.log(response);
  });
  var settings2 = {
    "async": true,
    "crossDomain": true,
    "url": API +"/deletaRespostas/"+id,
    "method": "POST",
    "headers": {}
  }
  $.ajax(settings2).done(function (response) {
    console.log(response);
  });
  var settings3 = {
    "async": true,
    "crossDomain": true,
    "url": API +"/deletaVistorias/"+id,
    "method": "POST",
    "headers": {}
  }
  $.ajax(settings3).done(function (response) {
    console.log(response);
    window.location.reload();
  });
}

app.initialize();