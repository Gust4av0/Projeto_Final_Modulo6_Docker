import { useState, useEffect, useCallback } from "react";
import "../styles/Categorias.css";
import { FiTrash, FiEdit } from "react-icons/fi";
import api from "../services/api";
import ModalCategoria from "../components/ModalCategorias";
import Swal from "sweetalert2";

export interface Categoria {
  id: number;
  nome: string;
}

const Categorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [filtroNome] = useState("");
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);

  const obterCategorias = useCallback(async () => {
    try {
      const response = await api.get("/categorias", {
        params: { nome: filtroNome },
      });
      setCategorias(response.data);
    } catch {
      Swal.fire("Erro", "Erro ao carregar categorias!", "error");
    }
  }, [filtroNome]);

  useEffect(() => {
    obterCategorias();
  }, [obterCategorias]);

  const deletarCategoria = async (id: number) => {
    const confirm = await Swal.fire({
      title: "Tem certeza?",
      text: "Deseja realmente excluir esta categoria?",
      icon: "warning",
      background: "#1e1e2f", // fundo escuro
      color: "#ffffff",
      showCancelButton: true,
      confirmButtonColor: "#cc0000",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir!",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await api.delete(`/categorias/${id}`);
      Swal.fire("Sucesso", "Categoria excluída com sucesso!", "success");
      obterCategorias();
    } catch {
      Swal.fire("Erro", "Erro ao excluir categoria!", "error");
    }
  };

  return (
    <div className="categorias-container">
      <div className="categorias-overlay"></div>
      <div className="categorias-content">
        <h1 className="categorias-title">Categorias</h1>

        <div className="categorias-filtro-botoes">
          <button
            className="categorias-btn-adicionar"
            onClick={() => {
              setCategoriaEditando(null);
              setModalOpen(true);
            }}
          >
            Adicionar
          </button>
        </div>

        <div className="categorias-tabela-container">
          <table className="categorias-tabela">
            <thead>
              <tr>
                <th>Nome da Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nome}</td>
                  <td className="categorias-acoes">
                    <button
                      className="categorias-btn-acao"
                      title="Editar"
                      onClick={() => {
                        setCategoriaEditando(categoria);
                        setModalOpen(true);
                      }}
                    >
                      <FiEdit color="orange" />
                    </button>
                    <button
                      className="categorias-btn-acao"
                      title="Excluir"
                      onClick={() => deletarCategoria(categoria.id)}
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
          <ModalCategoria
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            atualizarLista={obterCategorias}
            categoria={categoriaEditando}
          />
        )}
      </div>
    </div>
  );
};

export default Categorias;
