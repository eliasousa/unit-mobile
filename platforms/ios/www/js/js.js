function menuClick (e) {
  var id = e.target.context.id;
    switch (id) {
    case 'menuNotasFaltas':
        carregarNotasFaltas();
    break;
    case 'menuHorario':
        carregarHorario();
    break;
    case 'menuAvisos':
        carregarAvisos();
    break;
    case 'materialAula':
        carregarMaterialAula();
    break;    
    case 'excluirCredenciais':
        excluirCredenciais();
    break;
  }
}

function excluirCredenciais () {
  localStorage.setItem('salvarCredenciais', false);
  app.navigate('#login', 'slide:right');
  $('#itemExCred').attr('style','display:none');
  $('#matricula').val("");
  $('#senha').val("");
}

function loader (op) {
  if(op == 1){
    app.pane.loader.show();
  }else{
    app.pane.loader.hide();
  }
}

function diaDaSemana (data) {
  var dia = formataData(data).getDay();
  switch (dia){
    case 0:
        return "Domingo";
    break;
    case 1:
        return "Segunda-Feira";
    break;
    case 2:
        return "Terça-Feira";
    break;
    case 3:
        return "Quarta-Feira";
    break;
    case 4:
        return "Quinta-Feira";
    break;
    case 5:
        return "Sexta-Feira";
    break;
    case 6:
        return "Sábado";
    break;
  }

}

