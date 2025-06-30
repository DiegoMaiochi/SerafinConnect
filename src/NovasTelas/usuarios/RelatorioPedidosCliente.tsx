import { useEffect, useState } from "react";
import { FiXCircle } from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Pedido {
  id: string;
  totalOrder: number;
  paymentType: string;
  status: string;
  createdAt: string;
}

interface RelatorioPedidosClienteProps {
  clienteId: number | string;
  isOpen: boolean;
  onClose: () => void;
}

export function RelatorioPedidosCliente({ clienteId, isOpen, onClose }: RelatorioPedidosClienteProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchPedidos() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:3000/api/clientes/${clienteId}/pedidos`);
        if (!res.ok) throw new Error("Erro ao buscar pedidos.");
        const data = await res.json();
        setPedidos(data);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [clienteId, isOpen]);

  function gerarPdf() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Relatório de Pedidos", 14, 22);

    const head = [["ID", "Total (R$)", "Pagamento", "Status", "Data"]];

    const body = pedidos.map((pedido) => [
      pedido.id,
      pedido.totalOrder.toFixed(2),
      pedido.paymentType,
      pedido.status,
      new Date(pedido.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head,
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [220, 53, 69] }, // vermelho
    });

    doc.save(`relatorio-pedidos-cliente-${clienteId}.pdf`);
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-[90vw] max-w-4xl max-h-[80vh] overflow-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-red-600 hover:text-red-800"
          title="Fechar"
        >
          <FiXCircle size={28} />
        </button>

        <h2 className="text-2xl font-bold text-center p-4 border-b border-gray-300">
          Relatório de Pedidos do Cliente #{clienteId}
        </h2>

        <div className="p-4">
          {loading && <p>Carregando pedidos...</p>}
          {error && <p className="text-red-600">Erro: {error}</p>}
          {!loading && !error && pedidos.length === 0 && <p>Nenhum pedido encontrado.</p>}

          {!loading && !error && pedidos.length > 0 && (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-red-500 text-white">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Total (R$)</th>
                    <th className="p-2 border">Pagamento</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id} className="even:bg-gray-100">
                      <td className="p-2 border break-all">{pedido.id}</td>
                      <td className="p-2 border">{pedido.totalOrder.toFixed(2)}</td>
                      <td className="p-2 border capitalize">{pedido.paymentType}</td>
                      <td className="p-2 border capitalize">{pedido.status}</td>
                      <td className="p-2 border">
                        {new Date(pedido.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                onClick={gerarPdf}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Gerar PDF
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
