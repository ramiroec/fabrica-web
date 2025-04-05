import axios from "axios";

// Define la URL base para localhost y para el entorno en línea
const LOCAL_API_BASE_URL = "http://localhost:3000/api";
const ONLINE_API_BASE_URL = "https://isopar-api.onrender.com/api";

// Determina si la aplicación está en ejecución local o en línea
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

// Selecciona la URL base según la condición
export const API_BASE_URL = isLocalhost ? LOCAL_API_BASE_URL : ONLINE_API_BASE_URL;

// Contraseña simple para autenticar las solicitudes
const API_PASSWORD = "my_teki-secure_password"; // Cambia esto por una contraseña más segura

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_PASSWORD}`,  // Añade la contraseña o token al encabezado
  }
});

// Crear una instancia de axios autenticada para solicitudes adicionales
export const authenticatedApi = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${API_PASSWORD}`,  // Añadir el encabezado de autorización aquí
    }
  });

  return instance;
};

export default api;
