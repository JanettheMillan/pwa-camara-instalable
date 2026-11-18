# Cámara de Evidencias (PWA)

Práctica de los Temas 6.1 y 6.2: instalabilidad con `manifest.json` y acceso ético a la cámara frontal y trasera.

## Archivos

- `index.html`: botón de instalar, instrucciones para iPhone, aviso de permiso, video y controles.
- `styles.css`: estilos.
- `app.js`: evento `beforeinstallprompt`, detección de iOS, pre-permiso, encendido, cambio y apagado de cámara.
- `sw.js`: Service Worker con estrategia Cache First.
- `manifest.json`: nombre, colores, modo `standalone` e iconos con rutas relativas.
- `icons/`: `icon-192.png` (192x192) e `icon-512.png` (512x512).

## Cómo probar

1. Abrir la URL de GitHub Pages en el celular.
2. Android: pulsar **Instalar en mi teléfono**. iPhone: Compartir → **Agregar a inicio**.
3. Pulsar **Usar la cámara**, leer el aviso y pulsar **Entendido, encender cámara**.
4. Probar **Girar cámara** y **Apagar**.
