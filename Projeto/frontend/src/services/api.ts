import axios from "axios";

const api = axios.create({
  baseURL: "https://alugaaize.local/api", // URL base da API
});

// "http://localhost:8080/api"
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