function autenticar () {
  loader(1);
  
  var matricula = $('#matricula').val();
  var senha = $('#senha').val();

  if(localStorage.getItem('salvarCredenciais') == "true"){
      matricula = localStorage.getItem('matricula');
      senha = localStorage.getItem('senha');
  }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    // build SOAP request
    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
    '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
      '<soap12:Body>' +
        '<AutenticarUsuario xmlns="http://tempuri.org/">' +
          '<login>' + matricula + '</login>' +
          '<senha>' + senha + '</senha>' +
          '<token></token>' +
        '</AutenticarUsuario>' +
      '</soap12:Body>' +
    '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
           loader(0);
            if (xmlhttp.status == 200) {
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("sessionid");
                 console.log(resultado[0].textContent);
                 var sessionID = resultado[0].textContent;
                 if(sessionID != -'1'){
                    localStorage.setItem('sessionID', sessionID);
                    localStorage.setItem('matricula', matricula);
                    if($('#salvarCredenciais').is(':checked')){
                      localStorage.setItem('senha', senha);
                      localStorage.setItem('salvarCredenciais', true);
                      $('#itemExCred').attr('style','display:block');
                    }
                    app.navigate("#menu");
                    
                 }else{
                    alert("Usuario ou senha errados");
                 }
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function carregarNotasFaltas () {
    app.navigate('#notasFaltas', 'slide:left');
    loader(1);
    var sessionID = localStorage.getItem('sessionID');
    var matricula = localStorage.getItem('matricula');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<ObterNotas xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
            '</ObterNotas>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            loader(0);
            if (xmlhttp.status == 200) {
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("ObterNotasResult");
                 var notas = resultado[0].childNodes[1].childNodes[0].childNodes;
                 $('#listaNotasFaltas').html("");
                 for (var i = 0; i < notas.length; i++) {
                    var nota = notas[i].childNodes;
                    var item = {
                            disciplina: nota[0].firstChild.nodeValue, 
                                       notas: [nota[1].firstChild.nodeValue, 
                                               nota[2].firstChild.nodeValue, 
                                               nota[3].firstChild.nodeValue], 
                                       faltas: [nota[4].firstChild.nodeValue, 
                                                nota[5].firstChild.nodeValue] 
                    };

                    var titulo = document.createElement("td");
                      titulo.setAttribute('class', 'titulo');
                      titulo.setAttribute('colspan', '6');
                      titulo.innerHTML = item.disciplina;

                    var unidade1 = document.createElement("td");
                      unidade1.setAttribute('class', 'unidades ladoEsquerdo');
                      unidade1.setAttribute('colspan', '2');
                      unidade1.innerHTML = 'Unidade I';
                    var unidade2 = document.createElement("td");
                      unidade2.setAttribute('class', 'unidades');
                      unidade2.setAttribute('colspan', '2');
                      unidade2.innerHTML = 'Unidade II';
                    var unidade3 = document.createElement("td");
                      unidade3.setAttribute('class', 'unidades ladoDireito');
                      unidade3.setAttribute('colspan', '2');
                      unidade3.innerHTML = 'Unidade III';

                    var notasFaltas1 = document.createElement("td");
                      notasFaltas1.setAttribute('class', 'notasFaltas ladoEsquerdo');
                      notasFaltas1.innerHTML = 'Nota';
                    var notasFaltas2 = document.createElement("td");
                      notasFaltas2.setAttribute('class', 'notasFaltas');
                      notasFaltas2.innerHTML = 'Falta';
                    var notasFaltas3 = document.createElement("td");
                      notasFaltas3.setAttribute('class', 'notasFaltas');
                      notasFaltas3.innerHTML = 'Nota';
                    var notasFaltas4 = document.createElement("td");
                      notasFaltas4.setAttribute('class', 'notasFaltas');
                      notasFaltas4.innerHTML = 'Falta';
                    var notasFaltas5 = document.createElement("td");
                      notasFaltas5.setAttribute('class', 'notasFaltas');
                      notasFaltas5.innerHTML = 'Nota';
                    var notasFaltas6 = document.createElement("td");
                      notasFaltas6.setAttribute('class', 'notasFaltas ladoDireito');
                      notasFaltas6.innerHTML = 'Falta';

                    var resultado1 = document.createElement("td");
                      resultado1.setAttribute('class', 'resultados ladoEsquerdo');
                      resultado1.innerHTML = item.notas[0]; 
                    var resultado2 = document.createElement("td");
                      resultado2.setAttribute('class', 'resultados');
                      resultado2.innerHTML = item.faltas[0];  
                    var resultado3 = document.createElement("td");
                      resultado3.setAttribute('class', 'resultados');
                      resultado3.innerHTML = item.notas[1];  
                    var resultado4 = document.createElement("td");
                      resultado4.setAttribute('class', 'resultados');
                      resultado4.innerHTML = item.faltas[1];  
                    var resultado5 = document.createElement("td");
                      resultado5.setAttribute('class', 'resultados');
                      resultado5.innerHTML = item.notas[2];  
                    var resultado6 = document.createElement("td");
                      resultado6.setAttribute('class', 'resultados ladoDireito');
                      resultado6.innerHTML = '-';    

                    var bloco1 = document.createElement("tr");   
                      bloco1.appendChild(titulo);
                    var bloco2 = document.createElement("tr");       
                      bloco2.appendChild(unidade1);
                      bloco2.appendChild(unidade2);
                      bloco2.appendChild(unidade3);
                    var bloco3 = document.createElement("tr");        
                      bloco3.appendChild(notasFaltas1);
                      bloco3.appendChild(notasFaltas2);
                      bloco3.appendChild(notasFaltas3);
                      bloco3.appendChild(notasFaltas4);
                      bloco3.appendChild(notasFaltas5);
                      bloco3.appendChild(notasFaltas6);
                    var bloco4 = document.createElement("tr");            
                      bloco4.appendChild(resultado1); 
                      bloco4.appendChild(resultado2);  
                      bloco4.appendChild(resultado3);  
                      bloco4.appendChild(resultado4);  
                      bloco4.appendChild(resultado5);  
                      bloco4.appendChild(resultado6);  
                    var tabela = document.createElement("table");
                      tabela.setAttribute('class', 'tabela');
                      tabela.appendChild(bloco1);  
                      tabela.appendChild(bloco2);  
                      tabela.appendChild(bloco3);  
                      tabela.appendChild(bloco4);  

                    $('#listaNotasFaltas').append(tabela); 
                 };                
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);

}

function carregarHorario () {
    app.navigate('#horario', 'slide:left');
    loader(1);
    var sessionID = localStorage.getItem('sessionID');
    var matricula = localStorage.getItem('matricula');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<ObterHorarioDatas xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
              '<data></data>' +
            '</ObterHorarioDatas>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
          loader(0);
            if (xmlhttp.status == 200) {
                 $('#bodyAvisos').html("");
                 $('#listaHorario').html("");
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("ObterHorarioDatasResult");
                 var horarios = resultado[0].childNodes[1].childNodes[0].childNodes;
                 var comparaData = 0;
                 var ulDaVez;
                 var liDaVez;
                 for (var i = 0; i < horarios.length; i++) {
                    var horario = horarios[i].childNodes;
                    var item = {
                            horario: horario[0].firstChild.nodeValue, 
                            local: horario[1].firstChild.nodeValue, 
                            disciplina: horario[2].firstChild.nodeValue, 
                            data: horario[3].firstChild.nodeValue,
                            ordem: horario[4].firstChild.nodeValue};
                    
                    if(item.ordem > comparaData){
                      if(comparaData != 0){
                        $('#listaHorario').append(liDaVez);
                      }
                      comparaData = item.ordem;
                      var li = document.createElement("li");
                      li.setAttribute('class', 'km-group-container');
                      var div1 = document.createElement("div");
                      div1.setAttribute('class', 'km-group-title');
                      var div2 = document.createElement("div");
                      div2.setAttribute('class', 'km-text');
                      div2.innerHTML = item.data + " - " + diaDaSemana(item.ordem);
                      div1.appendChild(div2);
                      li.appendChild(div1);
                      
                      var ul = document.createElement("ul");
                      ul.setAttribute('class', 'km-list lista');
                      ulDaVez = ul;
                      var liul = document.createElement("li");
                      var h2 = document.createElement("h2");
                      h2.innerHTML = item.horario + " " + item.local + "<br />" + item.disciplina;
                      h2.setAttribute('style', 'font-size:12px');
                      liul.appendChild(h2);
                      ulDaVez.appendChild(liul);
                      li.appendChild(ulDaVez);
                      liDaVez = li;
                    }else{
                      var liul = document.createElement("li");
                      var h2 = document.createElement("h2");
                      h2.innerHTML = item.horario + " " + item.local + "<br >" + item.disciplina;
                      h2.setAttribute('style', 'font-size:12px');
                      liul.appendChild(h2);
                      ulDaVez.appendChild(liul);
                    }            
                 } 
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function formataData (data) {
  return new Date(data.substring(0,4),data.substring(4,6) - 1,data.substring(6,8));
}

function carregarAvisos () {
    app.navigate('#avisos', 'slide:left');
    loader(1);
    var sessionID = localStorage.getItem('sessionID');
    var matricula = localStorage.getItem('matricula');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<ObterAvisos xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
            '</ObterAvisos>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            loader(0);
            if (xmlhttp.status == 200) {
                 $('#listaAvisos').html("");
                 $('#bodyAvisos').html("");
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("ObterAvisosResult");
                 var avisos = resultado[0].childNodes[1].childNodes[0].childNodes;
                 for (var i = 0; i < avisos.length; i++) {
                    var aviso = avisos[i].childNodes;
                    var item = {
                            data: aviso[0].firstChild.nodeValue, 
                            disciplina: aviso[2].firstChild.nodeValue, 
                            professor: aviso[3].firstChild.nodeValue,
                            aviso: aviso[4].firstChild.nodeValue,
                            ordem: aviso[6].firstChild.nodeValue,
                            assunto: aviso[9].firstChild.nodeValue};  
;
                    var liul = document.createElement("li");
                    var h2 = document.createElement("h2");
                    h2.innerHTML = item.data + " " + item.professor + "<br />" + item.disciplina;
                    h2.setAttribute('style', 'font-size:12px');
                    liul.appendChild(h2);
                    localStorage.setItem('conteudoAviso' + i, item.aviso);
                    liul.setAttribute('onclick', 'mostrarAviso('+ i +')');
                        
                    $('#listaAvisos').append(liul);

                 }            
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function mostrarAviso (i) {
  $("#conteudoAviso").html(localStorage.getItem('conteudoAviso' + i).replace(/\n/g, '<br />'));
  $("#modalAviso").data("kendoMobileModalView").open();
}

function carregarMaterialAula () {
    app.navigate('#materialAula', 'slide:left');
    loader(1);
    var sessionID = localStorage.getItem('sessionID');
    var matricula = localStorage.getItem('matricula');

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<DVObterPastasProf xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
            '</DVObterPastasProf>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            loader(0);
            if (xmlhttp.status == 200) {
                 $('#listaMaterialAula').html("");
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("DVObterPastasProfResult");
                 var pastas = resultado[0].childNodes[1].childNodes[0].childNodes;
                 for (var i = 0; i < pastas.length; i++) {
                    var pasta = pastas[i].childNodes;
                    var item = {
                            idtProf: pasta[0].firstChild.nodeValue, 
                            nomeProf: pasta[1].firstChild.nodeValue,
                            pastas: pasta[2].firstChild.nodeValue};  
                    var liul = document.createElement("li");
                    var h2 = document.createElement("h2");
                    h2.innerHTML = item.nomeProf;
                    h2.setAttribute('style', 'font-size:12px');
                    liul.appendChild(h2);
                    liul.setAttribute('onclick', 'carregarArquivosPasta("' + item.idtProf + '","' + item.nomeProf + '","' + item.pastas + '");');
                        
                    $('#listaMaterialAula').append(liul);

                 }            
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function carregarArquivosPasta (idtProf, nomeProf, pastas) {
  app.navigate('#materialAulaArquivos', 'slide:left');
  loader(1);
  var sessionID = localStorage.getItem('sessionID');
  var matricula = localStorage.getItem('matricula');
  $('#tituloPasta').text(nomeProf);

  var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<DVObterPastasEArquivosDoAluno xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
              '<idt_pastas>' + idtProf + '</idt_pastas>' +
              '<idt_pasta_pai>' + pastas + '</idt_pasta_pai>' +
            '</DVObterPastasEArquivosDoAluno>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            loader(0);
            if (xmlhttp.status == 200) {
                 $('#listaMaterialAulaArquivos').html("");
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("DVObterPastasEArquivosDoAlunoResult");
                 var arquivos = resultado[0].childNodes[1].childNodes[0].childNodes;
                 for (var i = 0; i < arquivos.length; i++) {
                    var arquivo = arquivos[i].childNodes;
                   
                    if(arquivo[0].firstChild.nodeValue == "1"){
                      //PASTA
                       var item = {
                            chave: arquivo[1].firstChild.nodeValue, 
                            descricao: arquivo[2].firstChild.nodeValue}; 

                            var liul = document.createElement("li");
                            var h2 = document.createElement("h2");
                            h2.innerHTML = item.descricao;
                            h2.setAttribute('style', 'font-size:12px');
                            var icone = document.createElement("span");
                            icone.setAttribute('class', 'iconeArquivos');
                            icone.setAttribute('style', 'background-image: url("images/pasta.png")');
                            liul.appendChild(icone);
                            liul.appendChild(h2);
                            liul.setAttribute('onclick', 'carregarArquivosPasta2("' + idtProf + '","' + item.descricao + '","' + item.chave + '");');
                    }else{
                      //ARQUIVO
                       var item = {
                            chave: arquivo[1].firstChild.nodeValue, 
                            descricao: arquivo[2].firstChild.nodeValue,
                            tamBytes: arquivo[3].firstChild.nodeValue,
                            data: arquivo[4].firstChild.nodeValue,
                            contentType: arquivo[5].firstChild.nodeValue}; 

                       var liul = document.createElement("li");
                            var h2 = document.createElement("h2");
                            h2.innerHTML = item.descricao + "<br />" + item.tamBytes + " " + item.data;
                            h2.setAttribute('style', 'font-size:12px');
                            var icone = document.createElement("span");
                            icone.setAttribute('class', 'iconeArquivos');
                            icone.setAttribute('style', 'background-image: url("images/file.png")');
                            liul.appendChild(icone);
                            liul.appendChild(h2);
                            liul.setAttribute('onclick', 'downloadArquivo("' + item.chave + '","' + item.descricao + '");');       
                    }
                        
                    $('#listaMaterialAulaArquivos').append(liul);

                 }            
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function carregarArquivosPasta2 (idtProf, nomeProf, pastas) {
  app.navigate('#materialAulaArquivos2', 'slide:left');
  loader(1);
  var sessionID = localStorage.getItem('sessionID');
  var matricula = localStorage.getItem('matricula');
  $('#tituloPasta2').text(nomeProf);

  var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('post', 'https://wwws.unit.br/magisteriphoneservice/magisteriphoneservice.asmx', true);

    var sr =
        '<?xml version="1.0" encoding="utf-8"?>' +
        '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">' +
          '<soap12:Body>' +
            '<DVObterPastasEArquivosDoAluno xmlns="http://tempuri.org/">' +
              '<sessionID>' + sessionID + '</sessionID>' +
              '<matricula>' + matricula + '</matricula>' +
              '<idt_pastas>' + idtProf + '</idt_pastas>' +
              '<idt_pasta_pai>' + pastas + '</idt_pasta_pai>' +
            '</DVObterPastasEArquivosDoAluno>' +
          '</soap12:Body>' +
        '</soap12:Envelope>';

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4) {
            loader(0);
            if (xmlhttp.status == 200) {
                 $('#listaMaterialAulaArquivos2').html("");
                 var response = xmlhttp.responseXML;
                 var resultado = response.getElementsByTagName("DVObterPastasEArquivosDoAlunoResult");
                 var arquivos = resultado[0].childNodes[1].childNodes[0].childNodes;
                 for (var i = 0; i < arquivos.length; i++) {
                    var arquivo = arquivos[i].childNodes;
                   
                    if(arquivo[0].firstChild.nodeValue == "1"){
                      //PASTA
                       var item = {
                            chave: arquivo[1].firstChild.nodeValue, 
                            descricao: arquivo[2].firstChild.nodeValue}; 

                            var liul = document.createElement("li");
                            var h2 = document.createElement("h2");
                            h2.innerHTML = item.descricao;
                            h2.setAttribute('style', 'font-size:12px');
                            var icone = document.createElement("span");
                            icone.setAttribute('class', 'iconeArquivos');
                            icone.setAttribute('style', 'background-image: url("images/pasta.png")');
                            liul.appendChild(icone);
                            liul.appendChild(h2);
                            liul.setAttribute('onclick', 'carregarArquivosPasta2("' + idtProf + '","' + item.descricao + '","' + item.chave + '");');
                    }else{
                      //ARQUIVO
                       var item = {
                            chave: arquivo[1].firstChild.nodeValue, 
                            descricao: arquivo[2].firstChild.nodeValue,
                            tamBytes: arquivo[3].firstChild.nodeValue,
                            data: arquivo[4].firstChild.nodeValue,
                            contentType: arquivo[5].firstChild.nodeValue}; 

                       var liul = document.createElement("li");
                            var h2 = document.createElement("h2");
                            h2.innerHTML = item.descricao + "<br />" + item.tamBytes + " " + item.data;
                            h2.setAttribute('style', 'font-size:12px');
                            var icone = document.createElement("span");
                            icone.setAttribute('class', 'iconeArquivos');
                            icone.setAttribute('style', 'background-image: url("images/file.png")');
                            liul.appendChild(icone);
                            liul.appendChild(h2);
                            liul.setAttribute('onclick', 'downloadArquivo("' + item.chave + '","' + item.descricao + '");');     
                    }
                        
                    $('#listaMaterialAulaArquivos2').append(liul);

                 }            
            }
        }
    }
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(sr);
}

function downloadArquivo(idtArquivo, nomeArquivo){
    loader(1);
  var sessionID = localStorage.getItem('sessionID');
  var matricula = localStorage.getItem('matricula');
    
  var remoteFile = "https://wwws.unit.br/DiscoVirtualNet/Arquivos/DownloadMobileIphone.ashx?idt_arquivo=" + idtArquivo + "&username=" + matricula + "&session_id=" + sessionID;
  var localFileName = nomeArquivo;
  

  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
      fileSystem.root.getFile(localFileName, {create: true, exclusive: false}, function(fileEntry) {
          var localPath = fileEntry.fullPath;
         
          if (device.platform === "Android" && localPath.indexOf("file://") === 0) {
              localPath = localPath.substring(7);
          }
          var fileTransfer = new FileTransfer();
          var uri = encodeURI(remoteFile);
          fileTransfer.download(
              uri,
              localPath,
              function(entry) {
                  loader(0);
                  alert("Download concluido!");
                  window.open(encodeURI(entry.fullPath), '_blank', 'location=yes');
              },
              function(error) {
                  console.log("download error source " + error.source);
                  console.log("download error target " + error.target);
                  console.log("upload error code" + error.code);
              },
              true,
              {
                  headers: {
                      "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                  }
              }
          );
         
      }, fail);
  }, fail);
    
  function fail(error) {
      console.log(error.code);
  }
}

function abrirArquivo (entry) {
  function win(file) {
      var reader = new FileReader();
      reader.onloadend = function (evt) {
          console.log("read success");
          console.log(evt.target.result);
      };
      reader.readAsDataURL(file);
  };

  var fail = function (evt) {
      console.log(error.code);
  };

  entry.file(win, fail);
}