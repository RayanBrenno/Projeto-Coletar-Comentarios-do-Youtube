import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Não precisa mais do header "ngrok-skip-browser-warning": era só para
  // pular a tela de aviso do túnel ngrok usado antigamente; o backend
  // agora roda direto (HTTPS nativo, sem túnel).
  // headers: {
  //   "ngrok-skip-browser-warning": "true",
  // },
});

export default api;