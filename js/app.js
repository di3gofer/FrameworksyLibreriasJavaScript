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
          //scan();
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
    this.animacionTitulo();
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
    this[i++] = $(".col-1").find("img");
    this[i++] = $(".col-2").find("img");
    this[i++] = $(".col-3").find("img");
    this[i++] = $(".col-4").find("img");
    this[i++] = $(".col-5").find("img");
    this[i++] = $(".col-6").find("img");
    this[i++] = $(".col-7").find("img");
    this.total = i;
  },
  obtenerFilas: function(){
    var i = 0;
    this[i++] = $("[id*=img-1]").find("img");
    this[i++] = $("[id*=img-2]").find("img");
    this[i++] = $("[id*=img-3]").find("img");
    this[i++] = $("[id*=img-4]").find("img");
    this[i++] = $("[id*=img-5]").find("img");
    this.total = i;
  },
  cargarImagenes: function(){
    var num = 1;
    var numImg = 1;
    for(var i = 1; i <= totalColumnas; i++){
      for(var ii = 1; ii <= totalFilas; ii++){
        var imagen = new this.imagenes;
        var src = imagen[Math.floor(Math.random() * imagen.total)];
        $(".col-" + num).prepend("<div id='item-"+ numImg +" img-"+ ii +"'>" +
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
              juegoDulces.scanRepetidosCol();
              juegoDulces.scanRepetidosFil();
            }
          },
          drag: function(event, ui){}
        });
        $("[id='item-"+ numImg +" img-"+ ii).droppable({
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
  animacionAcertar: function(items, objeto, puntuacion){
    var imagen = new this.imagenes;
    var array = items;
    var src;

    for(var n = 0; n < array.length; n++){
      $(objeto[array[n]]).hide("pulsate", 800,function(){
        src = imagen[Math.floor(Math.random() * imagen.total)];
        $(this).attr("src", src).show("bounce", "slow");
      });
    }
    $("#score-text").html(puntuacion);
  },
  scanRepetidosCol: function(){
    var imagen = new this.imagenes;
    var col = new this.obtenerColumnas;

    for(var i = 0; i < col.total; i++){
      for(var img = 0; img < imagen.total; img++){
        if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([0,1,2,3,4], col[i], puntuacion);

        }else if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([0,1,2,3], col[i], puntuacion);

        }else if($(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([1,2,3,4], col[i], puntuacion);

        }else if($(col[i][0]).attr("src") == imagen[img] && $(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([0,1,2], col[i], puntuacion);

        }else if($(col[i][1]).attr("src") == imagen[img] && $(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([1,2,3], col[i], puntuacion);

        }else if($(col[i][2]).attr("src") == imagen[img] && $(col[i][3]).attr("src") == imagen[img] && $(col[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([2,3,4], col[i], puntuacion);

        }else{
          console.log("Opcion no aplicada - Columna");
        }
      }
    }
  },
  scanRepetidosFil: function(){
    var imagen = new this.imagenes;
    var fil = new this.obtenerFilas;

    for(var i = 0; i < fil.total; i++){
      for(var img = 0; img < imagen.total; img++){
        if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 7;
          this.animacionAcertar([0,1,2,3,4,5,6], fil[i], puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 6;
          this.animacionAcertar([1,2,3,4,5,6], fil[i], puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 6;
          this.animacionAcertar([0,1,2,3,4,5], fil[i], puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([0,1,2,3,4], fil[i], puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([1,2,3,4,5], fil[i], puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 5;
          this.animacionAcertar([2,3,4,5,6], fil[i], puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([0,1,2,3], fil[i], puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([1,2,3,4], fil[i], puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([2,3,4,5], fil[i], puntuacion);

        }else if($(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 4;
          this.animacionAcertar([3,4,5,6], fil[i], puntuacion);

        }else if($(fil[i][0]).attr("src") == imagen[img] && $(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([0,1,2], fil[i], puntuacion);

        }else if($(fil[i][1]).attr("src") == imagen[img] && $(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([1,2,3], fil[i], puntuacion);

        }else if($(fil[i][2]).attr("src") == imagen[img] && $(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([2,3,4], fil[i], puntuacion);

        }else if($(fil[i][3]).attr("src") == imagen[img] && $(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([3,4,5], fil[i], puntuacion);

        }else if($(fil[i][4]).attr("src") == imagen[img] && $(fil[i][5]).attr("src") == imagen[img] && $(fil[i][6]).attr("src") == imagen[img]){

          puntuacion = puntuacion + 3;
          this.animacionAcertar([4,5,6], fil[i], puntuacion);

        }else{
          console.log("Opcion no aplicada - Fila");
        }
      }
    }
  }
}

$(document).ready(function(){
  juegoDulces.init();
});
