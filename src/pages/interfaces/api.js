import axios from "axios";

// Define la URL base para localhost y para el entorno en línea
export const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

// Crear una instancia de axios autenticada para solicitudes adicionales
export const authenticatedApi = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL
  });

  return instance;
};

export default api;
