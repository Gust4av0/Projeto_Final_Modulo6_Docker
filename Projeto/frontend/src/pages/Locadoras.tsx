import { useState, useEffect, useCallback } from "react";
import "../styles/Locadoras.css";
import { FiTrash, FiEdit } from "react-icons/fi";
import api from "../services/api";
import Modal from "../components/ModalLocadoras";
import Swal from "sweetalert2";

export interface Locadora {
  id: number;
  nome: string;
  cidade: string;
  estado: string;
}

const Locadoras = () => {
  const [locadoras, setLocadoras] = useState<Locadora[]>([]);
  const [formData] = useState({
    nome: "",
    cidade: "",
    estado: "",
  });
  const [locadoraEditando, setLocadoraEditando] = useState<Locadora | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const obterLocadoras = useCallback(async () => {
    try {
      const response = await api.get("/locadoras", { params: formData });
      setLocadoras(response.data);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao carregar locadoras!",
      });
    }
  }, [formData]);

  useEffect(() => {
    obterLocadoras();
  }, [obterLocadoras]);


  const deletarLocadora = async (id: number) => {
    const resultado = await Swal.fire({
      icon: "warning",
      title: "Confirmar exclusão",
      text: "Tem certeza que deseja excluir esta locadora?",
      background: "#1e1e2f", // fundo escuro
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#cc0000",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
      await api.delete(`/locadoras/${id}`);
      await obterLocadoras();
      Swal.fire({
        icon: "success",
        title: "Locadora excluída",
        text: "A locadora foi excluída com sucesso.",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao excluir locadora!",
      });
    }
  };


  return (
    <div className="locadoras-container">
      <div className="locadoras-overlay"></div>
      <div className="locadoras-content">
        <h1 className="locadoras-title">Locadoras</h1>
        <div className="locadoras-filtro-botoes">
          <button
            className="locadoras-btn-adicionar"
            onClick={() => {
              setLocadoraEditando(null);
              setModalOpen(true);
            }}
          >
            Adicionar
          </button>
        </div>
        <div className="locadoras-tabela-container">
          <table className="locadoras-tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cidade</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {locadoras.map((locadora) => (
                <tr key={locadora.id}>
                  <td>{locadora.nome}</td>
                  <td>{locadora.cidade}</td>
                  <td>{locadora.estado}</td>
                  <td className="locadoras-acoes">
                    <button
                      className="locadoras-btn-acao"
                      title="Editar"
                      onClick={() => {
                        setLocadoraEditando(locadora);
                        setModalOpen(true);
                      }}
                    >
                      <FiEdit color="orange" />
                    </button>
                    <button
                      className="locadoras-btn-acao"
                      title="Excluir"
                      onClick={() => deletarLocadora(locadora.id)}
                    >
                      <FiTrash color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {modalOpen && (
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            atualizarLista={obterLocadoras}
            locadora={locadoraEditando}
          />
        )}
      </div>
    </div>
  );
};

export default Locadoras;
