import { useEffect, useState } from "react";
import { FiFilter, FiSearch } from "react-icons/fi";
import { getAccessToken } from "../../utils/tokenStorage";

export function Mesas() {
  const token = getAccessToken();

  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = 5;

  // Modal para nova mesa
  const [modalAberto, setModalAberto] = useState(false);
  const [novoIdentifier, setNovoIdentifier] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Carregar mesas
  useEffect(() => {
    fetchMesas();
  }, []);

  async function fetchMesas() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/mesas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMesas(data);
    } catch (err) {
      console.error("Erro ao buscar mesas:", err);
      alert("Erro ao buscar mesas");
    } finally {
      setLoading(false);
    }
  }

  // Filtrar mesas pela busca
  const mesasFiltradas = mesas.filter(mesa =>
    mesa.identifier.toLowerCase().includes(busca.toLowerCase())
  );

  const totalPaginas = Math.ceil(mesasFiltradas.length / porPagina);
  const mesasPaginadas = mesasFiltradas.slice((pagina - 1) * porPagina, pagina * porPagina);

  // Criar nova mesa
  async function handleCriarMesa() {
    if (!novoIdentifier.trim()) {
      alert("Informe um identificador para a mesa.");
      return;
    }
    setSalvando(true);
    try {
      const res = await fetch("http://localhost:3000/api/mesa", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ identifier: novoIdentifier, status: false })
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert(errorData.error || "Erro ao criar mesa");
        return;
      }
      await fetchMesas();
      setModalAberto(false);
      setNovoIdentifier("");
    } catch (err) {
      console.error("Erro ao criar mesa:", err);
      alert("Erro ao criar mesa");
    } finally {
      setSalvando(false);
    }
  }

  // Toggle status ativo/inativo
  async function toggleStatus(mesa) {
    try {
      const res = await fetch("http://localhost:3000/api/mesa", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: mesa.id, status: !mesa.status })
      });
      if (!res.ok) {
        alert("Erro ao atualizar status da mesa");
        return;
      }
      await fetchMesas();
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status da mesa");
    }
  }

  return (
    <div className="m-7">
      <div>
        <h1 className="text-red-500 font-black text-5xl mt-4">MESAS</h1>
        <h3 className="font-bold">Crie e gerencie as mesas de seu estabelecimento.</h3>
        <hr className="border-y-2 w-full mt-2 border-gray-200" />
      </div>

      <div className="flex mt-4 ml-10 items-center gap-2">
        <div className="bg-gray-200 w-4/5 p-1 rounded-2xl flex items-center">
          <FiSearch size={25} className="text-red-500 ml-2" />
          <input
            type="text"
            placeholder="Buscar mesa por identificador..."
            className="bg-transparent border-none outline-none px-3 flex-grow"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div>
          <FiFilter size={25} className="text-red-500 mt-1 ml-2 cursor-pointer" />
        </div>
        <div>
          <button
            onClick={() => setModalAberto(true)}
            className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2 hover:bg-green-500 transition"
          >
            + ADICIONAR
          </button>
        </div>
      </div>

      <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl min-h-[200px]">
        {loading ? (
          <p>Carregando mesas...</p>
        ) : mesasPaginadas.length === 0 ? (
          <p>Nenhuma mesa encontrada.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-300">
                <th className="p-3 border border-gray-400 text-left">ID</th>
                <th className="p-3 border border-gray-400 text-left">Identificador</th>
                <th className="p-3 border border-gray-400 text-left">Status</th>
                <th className="p-3 border border-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {mesasPaginadas.map(mesa => (
                <tr key={mesa.id} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-400">{mesa.id}</td>
                  <td className="p-3 border border-gray-400">{mesa.identifier}</td>
                  <td className="p-3 border border-gray-400">
                    {mesa.status ? (
                      <span className="text-green-600 font-bold">Ativa</span>
                    ) : (
                      <span className="text-red-600 font-bold">Inativa</span>
                    )}
                  </td>
                  <td className="p-3 border border-gray-400 text-center">
                    <button
                      onClick={() => toggleStatus(mesa)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      {mesa.status ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Paginação */}
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={pagina === 1}
            onClick={() => setPagina(pagina - 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="px-3 py-1">
            {pagina} / {totalPaginas}
          </span>
          <button
            disabled={pagina === totalPaginas}
            onClick={() => setPagina(pagina + 1)}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Modal Criar Mesa */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg relative">
            <button
              onClick={() => setModalAberto(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Nova Mesa</h2>

            <input
              type="text"
              placeholder="Identificador da mesa"
              className="border rounded w-full p-2 mb-4"
              value={novoIdentifier}
              onChange={(e) => setNovoIdentifier(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalAberto(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                disabled={salvando}
              >
                Cancelar
              </button>
              <button
                onClick={handleCriarMesa}
                className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
