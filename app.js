// 1. Registrar el Service Worker (ruta relativa para GitHub Pages)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch((error) => console.error('Error al registrar el SW:', error));
}

// 2. Instalación: capturar el evento beforeinstallprompt
let eventoInstalacionDiferido = null;
const btnInstalar = document.getElementById('btn-instalar');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  eventoInstalacionDiferido = event;
  btnInstalar.hidden = false;
});

btnInstalar.addEventListener('click', () => {
  if (!eventoInstalacionDiferido) return;

  eventoInstalacionDiferido.prompt();
  eventoInstalacionDiferido.userChoice.then((resultado) => {
    if (resultado.outcome === 'accepted') {
      btnInstalar.hidden = true;
    }
    eventoInstalacionDiferido = null;
  });
});

// 3. iPhone: mostrar instrucciones manuales si no está instalada
function verificarEntornoIOS() {
  const esIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const estaInstalada = window.navigator.standalone === true ||
                        window.matchMedia('(display-mode: standalone)').matches;

  if (esIOS && !estaInstalada) {
    document.getElementById('instrucciones-ios').hidden = false;
  }
}

// 4. Cámara
let streamActual = null;
let modoCamaraActual = 'environment'; // 'environment' = trasera | 'user' = frontal
const visorVideo = document.getElementById('visor-camara');

function actualizarMensajeEstado(texto) {
  document.getElementById('mensaje-estado').textContent = texto;
}

// Apagar la cámara: detener todas las pistas (tracks)
function detenerCamaraActiva() {
  if (streamActual) {
    streamActual.getTracks().forEach((track) => {
      track.stop();
    });
    streamActual = null;
  }
}

// Encender la cámara con el lente indicado
function iniciarCamara(modo) {
  detenerCamaraActiva();

  const restricciones = {
    video: { facingMode: modo },
    audio: false
  };

  return navigator.mediaDevices.getUserMedia(restricciones)
    .then((stream) => {
      streamActual = stream;
      visorVideo.srcObject = stream;
      visorVideo.className = modo === 'user' ? 'espejo' : '';
      document.getElementById('controles').hidden = false;
      document.getElementById('btn-preparar-camara').hidden = true;
      actualizarMensajeEstado(`Cámara activa (${modo === 'environment' ? 'Trasera' : 'Frontal'})`);
    })
    .catch((error) => {
      if (error.name === 'NotAllowedError') {
        actualizarMensajeEstado('Permiso denegado. Habilita el acceso a la cámara en los ajustes de tu navegador.');
      } else if (error.name === 'NotFoundError') {
        actualizarMensajeEstado('No se detectó el sensor de cámara solicitado en este dispositivo.');
      } else {
        actualizarMensajeEstado(`Error al acceder al hardware: ${error.message}`);
      }
    });
}

// 5. Pre-Permiso: primer clic muestra el aviso, segundo clic enciende la cámara
document.getElementById('btn-preparar-camara').addEventListener('click', () => {
  document.getElementById('aviso-permiso').hidden = false;
});

document.getElementById('btn-confirmar-permiso').addEventListener('click', () => {
  document.getElementById('aviso-permiso').hidden = true;
  iniciarCamara(modoCamaraActual);
});

// 6. Cambiar entre cámara trasera y frontal
document.getElementById('btn-alternar-camara').addEventListener('click', () => {
  modoCamaraActual = modoCamaraActual === 'environment' ? 'user' : 'environment';
  iniciarCamara(modoCamaraActual);
});

// 7. Apagar la cámara
document.getElementById('btn-apagar-camara').addEventListener('click', () => {
  detenerCamaraActiva();
  visorVideo.srcObject = null;
  document.getElementById('controles').hidden = true;
  document.getElementById('btn-preparar-camara').hidden = false;
  actualizarMensajeEstado('Cámara apagada.');
});

// Al cargar la página
verificarEntornoIOS();
