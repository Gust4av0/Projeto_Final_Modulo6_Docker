import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // URL base da API
});

// URL API ANTIGA:  http://localhost:3000
// Interceptor: adiciona o token no header das requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
