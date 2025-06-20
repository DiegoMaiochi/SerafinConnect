import React, { useState } from "react";
import { X } from "lucide-react";

const RelatorioModal = ({ onClose }) => {
  const [filtro, setFiltro] = useState("data");
  const [valor, setValor] = useState("");

  const handleGerar = async () => {
    try {
      const url = new URL("http://localhost:3000/api/pedidos/relatorio");
      url.searchParams.append("filtro", filtro);
      url.searchParams.append("valor", valor);

      const response = await fetch(url.toString(), {
        method: "GET",
      });

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "relatorio.pdf";
      link.click();
    } catch (err) {
      alert("Erro ao gerar relatório.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-500">Gerar Relatório</h2>
          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <label className="font-semibold block mb-1">Filtrar por:</label>
          <select
            className="w-full p-2 border rounded"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          >
            <option value="data">Data (AAAA-MM-DD)</option>
            <option value="cliente">Nome do Cliente</option>
          </select>
        </div>

        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder={filtro === "data" ? "Digite a data..." : "Digite o nome do cliente..."}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />

        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button onClick={handleGerar} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatorioModal;
