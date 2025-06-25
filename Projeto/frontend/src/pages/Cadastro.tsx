import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/cadastro.css";
import background from "../images/background.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Cadastro() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCPF] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [tentouCadastrar, setTentouCadastrar] = useState(false);

  const navigate = useNavigate();

  const verificarForcaSenha = (senha: string): string => {
    let forca = 0;
    if (senha.length >= 6) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[a-z]/.test(senha)) forca++;
    if (/\d/.test(senha)) forca++;
    if (/[@$!%*?&]/.test(senha)) forca++;

    if (forca <= 2) return "fraca";
    if (forca <= 4) return "media";
    return "forte";
  };

  const cadastrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setTentouCadastrar(true);
    setError("");

    if (!name || !email || !cpf || !password || !confirmPassword) {
      setError("Preencha todos os campos!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("E-mail inválido!");
      return;
    }

    const cpfNumeros = cpf.replace(/\D/g, "");
    if (cpfNumeros.length !== 11) {
      setError("CPF inválido! Deve conter 11 números.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }
      // 1124e2x
    try {
      const response = await axios.post("https://alugaaize.local/api/usuarios", {
        nome: name,
        email,
        cpf: cpfNumeros,
        senha: password,
      });

      if (response.status === 201) {
        navigate("/");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Erro ao cadastrar usuário.");
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="login-box">
        <h1>Cadastro</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={cadastrarUsuario}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-grande"
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-grande"
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCPF(e.target.value)}
              className="input-grande"
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => {
                const senha = e.target.value;
                setPassword(senha);
                setPasswordStrength(verificarForcaSenha(senha));
              }}
              className="input-grande"
            />
            <button
              type="button"
              className="toggle-password-cadastro"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash color="black" />
              ) : (
                <FaEye color="black" />
              )}
            </button>
          </div>
          {password && (
            <p className={`password-strength ${passwordStrength}`}>
              Força da senha: {passwordStrength.toUpperCase()}
            </p>
          )}
          <div className="input-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-grande"
            />
            <button
              type="button"
              className="toggle-password-cadastro"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash color="black" />
              ) : (
                <FaEye color="black" />
              )}
            </button>
          </div>
          {tentouCadastrar && password !== confirmPassword && (
            <p className="senha-nao-coincide">As senhas não coincidem</p>
          )}
          <button type="submit" className="login-button pequeno">
            Cadastrar
          </button>
        </form>
        <Link to="/" className="signup-link">
          Já tem uma conta? Faça login
        </Link>
      </div>
    </div>
  );
}

export default Cadastro;
