// Obtiene el nombre del host (dominio o IP) desde donde se está cargando la aplicación
const host = window.location.hostname;

/**
 * URl base para las peticiones a la API del backend.
 * Si el cliente está en local (localhost o 127.0.0.1), apunta al puerto 8000 en el mismo entorno.
 * Si está en red (ej. accesible por otra IP en la LAN), usa esa misma IP pero con el puerto 8000.
 */
export const API_BASE =
    host === 'localhost' || host === '127.0.0.1'
        ? 'http://127.0.0.1:8000'
        : `http://${host}:8000`;