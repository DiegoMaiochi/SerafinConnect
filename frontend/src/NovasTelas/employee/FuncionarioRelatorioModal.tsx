import React, { useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RelatorioItem {
  completedById: number;
  totalPedidos: number;
  totalFaturado: number;
  completedBy: {
    id: number;
    name: string;
  };
}

interface Props {
  onClose: () => void;
}

const FuncionarioRelatorioModal: React.FC<Props> = ({ onClose }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<RelatorioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRelatorio = async () => {
    if (!startDate || !endDate) {
      setError("Por favor, informe as duas datas.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken"); // ajuste conforme seu token
      const res = await fetch(
        `http://localhost:3000/api/orders-employee/relatorio?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Erro ao buscar relatório");
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Pedidos por Funcionário", 14, 22);

    doc.setFontSize(12);
    doc.text(`Período: ${startDate} a ${endDate}`, 14, 30);

    const tableColumn = ["Funcionário", "Total Pedidos", "Total Faturado (R$)"];
    const tableRows = data.map((item) => [
      item.completedBy?.name || "Desconhecido",
      item.totalPedidos.toString(),
      Number(item.totalFaturado).toFixed(2),
    ]);

    autoTable(doc, {
  startY: 40,
  head: [tableColumn],
  body: tableRows,
});

    doc.save(`relatorio_funcionarios_${startDate}_a_${endDate}.pdf`);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative max-h-[90vh] overflow-auto">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Fechar modal"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Relatório de Pedidos por Funcionário
        </h2>

        <div className="flex space-x-4 mb-4 flex-wrap">
          <label className="flex flex-col">
            Data início:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 rounded"
            />
          </label>
          <label className="flex flex-col">
            Data fim:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 rounded"
            />
          </label>
          <button
            onClick={fetchRelatorio}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition self-end"
            disabled={loading}
          >
            {loading ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {error && (
          <p className="text-red-600 mb-4 font-semibold" role="alert">
            {error}
          </p>
        )}

        {data.length > 0 && (
          <>
            <table className="w-full table-auto border-collapse border border-gray-300 mb-4">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-1 text-left">
                    Funcionário
                  </th>
                  <th className="border border-gray-300 px-3 py-1 text-right">
                    Total Pedidos
                  </th>
                  <th className="border border-gray-300 px-3 py-1 text-right">
                    Total Faturado (R$)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.completedById}>
                    <td className="border border-gray-300 px-3 py-1">
                      {item.completedBy?.name || "Desconhecido"}
                    </td>
                    <td className="border border-gray-300 px-3 py-1 text-right">
                      {item.totalPedidos}
                    </td>
                    <td className="border border-gray-300 px-3 py-1 text-right">
                      {Number(item.totalFaturado).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={gerarPDF}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            >
              Gerar PDF
            </button>
          </>
        )}

        {data.length === 0 && !loading && (
          <p className="text-gray-600">Nenhum dado para exibir.</p>
        )}
      </div>
    </div>
  );
};

export default FuncionarioRelatorioModal;
