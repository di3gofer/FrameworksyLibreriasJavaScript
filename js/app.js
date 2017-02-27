var juegoActivo = 0
    movimientos = 1
    puntuacion = 0
    totalImagenes = 35
    totalFilas = 5
    totalColumnas = 7

var juegoDulces = {
  init: function(){
    $(".btn-reinicio").on("click", function(){
      switch(juegoActivo){
        case 0:
          juegoDulces.iniciarJuego();
          break;
        case 1:
          juegoActivo = 2;
          $('#timer').timer('remove');
          juegoDulces.terminarJuego();
          break;
        case 2:
          juegoDulces.reiniciarJuego();
          break;
        default:
          console.log('Error en el estado juegoActivo');
      }
    });
    //this.animacionTitulo();
    this.cargarImagenes();
  },
  iniciarJuego: function(){
    $(".btn-reinicio").html('Reiniciar');
    juegoActivo = 1;
    this.inicioTiempo();
  },
  terminarJuego: function(){
    $(".panel-tablero").hide("slide", {direction: "left"}, "slow", function(){
      $(".time").hide("slide", {direction: "left"}, "slow");
      $(".panel-score").animate({width: "390%"}, 1000);
      if(juegoActivo != 1){
        $(".panel-score").prepend('<h1 class="main-titulo-2">Juego Terminado</h1>');
      }
    });
  },
  reiniciarJuego: function(){
    var col = $("div[class^='col']");
    for (var i = 0; i < col.length; i++) {
      $(col[i]).html('');
    }
    $('#timer').timer('remove');
    $(".btn-reinicio").html('Iniciar');
    $("#timer").html('02:00');
    $("#movimientos-text").html('0');
    $("#score-text").html('0');
    puntuacion = 0;
    movimientos = 1;
    this.cargarImagenes();
    $(".main-titulo-2").remove();
    $(".panel-score").animate({width: "25%"}, 1000, function(){
      $(".panel-tablero").show("slide", {direction: "left"}, "slow");
      $(".time").show("slide", {direction: "left"}, "slow");
    });
    juegoActivo = 0;
  },
  inicioTiempo: function(){
    $('#timer').timer({
      //http://jquerytimer.com/
      duration: '2m',
      format: '%M:%S',
      callback: function(){
        juegoActivo = 2;
        juegoDulces.terminarJuego();
      }
    });
  },
  animacionTitulo: function(){
    setInterval(function(){
      $(".main-titulo").switchClass("main-titulo","main-titulo-efecto", 200),
      $(".main-titulo").switchClass("main-titulo-efecto","main-titulo", 200)
    }, 1000);
  },
  imagenes: function(){
    var i = 0;
    this[i++] = "image/1.png";
    this[i++] = "image/2.png";
    this[i++] = "image/3.png";
    this[i++] = "image/4.png";
    this.total = i;
  },
  obtenerColumnas: function(){
    var i = 0;
    this[i++] = $(".col-1").find("div");
    this[i++] = $(".col-2").find("div");
    this[i++] = $(".col-3").find("div");
    this[i++] = $(".col-4").find("div");
    this[i++] = $(".col-5").find("div");
    this[i++] = $(".col-6").find("div");
    this[i++] = $(".col-7").find("div");
    this.total = i;
  },
  obtenerFilas: function(){
    var i = 0;
    this[i++] = $("[id*=img-1]");
    this[i++] = $("[id*=img-2]");
    this[i++] = $("[id*=img-3]");
    this[i++] = $("[id*=img-4]");
    this[i++] = $("[id*=img-5]");
    this.total = i;
  },
  cargarImagenes: function(){
    var num = 1;
    var numImg = 1;
    for(var i = 1; i <= totalColumnas; i++){
      for(var ii = 1; ii <= totalFilas; ii++){
        var imagen = new this.imagenes;
        var src = imagen[Math.floor(Math.random() * imagen.total)];
        $(".col-" + num).append("<div id='item-"+ numImg +" img-"+ ii +"'>" +
                                    "<img src="+ src +" class='imagen-"+ numImg +"'>" +
                                  "</div>");
        $(".imagen-" + numImg).draggable({
          revert: true,
          containment: ".panel-tablero",
          start: function(){
            if(juegoActivo == 1){
              $("#movimientos-text").html(movimientos++);
            }
          },
          stop: function(){
            if(juegoActivo == 1){
              juegoDulces.resetDiv();
            }
          },
          drag: function(event, ui){}
        });
        $("[id='item-"+ numImg +" img-"+ ii +"'").droppable({
          drop: function(event, ui){
            if(juegoActivo == 1){
              imagenUno = event.target.lastChild;
              imagenDos = ui.draggable[0];
              imgUno = $(imagenUno).attr("src");
              imgDos = $(imagenDos).attr("src");
              $(imagenUno).attr("src", imgDos);
              $(imagenDos).attr("src", imgUno);
            }
          }
        });
        numImg++;
      }
      num++;
    }
  },
  resetDiv: function(){
    var col = new this.obtenerColumnas;
    var num = 1;
    var numImg = 1;
    for(var i = 0; i <= totalColumnas; i++){
      var num2 = 1;
      for (var ii = 0; ii < totalFilas; ii++){
        var nuevoDiv = $(col[i])[ii];
        $(nuevoDiv).attr("id", "item-"+ numImg +" img-"+ num2);
        $(nuevoDiv).find("img").attr("class", "item-"+ numImg);
        num2++;
        numImg++;
      }
      num++;
    }
    juegoDulces.scanRepetidosCol();
    juegoDulces.scanRepetidosFil();
  },
  agregarDiv: function(obj, claseCol){
    var imagen = new this.imagenes
    var src;
    var id = $(obj)[0].id;
    var nuevoDiv = $(obj).detach();
    src = imagen[Math.floor(Math.random() * imagen.total)];
    var img = $(nuevoDiv).find("img")[0];
    var imgNueva = $(img).attr("src", src)[0];
    $(nuevoDiv).attr("id", id);
    $(nuevoDiv).removeAttr("style");
    $(claseCol).prepend(nuevoDiv);
  },
  animacionAcertar: function(items, filCol, objeto, ubicacion, puntuacion){
    var array = items;
    var ordenDiv = 0;
    var claseCol
    var cajaDulce

    switch(objeto){
      case "Col":
        objeto = new this.obtenerColumnas;
        break;
      case "Fil":
        objeto = new this.obtenerFilas;
        break;
      default:
        console.log("Error en el Objeto - animacionAcertar");
    }

    for(var n = 0; n < array.length; n++){
      $(filCol[array[n]]).hide("pulsate", 800, function(){
        cajaDulce = $(this);
        claseCol = "."+$(this)[0].parentNode.className;
        juegoDulces.agregarDiv($(this), claseCol);
      });
    }
    $("#score-text").html(puntuacion);
  },
  scanRepetidosCol: function(){
    var imagen = new this.imagenes;
    var colDiv = new this.obtenerColumnas;
    var col = new this.obtenerColumnas;
    var objeto = "Col";
    for (var n = 0; n < col.total; n++) {
      col[n] = $(col[n]).find("img");
    }

    for(var i = 0; i < col.total; i++){
      for(var img = 0; img < imagen.total; img++){
        if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([0,1,2,3,4], colDiv[i], objeto, i, puntuacion);

        }else if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([0,1,2,3], colDiv[i], objeto, i, puntuacion);

        }else if($(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([1,2,3,4], colDiv[i], objeto, i, puntuacion);

        }else if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([0,1,2], colDiv[i], objeto, i, puntuacion);

        }else if($(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([1,2,3], colDiv[i], objeto, i, puntuacion);

        }else if($(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([2,3,4], colDiv[i], objeto, i, puntuacion);

        }else{
          //console.log("Opcion no aplicada - Columna");
        }
      }
    }
  },
  scanRepetidosFil: function(){
    var imagen = new this.imagenes;
    var filDiv = new this.obtenerFilas;
    var fil = new this.obtenerFilas;
    var objeto = "Fil";
    for (var n = 0; n < fil.total; n++) {
      fil[n] = $(fil[n]).find("img");
    }

    for(var i = 0; i < fil.total; i++){
      for(var img = 0; img < imagen.total; img++){
        if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 7;
          this.animacionAcertar([0,1,2,3,4,5,6], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 6;
          this.animacionAcertar([1,2,3,4,5,6], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 6;
          this.animacionAcertar([0,1,2,3,4,5], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([0,1,2,3,4], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([1,2,3,4,5], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([2,3,4,5,6], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([0,1,2,3], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([1,2,3,4], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([2,3,4,5], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([3,4,5,6], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([0,1,2], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([1,2,3], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([2,3,4], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([3,4,5], filDiv[i], objeto, i, puntuacion);

        }else if($(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([4,5,6], filDiv[i], objeto, i, puntuacion);

        }else{
          //console.log("Opcion no aplicada - Fila");
        }
      }
    }
  }
}

$(document).ready(function(){
  juegoDulces.init();
});
