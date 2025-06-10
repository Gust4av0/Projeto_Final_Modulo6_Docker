import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import api from "../services/api";
import { AxiosError } from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type UserType = {
  nome: string;
  email: string;
};

function Login({ setUser }: { setUser: (user: UserType) => void }) {
  const [emailOuCpf, setEmailOuCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const realizarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setloading(true);
    setError("");

    try {
      const isCpf = /^\d{11}$/.test(emailOuCpf.replace(/\D/g, ""));

      const payload = isCpf
        ? { cpf: emailOuCpf, senha: password }
        : { email: emailOuCpf, senha: password };

      const response = await api.post("/login", payload);

      const { token, nome, id } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("nomeUsuario", nome);
      localStorage.setItem("usuario_id", id);

      setUser({ nome, email: emailOuCpf });

      // Aguardar 5 segundos com loading ativo antes de navegar
      setTimeout(() => {
        setloading(false);
        navigate("/home");
      }, 1);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Erro ao fazer login!");
      setloading(false);
    }
  };

  return (
    <div className="login-container">
      <title>Login - Aluga Aí Zé</title>
      <link rel="icon" type="image/png" href="../images/favicon.jpg" />

      {loading && (
        <div className="overlay-loading">
          <div className="spinner" />
        </div>
      )}

      <div className="login-box">
        <h1>Login</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={realizarLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="E-mail"
              value={emailOuCpf}
              onChange={(e) => setEmailOuCpf(e.target.value)}
              className="input-grande"
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-grande"
            />
            <button
              type="button"
              className="toggle-password-login"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash color="black" />
              ) : (
                <FaEye color="black" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="login-button pequeno"
            disabled={loading}
          >
            {!loading ? "Entrar" : "Carregando"}
          </button>
        </form>

        <Link to="/cadastro" className="signup-link">
          Criar uma conta
        </Link>
      </div>
    </div>
  );
}

export default Login;
