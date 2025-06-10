import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const [nomeUsuario, setNomeUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nomeSalvo = localStorage.getItem("nomeUsuario");

    if (!token) {
      navigate("/login");
      return;
    }

    setNomeUsuario(nomeSalvo || "Usuário");
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1>
          Bem-vindo, <span className="user-name">{nomeUsuario}</span>!
        </h1>
        <p>
          Prepare-se para viver a melhor experiência em aluguel de veículos.{" "}
          <br />
          Encontre o carro ideal para cada momento, com rapidez, segurança e
          praticidade!
        </p>
      </div>
    </div>
  );
}

export default Home;
