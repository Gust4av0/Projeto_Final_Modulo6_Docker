import { useState, useEffect, useCallback } from "react";
import "../styles/Veiculos.css";
import {
  FiTrash,
  FiEdit,
  FiTag,
  FiCalendar,
  FiDollarSign,
} from "react-icons/fi";
import api from "../services/api";
import Swal from "sweetalert2";

export interface Veiculo {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  preco_por_dia: number;
  imagem: string;
  categoria: { id: number; nome: string } | null;
  locadora: { id: number; nome: string } | null;
  alugado: boolean;
}

const Veiculos = () => {
  const [filtros, setFiltros] = useState<{
    id: number | null;
    marca: string;
    modelo: string;
    ano: string;
    placa: string;
    preco_por_dia: string;
    imagem: string;
    categoria: string;
    locadora: string;
  }>({
    id: null,
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    preco_por_dia: "",
    imagem: "",
    categoria: "",
    locadora: "",
  });

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [categorias, setCategorias] = useState<{ id: number; nome: string }[]>(
    []
  );
  const [locadoras, setLocadoras] = useState<{ id: number; nome: string }[]>(
    []
  );
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;
  const obterCategoriasELocadoras = useCallback(async () => {
    try {
      const [categoriasResponse, locadorasResponse] = await Promise.all([
        api.get("/categorias"),
        api.get("/locadoras"),
      ]);
      setCategorias(categoriasResponse.data);
      setLocadoras(locadorasResponse.data);
    } catch {
      Swal.fire("Erro", "Erro ao carregar categorias e locadoras!", "error");
    }
  }, []);

  const obterVeiculos = useCallback(async () => {
    try {
      const response = await api.get("/veiculos");
      setVeiculos(response.data);
      // Se estiver na última página e for excluir o último item, volta para a anterior
      const totalPaginas = Math.ceil(response.data.length / itensPorPagina);
      if (paginaAtual > totalPaginas) {
        setPaginaAtual((prev) => (prev > 1 ? prev - 1 : 1));
      }
    } catch {
      Swal.fire("Erro", "Erro ao carregar veículos!", "error");
    }
  }, [paginaAtual]);

  useEffect(() => {
    obterVeiculos();
    obterCategoriasELocadoras();
  }, [obterVeiculos, obterCategoriasELocadoras]);

  const handleFiltroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limparFiltros = () => {
    setFiltros({
      id: null,
      marca: "",
      modelo: "",
      ano: "",
      placa: "",
      preco_por_dia: "",
      imagem: "",
      categoria: "",
      locadora: "",
    });
  };
  const deletarVeiculo = async (id: number) => {
    const confirmacao = await Swal.fire({
      title: "Tem certeza?",
      text: "Você deseja excluir este veículo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    });

    if (!confirmacao.isConfirmed) return;

    try {
      await api.delete(`/veiculos/${id}`);
      Swal.fire("Sucesso", "Veículo excluído com sucesso!", "success");
      const novaLista = veiculos.filter((v) => v.id !== id);
      setVeiculos(novaLista);
      if (novaLista.length === 0 && paginaAtual > 1) {
        setPaginaAtual((prev) => prev - 1);
      } else {
        obterVeiculos();
      }
    } catch {
      Swal.fire("Erro", "Erro ao excluir veículo!", "error");
    }
  };

  const salvarVeiculo = async () => {
    try {
      const veiculoData = {
        marca: filtros.marca,
        modelo: filtros.modelo,
        ano: Number(filtros.ano),
        placa: filtros.placa,
        preco_por_dia: Number(filtros.preco_por_dia),
        imagem: filtros.imagem,
        categoria_id: filtros.categoria ? Number(filtros.categoria) : null,
        locadora_id: filtros.locadora ? Number(filtros.locadora) : null,
      };

      if (filtros.id) {
        await api.put(`/veiculos/${filtros.id}`, veiculoData);
        Swal.fire("Sucesso", "Veículo atualizado com sucesso!", "success");
      } else {
        await api.post("/veiculos", veiculoData);
        Swal.fire("Sucesso", "Veículo cadastrado com sucesso!", "success");
      }

      obterVeiculos();
      limparFiltros();
    } catch (error: unknown) {
      const mensagem =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Erro ao salvar veículo!";
      Swal.fire("Erro", mensagem, "error");
    }
  };

  const editarVeiculo = (veiculo: Veiculo) => {
    setFiltros({
      id: veiculo.id,
      marca: veiculo.marca,
      modelo: veiculo.modelo,
      ano: String(veiculo.ano),
      placa: veiculo.placa,
      preco_por_dia: String(veiculo.preco_por_dia),
      imagem: veiculo.imagem,
      categoria: veiculo.categoria ? String(veiculo.categoria.id) : "",
      locadora: veiculo.locadora ? String(veiculo.locadora.id) : "",
    });
  };
  const alugarVeiculo = async (veiculoId: number) => {
    const { value: formValues } = await Swal.fire({
      title: "Alugar Veículo",
      html: `
    <div style="display: flex; flex-direction: column; align-items: center;">
      <label for="data-inicio" style="color: red; margin-bottom: 5px;">Data Início</label>
      <input id="data-inicio" type="date" class="swal2-input" style="width: 200px;" />
      
      <label for="data-fim" style="color: red; margin-top: 15px; margin-bottom: 5px;">Data Fim</label>
      <input id="data-fim" type="date" class="swal2-input" style="width: 200px;" />
    </div>
  `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Alugar",
      preConfirm: () => {
        const data_inicio = (
          document.getElementById("data-inicio") as HTMLInputElement
        ).value;
        const data_fim = (
          document.getElementById("data-fim") as HTMLInputElement
        ).value;

        if (!data_inicio || !data_fim) {
          Swal.showValidationMessage("Preencha as duas datas!");
          return;
        }

        return { data_inicio, data_fim };
      },
    });

    if (!formValues) return;

    try {
      const usuario_id = localStorage.getItem("usuario_id");
      if (!usuario_id) {
        Swal.fire("Erro", "Usuário não logado!", "error");
        return;
      }

      await api.post("/alugueis", {
        veiculo_id: veiculoId,
        usuario_id: Number(usuario_id),
        data_inicio: formValues.data_inicio,
        data_fim: formValues.data_fim,
      });

      Swal.fire("Sucesso", "Veículo alugado com sucesso!", "success");
      obterVeiculos();
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Erro ao alugar o veículo!";
      Swal.fire("Erro", msg, "error");
    }
  };

  const cancelarAluguel = async (veiculoId: number) => {
    try {
      const usuario_id = localStorage.getItem("usuario_id");
      if (!usuario_id) {
        Swal.fire("Erro", "Usuário não logado!", "error");
        return;
      }

      const result = await Swal.fire({
        title: "Cancelar Aluguel",
        text: "Você deseja cancelar este aluguel?",
        icon: "warning",
        background: "#1e1e2f", // fundo escuro
        color: "#ffffff",
        showCancelButton: true,
        confirmButtonColor: "#cc0000",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, cancelar",
        cancelButtonText: "Não",
      });

      if (!result.isConfirmed) return;

      const response = await api.get("/alugueis", {
        params: {
          veiculo_id: veiculoId,
          usuario_id,
        },
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("Nenhum aluguel encontrado");
      }

      const aluguel = response.data[0];
      await api.delete(`/alugueis/${aluguel.id}`);

      await obterVeiculos();
      Swal.fire("Sucesso", "Aluguel cancelado com sucesso!", "success");
    } catch (error: unknown) {
      console.error("Erro ao cancelar aluguel:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erro ao cancelar aluguel";
      Swal.fire("Erro", errorMessage, "error");
    }
  };

  const formatarPlaca = (placa: string) => {
    return placa.toUpperCase().replace(/(\w{3})(\w{4})/, "$1-$2");
  };

  const indexInicial = (paginaAtual - 1) * itensPorPagina;
  const indexFinal = paginaAtual * itensPorPagina;
  const veiculosPaginados = veiculos.slice(indexInicial, indexFinal);
  const totalPaginas = Math.ceil(veiculos.length / itensPorPagina);
  return (
    <div className="main">
    <div className="veiculos-container">
      <h1 className="titulo-filtro">Veículos</h1>

      <div className="filtros">
        <div className="filtro-inputs">
          <input
            name="marca"
            placeholder="Marca"
            value={filtros.marca}
            onChange={handleFiltroChange}
          />
          <input
            name="modelo"
            placeholder="Modelo"
            value={filtros.modelo}
            onChange={handleFiltroChange}
          />
          <input
            name="ano"
            placeholder="Ano"
            value={filtros.ano}
            onChange={handleFiltroChange}
          />
          <input
            name="placa"
            placeholder="Placa"
            value={filtros.placa}
            onChange={handleFiltroChange}
          />
          <input
            name="preco_por_dia"
            placeholder="Diária"
            value={filtros.preco_por_dia}
            onChange={handleFiltroChange}
          />
          <input
            name="imagem"
            placeholder="URL da Imagem"
            value={filtros.imagem}
            onChange={handleFiltroChange}
          />
          <select
            name="categoria"
            value={filtros.categoria}
            onChange={handleFiltroChange}
          >
            <option value="">Selecione a Categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
          <select
            name="locadora"
            value={filtros.locadora}
            onChange={handleFiltroChange}
          >
            <option value="">Selecione a Locadora</option>
            {locadoras.map((locadora) => (
              <option key={locadora.id} value={locadora.id}>
                {locadora.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="filtro-botoes">
          <button className="btn-adicionar" onClick={salvarVeiculo}>
            Adicionar
          </button>
          <button className="btn-limpar" onClick={limparFiltros}>
            Limpar
          </button>
        </div>
      </div>

      <div className="veiculos-card-container">
        {veiculosPaginados.map((veiculo) => (
          <div className="veiculo-card" key={veiculo.id}>
            <div className="veiculo-card-header">
              <h3>
                {veiculo.marca} {veiculo.modelo}
              </h3>
              <div className="veiculo-categoria">
                Categoria: {veiculo.categoria?.nome || "-"}
              </div>
              <div className="veiculo-categoria">
                Locadora: {veiculo.locadora?.nome || "-"}
              </div>
            </div>
            <img
              className="veiculo-imagem"
              src={veiculo.imagem}
              alt={veiculo.modelo}
            />
            <div className="veiculo-card-footer">
              <div className="veiculo-linha">
                <FiTag /> <span>Placa: {formatarPlaca(veiculo.placa)}</span>
              </div>
              <div className="veiculo-linha">
                <FiCalendar /> <span>Ano: {veiculo.ano}</span>
              </div>
              <div className="veiculo-linha">
                <FiDollarSign />{" "}
                <span>Diária: R$ {veiculo.preco_por_dia.toFixed(2)}</span>
              </div>
              <div className="acoes">
                <button
                  className="btn-acao"
                  title="Editar"
                  onClick={() => editarVeiculo(veiculo)}
                >
                  <FiEdit className="icon-edit" />
                </button>
                <button
                  className="btn-acao"
                  title="Excluir"
                  onClick={() => deletarVeiculo(veiculo.id)}
                >
                  <FiTrash className="icon-trash" />
                </button>
              </div>
              {veiculo.alugado ? (
                <button
                  className="botao-cancelar"
                  onClick={() => cancelarAluguel(veiculo.id)}
                >
                  Cancelar Aluguel
                </button>
              ) : (
                <button
                  className="botao-alugar"
                  onClick={() => alugarVeiculo(veiculo.id)}
                >
                  Alugar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="paginacao">
          <button
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaAtual} de {totalPaginas}
          </span>
          <button
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima
          </button>
        </div>
      )}
    </div>
    </div>
  );
};

export default Veiculos;
