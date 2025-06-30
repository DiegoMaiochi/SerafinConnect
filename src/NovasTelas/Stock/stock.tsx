import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/tokenStorage";
import jsPDF from "jspdf";
import "jspdf-autotable";

export function Estoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(5);
  const [estoqueEditado, setEstoqueEditado] = useState({});
  const token = getAccessToken();
  const [salvando, setSalvando] = useState({});
  const [periodo, setPeriodo] = useState({ inicio: "", fim: "" });
  const [logsFiltrados, setLogsFiltrados] = useState([]);
  const [logsEstoque, setLogsEstoque] = useState([]);
  const [produtoLogSelecionado, setProdutoLogSelecionado] = useState(null);
  const [modalLogAberto, setModalLogAberto] = useState(false);

  useEffect(() => {
    fetchProdutos();
  }, []);

  // Busca produtos do backend e prepara estados
  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/api/produtos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const formatado = data.map((p) => ({
        ...p,
        estoque: p.quantity,
        nome: p.name,
        description: p.description || "",
      }));
      setProdutos(formatado);

      // Inicializa estoques editáveis
      const valoresIniciais = {};
      formatado.forEach((p) => {
        valoresIniciais[p.id] = p.estoque;
      });
      setEstoqueEditado(valoresIniciais);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualiza estoque no backend
  const atualizarEstoque = async (id, novoEstoque) => {
    setSalvando((prev) => ({ ...prev, [id]: true }));
    const startTime = Date.now();

    try {
      const response = await fetch(`http://localhost:3000/api/estoque/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: novoEstoque }),
      });

      if (response.ok) {
        setProdutos((prev) =>
          prev.map((produto) =>
            produto.id === id ? { ...produto, estoque: novoEstoque } : produto
          )
        );
      } else {
        alert("Erro ao atualizar estoque.");
      }
    } catch (error) {
      console.error("Erro na atualização:", error);
    } finally {
      // Garante no mínimo 1s para o "salvando"
      const elapsed = Date.now() - startTime;
      const delay = Math.max(0, 1000 - elapsed);

      setTimeout(() => {
        setSalvando((prev) => ({ ...prev, [id]: false }));
      }, delay);
    }
  };

  // Input estoque editável
  const handleInputChange = (id, valor) => {
    const parsed = parseInt(valor);
    if (!isNaN(parsed) && parsed >= 0) {
      setEstoqueEditado((prev) => ({ ...prev, [id]: parsed }));
    }
  };

  const handleSalvar = (id) => {
    const novoEstoque = estoqueEditado[id];
    atualizarEstoque(id, novoEstoque);
  };

  // Busca logs de movimentação por produto e abre modal
  const fetchLogsEstoque = async (productId) => {
    try {
      const res = await fetch(`http://localhost:3000/api/estoque/logs/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLogsEstoque(data);
      setProdutoLogSelecionado(productId);
      setModalLogAberto(true);
    } catch (error) {
      console.error("Erro ao buscar logs de estoque:", error);
    }
  };

  // Busca logs filtrados por período
  const buscarLogsPorPeriodo = async () => {
    if (!periodo.inicio || !periodo.fim) {
      alert("Selecione um período válido.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/logs-periodo?startDate=${periodo.inicio}&endDate=${periodo.fim}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      setLogsFiltrados(data);
    } catch (err) {
      console.error("Erro ao buscar logs por período:", err);
    }
  };

  // Gera PDF dos logs filtrados
  const gerarPDFLogsEstoque = () => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Relatório de Movimentação de Estoque", 14, 20);
  doc.setFontSize(10);
  doc.text(`Período: ${periodo.inicio} até ${periodo.fim}`, 14, 28);

  // Cabeçalho da tabela
  const startY = 35;
  const lineHeight = 8;
  const colWidths = [50, 30, 30, 30, 40]; // largura das colunas
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginLeft = 14;

  // Desenha o cabeçalho manualmente
  let x = marginLeft;
  const headers = ["Produto", "Ação", "Usuário", "Quantidade", "Data"];
  headers.forEach((header, i) => {
    doc.text(header, x + 2, startY);
    x += colWidths[i];
  });

  // Desenha uma linha abaixo do cabeçalho
  doc.line(marginLeft, startY + 2, marginLeft + colWidths.reduce((a, b) => a + b), startY + 2);

  // Começa a preencher as linhas abaixo
  let y = startY + lineHeight;

  logsFiltrados.forEach((log, index) => {
    if (y > doc.internal.pageSize.getHeight() - 20) {
      // Adiciona nova página se passar do limite
      doc.addPage();
      y = 20;
    }

    x = marginLeft;

    // Coluna Produto
    doc.text(log.produto?.name || "N/A", x + 2, y);
    x += colWidths[0];

    // Coluna Ação
    doc.text(log.acao, x + 2, y);
    x += colWidths[1];

    // Coluna Usuário
    doc.text(log.usuario || "-", x + 2, y);
    x += colWidths[2];

    // Coluna Quantidade
    const qtd = log.detalhes?.quantity !== undefined ? String(log.detalhes.quantity) : "-";
    doc.text(qtd, x + 2, y);
    x += colWidths[3];

    // Coluna Data (formatada)
    const dataFormatada = new Date(log.criado_em).toLocaleString("pt-BR");
    doc.text(dataFormatada, x + 2, y);
    y += lineHeight;
  });

  doc.save("movimentacao_estoque.pdf");
};


  // Filtros e paginação dos produtos
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;
  const produtosPaginados = produtosFiltrados.slice(inicio, fim);
  const totalPaginas = Math.ceil(produtosFiltrados.length / porPagina);

  return (
    <div className="m-7">
      <h1 className="text-red-500 font-black text-4xl mb-4">Controle de Estoque</h1>

      <input
        type="text"
        placeholder="Buscar produto..."
        className="mb-4 px-4 py-2 border rounded w-full md:w-1/2"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      {/* Modal histórico de logs do produto */}
      {modalLogAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl shadow-lg relative">
            <button
              onClick={() => setModalLogAberto(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-600">Histórico de Estoque</h2>

            {logsEstoque.length === 0 ? (
              <p className="text-gray-500">Nenhuma movimentação registrada.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Ação</th>
                      <th className="text-left p-2">Usuário</th>
                      <th className="text-left p-2">Quantidade</th>
                      <th className="text-left p-2">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsEstoque.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 capitalize">{log.acao}</td>
                        <td className="p-2">{log.usuario}</td>
                        <td className="p-2">{log.detalhes?.quantity ?? "-"}</td>
                        <td className="p-2">{new Date(log.criado_em).toLocaleString("pt-BR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros de período e geração de relatório */}
      <div className="my-4 p-4 bg-gray-50 rounded-md shadow">
        <h2 className="font-bold text-lg mb-2">Relatório de Estoque por Período</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="date"
            value={periodo.inicio}
            onChange={(e) => setPeriodo((prev) => ({ ...prev, inicio: e.target.value }))}
            className="border rounded px-2 py-1"
          />
          <input
            type="date"
            value={periodo.fim}
            onChange={(e) => setPeriodo((prev) => ({ ...prev, fim: e.target.value }))}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={buscarLogsPorPeriodo}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          <button
            onClick={gerarPDFLogsEstoque}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            disabled={logsFiltrados.length === 0}
          >
            Gerar PDF
          </button>
        </div>
      </div>

      {/* Listagem de produtos com estoque editável */}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {produtosPaginados.map((produto) => (
              <div
                key={produto.id}
                className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
              >
                <button
                  onClick={() => fetchLogsEstoque(produto.id)}
                  className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300"
                >
                  Histórico
                </button>

                <div>
                  <h2 className="font-bold text-lg">{produto.nome}</h2>
                  <p className="text-gray-600 text-sm">{produto.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <label>Estoque:</label>
                  <input
                    type="number"
                    min={0}
                    className="border px-2 py-1 rounded w-20 text-center"
                    value={estoqueEditado[produto.id] ?? produto.estoque}
                    onChange={(e) => handleInputChange(produto.id, e.target.value)}
                  />
                  <button
                    onClick={() => handleSalvar(produto.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={salvando[produto.id]}
                  >
                    {salvando[produto.id] ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Paginação */}
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={pagina === 1}
              onClick={() => setPagina(pagina - 1)}
            >
              Anterior
            </button>
            <span className="px-3 py-1">
              {pagina} / {totalPaginas}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              disabled={pagina === totalPaginas}
              onClick={() => setPagina(pagina + 1)}
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
}
