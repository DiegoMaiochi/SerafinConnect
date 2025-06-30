import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAccessToken } from "../../utils/tokenStorage";

export function RelatorioConsumoModal({ aberto, onClose }) {
  if (!aberto) return null;

  const token = getAccessToken();
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  async function buscarRelatorio() {
    if (!inicio || !fim) return alert("Preencha as datas");
    setCarregando(true);
    try {
      const res = await fetch(`http://localhost:3000/api/relatorio/mesas?start=${inicio}&end=${fim}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setDados(json);
    } catch (err) {
      alert("Erro ao buscar relatório");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  }

  function gerarPDF() {
    const doc = new jsPDF();
    doc.text("Relatório de Consumo por Mesa", 14, 15);
    doc.text(`Período: ${inicio} até ${fim}`, 14, 25);

    const tableData = dados.map(item => [
      item.table?.id,
      item.table?.identifier,
      item.totalPedidos,
      `R$ ${Number(item.totalConsumo).toFixed(2)}`
    ]);

    doc.autoTable({
      startY: 35,
      head: [["ID Mesa", "Identificador", "Total Pedidos", "Total Consumido"]],
      body: tableData
    });

    doc.save("relatorio_mesas.pdf");
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[700px] max-h-[90vh] overflow-auto relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">✕</button>

        <h1 className="text-2xl font-bold text-red-500 mb-4">Relatório de Consumo por Mesa</h1>

        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={buscarRelatorio}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Buscar
          </button>
          <button
            onClick={gerarPDF}
            disabled={dados.length === 0}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <FiDownload /> PDF
          </button>
        </div>

        {carregando ? (
          <p>Carregando...</p>
        ) : (
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-gray-300">
                <th className="border p-2">ID Mesa</th>
                <th className="border p-2">Identificador</th>
                <th className="border p-2">Total Pedidos</th>
                <th className="border p-2">Total Consumido</th>
              </tr>
            </thead>
            <tbody>
              {dados.map((mesa) => (
                <tr key={mesa.tableId}>
                  <td className="border p-2">{mesa.table?.id}</td>
                  <td className="border p-2">{mesa.table?.identifier}</td>
                  <td className="border p-2">{mesa.totalPedidos}</td>
                  <td className="border p-2">R$ {Number(mesa.totalConsumo).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
