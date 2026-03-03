const host = window.location.hostname;

export const API_BASE =
    host === 'localhost' || host === '127.0.0.1'
        ? 'http://127.0.0.1:8000'
        : `http://${host}:8000`;