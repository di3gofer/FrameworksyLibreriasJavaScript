var juegoActivo = 0
    movimientos = 1
    puntuacion = 0
    totalImagenes = 35
    totalFilas = 5

function inicioTiempo(){
  $('#timer').timer({
    //http://jquerytimer.com/
    duration: '5s',
    format: '%M:%S',
    callback: function(){
      juegoActivo = 2;
      terminarJuego();
    }
  });
}

function animacionTitulo(){
  setInterval(function(){
    $(".main-titulo").switchClass("main-titulo","main-titulo-efecto", 200),
    $(".main-titulo").switchClass("main-titulo-efecto","main-titulo", 200)
  }, 100);
}

function imagenes(){
  var i = 0;
  this[i++] = "image/1.png";
  this[i++] = "image/2.png";
  this[i++] = "image/3.png";
  this[i++] = "image/4.png";
  this.total = i;
}

function cargarImagenes(cant){
  for(var i = 1; i <= totalImagenes; i++) {
    $(".panel-tablero").append('<div class="col-' + i + '"></div>');
  }
  var num = 1;
  for(var i = 0; i < cant; i++) {
    var imagen = new imagenes();
    var src = imagen[Math.floor(Math.random() * imagen.total)];
    $(".col-" + num).html("<img src=" + src + " class='img-" + num + "'>");
    $(".img-" + num ).draggable({
      revert: true,
      containment: ".panel-tablero",
      start: function(){
        if(juegoActivo == 1){
          var elemento = this;
          $("#movimientos-text").html(movimientos++);
        }
      }
    });
    num++;
  }
}

function iniciarJuego(){
  $(".btn-reinicio").html('Reiniciar');
  juegoActivo = 1;
  inicioTiempo();
}

function terminarJuego(){
  $(".panel-tablero").hide("slide", {direction: "left"}, "slow", function(){
    $(".time").hide("slide", {direction: "left"}, "slow");
    $(".panel-score").animate({width: "390%"}, 1000);
    if(juegoActivo != 1){
      $(".panel-score").prepend('<h1 class="main-titulo-2">Juego Terminado</h1>');
    }    
  });
}

function reiniciarJuego(){
  $('#timer').timer('remove');
  $(".btn-reinicio").html('Iniciar');
  $("#timer").html('02:00');
  $("#movimientos-text").html('0');
  $(".panel-tablero").html('');
  movimientos = 1;
  cargarImagenes(totalImagenes);

  $(".main-titulo-2").remove();
  $(".panel-score").animate({width: "25%"}, 1000, function(){
    $(".panel-tablero").show("slide", {direction: "left"}, "slow");
    $(".time").show("slide", {direction: "left"}, "slow");
  });
  juegoActivo = 0;
}

$(document).ready(function(){
  $(".btn-reinicio").on("click", function(){
    switch(juegoActivo){
      case 0:
        iniciarJuego();
        break;
      case 1:
        terminarJuego();
        break;
      case 2:
        reiniciarJuego();
        break;
      default:
        console.log('Error en el estado juegoActivo');
    }
  });
  animacionTitulo();
  cargarImagenes(totalImagenes);
});
